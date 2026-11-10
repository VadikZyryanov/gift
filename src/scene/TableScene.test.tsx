import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TableScene } from './TableScene';

const pouches = [
  { id: 'beginning', name: 'Начало' },
  { id: 'journey', name: 'Далеко от дома' },
  { id: 'proposal', name: 'Один вопрос' },
  { id: 'family', name: 'Самое дорогое' },
] as const;

describe('TableScene', () => {
  it('offers all four pouches with accessible names', () => {
    render(<TableScene completedPouches={[]} onOpenPouch={vi.fn()} onOpenChest={vi.fn()} />);

    for (const pouch of pouches) {
      expect(screen.getByRole('button', { name: pouch.name })).toBeEnabled();
    }
  });

  it.each(pouches)('opens $id when its pouch is selected', async ({ id, name }) => {
    const user = userEvent.setup();
    const onOpenPouch = vi.fn();
    render(<TableScene completedPouches={[]} onOpenPouch={onOpenPouch} onOpenChest={vi.fn()} />);

    await user.click(screen.getByRole('button', { name }));

    expect(onOpenPouch).toHaveBeenCalledExactlyOnceWith(id);
  });

  it('shows the initial key count without revealing the secret count', () => {
    render(<TableScene completedPouches={[]} onOpenPouch={vi.fn()} onOpenChest={vi.fn()} />);

    expect(screen.getByText(/Ключи:\s*0\s*из\s*4/i)).toBeVisible();
    expect(screen.queryByText(/\d+\s*из\s*3/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/секрет[а-я]*\s*:/i)).not.toBeInTheDocument();
  });

  it('responds to a locked chest press without opening it', async () => {
    const user = userEvent.setup();
    const onOpenChest = vi.fn();
    render(<TableScene completedPouches={[]} onOpenPouch={vi.fn()} onOpenChest={onOpenChest} />);
    const chest = screen.getByRole('button', { name: /Сундук/i });

    expect(chest).toBeEnabled();
    expect(chest).toHaveAccessibleDescription(/(?:четыр|4).*ключ|ключ.*(?:четыр|4)/i);
    await user.click(chest);

    expect(screen.getByRole('status')).toHaveTextContent('Пока закрыто. Осталось найти ещё 4 ключа.');
    expect(onOpenChest).not.toHaveBeenCalled();
    await user.click(chest);
    expect(screen.getByText(/Ключи:\s*0\s*из\s*4/i)).toBeVisible();
    expect(onOpenChest).not.toHaveBeenCalled();
  });

  it('explains how many more keys are needed', async () => {
    const user = userEvent.setup();
    render(<TableScene completedPouches={['beginning', 'journey', 'proposal']} onOpenPouch={vi.fn()} onOpenChest={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Сундук' }));

    expect(screen.getByRole('status')).toHaveTextContent('Пока закрыто. Осталось найти ещё 1 ключ.');
  });

  it('keeps the chest image mounted across repeated lock checks', async () => {
    const user = userEvent.setup();
    render(<TableScene completedPouches={[]} onOpenPouch={vi.fn()} onOpenChest={vi.fn()} />);
    const chest = screen.getByRole('button', { name: 'Сундук' });
    const image = chest.querySelector('img');

    await user.click(chest);
    expect(chest.querySelector('img')).toBe(image);
    await user.click(chest);
    expect(chest.querySelector('img')).toBe(image);
    expect(image).toBeInTheDocument();
  });

  it('opens the chest when all four keys are available', async () => {
    const user = userEvent.setup();
    const onOpenChest = vi.fn();
    render(<TableScene completedPouches={['beginning', 'journey', 'proposal', 'family']} onOpenPouch={vi.fn()} onOpenChest={onOpenChest} />);

    await user.click(screen.getByRole('button', { name: 'Сундук' }));

    expect(onOpenChest).toHaveBeenCalledOnce();
    expect(screen.queryByText(/Пока закрыто/)).not.toBeInTheDocument();
  });
});
