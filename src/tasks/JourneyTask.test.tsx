import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { gameContent } from '../game/content';
import { GameProvider, useGame } from '../game/GameProvider';
import type { QuizDraft } from '../game/types';
import { QuizTask } from './QuizTask';

function Harness({ initialDraft }: { initialDraft?: QuizDraft }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <QuizTask task={gameContent.pouches.journey.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

function PersistentHarness() {
  const { progress, send } = useGame();
  const draft = progress.drafts.journey;
  return progress.completedPouches.includes('journey') ? <p>Ключ найден</p> : <QuizTask
    task={gameContent.pouches.journey.task}
    draft={draft?.kind === 'quiz' ? draft : undefined}
    onDraftChange={next => send({ type: 'save-draft', pouchId: 'journey', draft: next })}
    onSolved={() => send({ type: 'complete-pouch', pouchId: 'journey' })}
  />;
}

beforeEach(() => localStorage.clear());

describe('Journey photo questions', () => {
  it('shows every supplied photo with four fixed options and awards the key after eight correct answers', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const answers = ['Турция', 'Дубай', 'Турция', 'Россия', 'Турция', 'Египет', 'Дубай', 'Россия'];
    for (const [index, answer] of answers.entries()) {
      expect(screen.getByText(`Воспоминание ${index + 1} из 8`)).toBeVisible();
      expect(screen.getByRole('img', { name: `Наше путешествие — фотография ${index + 1}` })).toBeVisible();
      expect(screen.getAllByRole('radio').map(input => input.closest('label')?.textContent?.replace('♡', '')))
        .toEqual(['Турция', 'Дубай', 'Египет', 'Россия']);
      expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled();
      await user.click(screen.getByRole('radio', { name: answer }));
      await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
      if (index < answers.length - 1) {
        expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Дальше' }));
      }
    }
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('keeps the same photo and allows another attempt after a wrong country', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('radio', { name: 'Египет' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent('попробуй ещё раз');
    expect(screen.getByRole('img', { name: 'Наше путешествие — фотография 1' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Дальше' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Турция' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('button', { name: 'Дальше' })).toBeVisible();
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
  });

  it('restores selected and confirmed travel answers without awarding an early key', async () => {
    const user = userEvent.setup();
    let view = render(<GameProvider><PersistentHarness /></GameProvider>);
    await user.click(screen.getByRole('radio', { name: 'Турция' }));
    view.unmount();
    view = render(<GameProvider><PersistentHarness /></GameProvider>);
    expect(screen.getByRole('radio', { name: 'Турция' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    view.unmount();
    render(<GameProvider><PersistentHarness /></GameProvider>);
    expect(screen.getByRole('button', { name: 'Дальше' })).toBeVisible();
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 2 из 8')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Наше путешествие — фотография 2' })).toBeVisible();
  });

  it('keeps the answer controls usable if the last photo cannot load', async () => {
    const user = userEvent.setup();
    render(<Harness initialDraft={{ kind: 'quiz', questionId: 'journey-08', selectedId: 'russia', confirmed: false }} />);
    fireEvent.error(screen.getByRole('img', { name: 'Наше путешествие — фотография 8' }));
    expect(screen.getByText('Иллюстрация недоступна')).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Россия' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });
});
