import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gameContent } from '../game/content';
import type { FamilyDraft } from '../game/types';
import { FamilyTask } from './FamilyTask';

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  });
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function Harness({ initialDraft }: { initialDraft?: FamilyDraft }) {
  const [draft, setDraft] = useState(initialDraft);
  const [solved, setSolved] = useState(false);
  return solved ? <p>Ключ найден</p> : <FamilyTask task={gameContent.pouches.family.task} draft={draft} onDraftChange={setDraft} onSolved={() => setSolved(true)} />;
}

describe('FamilyTask', () => {
  it('finds the family in any order and waits for an explicit key claim after all dates', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByText('Томас')).not.toBeInTheDocument();
    for (const [name, month, year] of [['Шелби', '10', '2025'], ['Томас', '6', '2025'], ['Святослав', '10', '2026']]) {
      await user.click(screen.getByRole('button', { name }));
      await user.selectOptions(screen.getByRole('combobox', { name: 'Месяц' }), month);
      await user.selectOptions(screen.getByRole('combobox', { name: 'Год' }), year);
      await user.click(screen.getByRole('button', { name: 'Вспомнить' }));
      expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /Продолжить поиск|К нашей семейной истории/ }));
      expect(screen.getByRole('button', { name: `${name}, дата найдена` })).toBeVisible();
    }
    expect(screen.getByRole('heading', { name: 'И дома стало больше любви' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Забрать семейный ключ' }));
    expect(screen.getByText('Ключ найден')).toBeVisible();
  });

  it('restores partial dates and keeps earlier memories after an incorrect answer', async () => {
    const user = userEvent.setup();
    render(<Harness initialDraft={{
      kind: 'family', selectedMemberId: 'shelby',
      answers: { thomas: { month: 6, year: 2025, confirmed: true }, shelby: { month: 9, year: 2025, confirmed: false } },
    }} />);
    await user.click(screen.getByRole('button', { name: 'Томас, дата найдена' }));
    await user.click(screen.getByRole('button', { name: 'Продолжить поиск' }));
    await user.click(screen.getByRole('button', { name: 'Шелби' }));
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toHaveValue('9');
    expect(screen.getByRole('combobox', { name: 'Год' })).toHaveValue('2025');
    await user.click(screen.getByRole('button', { name: 'Вспомнить' }));
    expect(screen.getByText(/Он уже был частью твоей жизни/)).toBeVisible();
    expect(screen.queryByText('Ключ найден')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Месяц' }), '10');
    await user.click(screen.getByRole('button', { name: 'Вспомнить' }));
    await user.click(screen.getByRole('button', { name: 'Продолжить поиск' }));
    expect(screen.getByRole('button', { name: 'Томас, дата найдена' })).toBeVisible();
    expect(screen.getByText('Нашли 2 из 3')).toBeVisible();
  });

  it('keeps named choices and the date question available when the room image fails', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    fireEvent.error(screen.getByRole('img', { name: /Наша комната/ }));
    expect(screen.getByText('Картинка отдыхает, а наша история всё равно здесь.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Томас' })).toHaveTextContent('Томас');
    await user.click(screen.getByRole('button', { name: 'Святослав' }));
    expect(screen.getByText('Когда родился наш Святослав?')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toBeEnabled();
  });
});
