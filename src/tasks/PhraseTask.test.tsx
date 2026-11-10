import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { gameContent } from '../game/content';
import type { PhraseDraft, PhraseTaskDefinition } from '../game/types';
import { PhraseTask } from './PhraseTask';

function Harness({ initialDraft, task = gameContent.pouches.proposal.task }: { initialDraft?: PhraseDraft; task?: PhraseTaskDefinition }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <PhraseTask task={task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

describe('PhraseTask', () => {
  it('restores a partial phrase, removes a word and clears all selections', async () => {
    const user = userEvent.setup();
    render(<Harness initialDraft={{ kind: 'phrase', selectedWordIds: ['with', 'you'] }} />);
    const phrase = screen.getByRole('list', { name: 'Собранная фраза' });
    expect(within(phrase).getAllByRole('listitem').map(item => item.textContent)).toEqual(['С', 'тобой']);
    await user.click(screen.getByRole('button', { name: 'Убрать слово 1: С' }));
    expect(within(phrase).getAllByRole('listitem').map(item => item.textContent)).toEqual(['тобой']);
    expect(screen.getByRole('button', { name: 'Добавить слово «С»' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Очистить фразу' }));
    expect(within(phrase).queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Проверить фразу' })).toBeDisabled();
  });

  it('checks the order, permits correction and solves without dragging', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    for (const word of ['навсегда', 'С', 'тобой']) await user.click(screen.getByRole('button', { name: `Добавить слово «${word}»` }));
    await user.click(screen.getByRole('button', { name: 'Проверить фразу' }));
    expect(screen.getByRole('status')).toHaveTextContent('порядок');
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Очистить фразу' }));
    for (const word of ['С', 'тобой', 'навсегда']) await user.click(screen.getByRole('button', { name: `Добавить слово «${word}»` }));
    await user.click(screen.getByRole('button', { name: 'Проверить фразу' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('distinguishes equally labelled word tokens by ID rather than their text', async () => {
    const user = userEvent.setup();
    const task: PhraseTaskDefinition = {
      kind: 'phrase', question: 'Два одинаковых слова', caption: 'Черновик',
      words: [{ id: 'one', label: 'Да' }, { id: 'two', label: 'Да' }],
      answerIds: ['one', 'two'], hint: 'Поменяй порядок',
    };
    render(<Harness task={task} />);
    await user.click(screen.getAllByRole('button', { name: 'Добавить слово «Да»' })[1]!);
    await user.click(screen.getAllByRole('button', { name: 'Добавить слово «Да»' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Проверить фразу' }));
    expect(screen.getByRole('status')).toHaveTextContent('Поменяй порядок');
    await user.click(screen.getByRole('button', { name: 'Очистить фразу' }));
    await user.click(screen.getAllByRole('button', { name: 'Добавить слово «Да»' })[0]!);
    await user.click(screen.getAllByRole('button', { name: 'Добавить слово «Да»' })[1]!);
    await user.click(screen.getByRole('button', { name: 'Проверить фразу' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });
});
