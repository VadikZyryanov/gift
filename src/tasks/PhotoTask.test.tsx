import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { gameContent } from '../game/content';
import type { PhotoDraft } from '../game/types';
import { PhotoTask } from './PhotoTask';

function Harness({ initialDraft }: { initialDraft?: PhotoDraft }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <PhotoTask task={gameContent.pouches.journey.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

describe('PhotoTask', () => {
  it('allows a wrong postcard, a changed selection and a correct retry', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'Турция' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent('не первой');
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Дубай' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('restores the selected postcard and keeps its name usable when its image fails', async () => {
    const user = userEvent.setup();
    render(<Harness initialDraft={{ kind: 'photo', selectedId: 'dubai' }} />);
    expect(screen.getByRole('radio', { name: 'Дубай' })).toBeChecked();
    fireEvent.error(screen.getByRole('img', { name: /Дубай/ }));
    expect(screen.getByText('Иллюстрация недоступна')).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Дубай' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });
});
