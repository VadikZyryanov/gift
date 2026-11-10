import { expect, type Page } from '@playwright/test';
import type { PouchId } from '../src/game/types';

const pouchNames = { beginning: 'Начало', journey: 'Далеко от дома', proposal: 'Один вопрос', family: 'Самое дорогое' } as const;

export async function solvePouch(page: Page, pouchId: PouchId): Promise<void> {
  await page.getByRole('button', { name: pouchNames[pouchId], exact: true }).click();
  switch (pouchId) {
    case 'beginning':
      for (const answer of ['На пляже', '28 марта 2024', '16 февраля 2025', 'KitKat']) {
        await page.getByRole('radio', { name: answer, exact: true }).check();
        await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
        if (answer !== 'KitKat') await page.getByRole('button', { name: 'Дальше', exact: true }).click();
      }
      break;
    case 'journey':
      await page.getByRole('radio', { name: 'Дубай', exact: true }).check();
      await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
      break;
    case 'proposal':
      for (const word of ['С', 'тобой', 'навсегда']) await page.getByRole('button', { name: `Добавить слово «${word}»`, exact: true }).click();
      await page.getByRole('button', { name: 'Проверить фразу', exact: true }).click();
      break;
    case 'family':
      await page.getByRole('button', { name: 'Сердечко на пелёнке', exact: true }).click();
      break;
  }
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
}

export async function completeGameTasks(page: Page, order: readonly PouchId[]): Promise<void> {
  for (const pouchId of order) await solvePouch(page, pouchId);
  await expect(page.getByText('Ключи: 4 из 4', { exact: true })).toBeVisible();
}
