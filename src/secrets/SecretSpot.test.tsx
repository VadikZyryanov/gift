import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AudioProvider } from '../audio/AudioProvider';
import { GameProvider } from '../game/GameProvider';
import { gameContent } from '../game/content';
import { createInitialProgress } from '../game/progress';
import { readProgress, writeProgress } from '../game/storage';
import { pouchIds } from '../game/types';
import { FinaleScene } from '../finale/FinaleScene';
import { SecretSpot } from './SecretSpot';

beforeEach(() => {
  localStorage.clear();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

describe('secret keepsakes', () => {
  it('saves a discovery before showing the note and counts repeated taps only once', async () => {
    const user = userEvent.setup();
    render(<GameProvider><AudioProvider>
      <SecretSpot secretId="white-bueno" label="Белая обёртка"><span>Обёртка</span></SecretSpot>
    </AudioProvider></GameProvider>);
    const spot = screen.getByRole('button', { name: 'Белая обёртка' });
    fireEvent.click(spot);
    fireEvent.click(spot);
    expect(readProgress(localStorage, gameContent.revision).progress.foundSecrets).toEqual(['white-bueno']);
    expect(screen.getByRole('dialog', { name: 'Белый Bueno' })).toBeVisible();
    expect(screen.queryByText(/\d из 3/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'К предмету' }));
    await user.click(spot);
    expect(readProgress(localStorage, gameContent.revision).progress.foundSecrets).toEqual(['white-bueno']);
    expect(readProgress(localStorage, gameContent.revision).progress.completedPouches).toEqual([]);
  });

  it('does not reopen a found note or replay its reward on remount', () => {
    writeProgress(localStorage, { ...createInitialProgress(gameContent.revision), foundSecrets: ['white-bueno'] });
    render(<GameProvider><AudioProvider>
      <SecretSpot secretId="white-bueno" label="Белая обёртка"><span>Обёртка</span></SecretSpot>
    </AudioProvider></GameProvider>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Белая обёртка' })).toBeEnabled();
  });

  it('does not gate the ordinary finale and reveals the bonus only after the final discovery', async () => {
    const user = userEvent.setup();
    writeProgress(localStorage, {
      ...createInitialProgress(gameContent.revision), completedPouches: [...pouchIds],
      chestOpened: true, letterOpened: true, secondBottomOpened: true, scene: { kind: 'finale' },
    });
    const view = render(<GameProvider><AudioProvider><FinaleScene /></AudioProvider></GameProvider>);
    expect(screen.getByText('Маленькие тайны: 0 из 3')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Перечитать письмо' })).toBeEnabled();
    expect(screen.queryByRole('article', { name: 'Ещё кое-что для тебя' })).not.toBeInTheDocument();
    view.unmount();
    const progress = readProgress(localStorage, gameContent.revision).progress;
    writeProgress(localStorage, { ...progress, foundSecrets: ['white-bueno', 'green-dress'] });
    render(<GameProvider><AudioProvider><FinaleScene />
      <SecretSpot secretId="black-g-class" label="Наклейка с чёрной машиной"><span>Машина</span></SecretSpot>
    </AudioProvider></GameProvider>);
    expect(screen.getByText('Маленькие тайны: 2 из 3')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Наклейка с чёрной машиной' }));
    await user.click(screen.getByRole('button', { name: 'К предмету' }));
    expect(screen.getByText('Маленькие тайны: 3 из 3')).toBeVisible();
    expect(screen.getByRole('article', { name: 'Ещё кое-что для тебя' })).toBeVisible();
  });
});
