import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gameContent } from '../game/content';
import { GameProvider, useGame } from '../game/GameProvider';
import { createInitialProgress } from '../game/progress';
import type { QuizDraft } from '../game/types';
import { QuizTask } from './QuizTask';

function QuizHarness({ initialDraft }: { initialDraft?: QuizDraft }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <QuizTask task={gameContent.beginning.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

function PersistentQuizHarness() {
  const { progress, send } = useGame();
  const draft = progress.drafts.beginning;
  return progress.completedPouches.includes('beginning') ? <p>Ключ найден</p> : <QuizTask
    task={gameContent.beginning.task}
    draft={draft?.kind === 'quiz' ? draft : undefined}
    onDraftChange={next => send({ type: 'save-draft', pouchId: 'beginning', draft: next })}
    onSolved={() => send({ type: 'complete-pouch', pouchId: 'beginning' })}
  />;
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

describe('QuizTask', () => {
  it('retries gently and awards a key only after all four memories in the agreed order', async () => {
    const user = userEvent.setup();
    render(<QuizHarness />);
    expect(screen.getByText('Воспоминание 1 из 4')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'В кафе' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.beginning.task.questions[0].hint);
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'На пляже' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.beginning.task.questions[0].successMessage);
    expect(screen.getByRole('radio', { name: 'На пляже' })).toBeDisabled();
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 2 из 4')).toBeVisible();
    expect(screen.getByText('В какой день я впервые подарил тебе цветы?')).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: '28 марта 2024' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 3 из 4')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: '16 февраля 2025' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 4 из 4')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'Bounty' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.beginning.task.questions[3].hint);
    await user.click(screen.getByRole('radio', { name: 'KitKat' }));
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('restores a selected answer on the second question without submitting it', () => {
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'first-flowers', selectedId: 'march-28', confirmed: false }} />);
    expect(screen.getByText('Воспоминание 2 из 4')).toBeVisible();
    expect(screen.getByRole('radio', { name: '28 марта 2024' })).toBeChecked();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'Дальше' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeEnabled();
  });

  it('restores confirmed feedback and advances once without carrying the old selection or hint', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'first-flowers', selectedId: 'march-28', confirmed: true }} />);
    expect(screen.getByText('Воспоминание 2 из 4')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.beginning.task.questions[1].successMessage);
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.dblClick(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 3 из 4')).toBeVisible();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled();
  });

  it('allows retry after a failed final reward save instead of restoring a dead end', async () => {
    const user = userEvent.setup();
    localStorage.setItem('gift:progress:v1', JSON.stringify({
      ...createInitialProgress(gameContent.revision),
      drafts: { beginning: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: false } },
    }));
    const setItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (value.includes('"completedPouches":["beginning"]')) throw new DOMException('Full', 'QuotaExceededError');
      setItem.call(this, key, value);
    });
    const first = render(<GameProvider><PersistentQuizHarness /></GameProvider>);
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
    first.unmount();
    vi.restoreAllMocks();
    render(<GameProvider><PersistentQuizHarness /></GameProvider>);
    expect(screen.getByRole('radio', { name: 'KitKat' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('can finish an already saved confirmed final answer without a key', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: true }} />);
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });
});
