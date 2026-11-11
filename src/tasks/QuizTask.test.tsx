import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
  return solved ? <p>Ключ найден</p> : <QuizTask task={gameContent.pouches.beginning.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

function PersistentQuizHarness() {
  const { progress, send } = useGame();
  const draft = progress.drafts.beginning;
  return progress.completedPouches.includes('beginning') ? <p>Ключ найден</p> : <QuizTask
    task={gameContent.pouches.beginning.task}
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
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.pouches.beginning.task.questions[0].hint);
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'На пляже' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.pouches.beginning.task.questions[0].successMessage);
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
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
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.pouches.beginning.task.questions[3].hint);
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

  it.each([
    ['first-meeting', 'beach', 'Настя на том самом пляже'],
    ['first-flowers', 'march-28', 'Букет, который я подарил тебе впервые'],
    ['first-date', 'february-16', 'Кафе нашего первого свидания'],
  ])('reveals the %s photo between the reply and Next only after checking the right answer', async (questionId, selectedId, alt) => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId, selectedId, confirmed: false }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    const photo = screen.getByRole('img', { name: alt });
    const reply = screen.getByRole('status');
    const next = screen.getByRole('button', { name: 'Дальше' });
    expect(reply.compareDocumentPosition(photo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(photo.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
  });

  it('does not reveal a photo for a wrong answer and keeps retry available', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'first-meeting', selectedId: 'cafe', confirmed: false }} />);
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
    expect(screen.getByRole('status')).toHaveTextContent('Подсказка');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'На пляже' })).toBeEnabled();
  });

  it('restores the confirmed bouquet and still advances if the photograph fails', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'first-flowers', selectedId: 'march-28', confirmed: true }} />);
    fireEvent.error(screen.getByRole('img', { name: 'Букет, который я подарил тебе впервые' }));
    expect(screen.getByRole('img', { name: 'Букет, который я подарил тебе впервые' })).toHaveTextContent('Иллюстрация недоступна');
    await user.click(screen.getByRole('button', { name: 'Дальше' }));
    expect(screen.getByText('Воспоминание 3 из 4')).toBeVisible();
    expect(screen.getByRole('radio', { name: '16 февраля 2025' })).toBeEnabled();
  });

  it('restores confirmed feedback and advances once without carrying the old selection or hint', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initialDraft={{ kind: 'quiz', questionId: 'first-flowers', selectedId: 'march-28', confirmed: true }} />);
    expect(screen.getByText('Воспоминание 2 из 4')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(gameContent.pouches.beginning.task.questions[1].successMessage);
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
