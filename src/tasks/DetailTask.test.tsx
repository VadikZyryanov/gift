import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { gameContent } from '../game/content';
import type { DetailDraft } from '../game/types';
import { DetailTask } from './DetailTask';

function Harness({ initialDraft }: { initialDraft?: DetailDraft }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <DetailTask task={gameContent.pouches.family.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

describe('DetailTask', () => {
  it('remembers inspected details, gives a hint and solves by a named button', async () => {
    const user = userEvent.setup();
    render(<Harness initialDraft={{ kind: 'detail', inspectedIds: ['rings'] }} />);
    expect(screen.getByRole('button', { name: 'Обручальные кольца' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Пионы' }));
    expect(screen.getByRole('status')).toHaveTextContent('пелёнке');
    expect(screen.getByRole('button', { name: 'Пионы' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Сердечко на пелёнке' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('offers readable detail buttons when the family illustration fails', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    fireEvent.error(screen.getByRole('img', { name: /Пионы/ }));
    expect(screen.getByText('Иллюстрация недоступна')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Сердечко на пелёнке' })).toHaveTextContent('Сердечко на пелёнке');
    await user.click(screen.getByRole('button', { name: 'Сердечко на пелёнке' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });
});
