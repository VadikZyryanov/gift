import { expect, test, type Page } from '@playwright/test';

async function answerAndContinue(page: Page, answer: string) {
  await page.getByRole('radio', { name: answer, exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await page.getByRole('button', { name: 'Дальше', exact: true }).click();
}

async function solveBeginning(page: Page) {
  await answerAndContinue(page, 'На пляже');
  await answerAndContinue(page, '28 марта 2024');
  await answerAndContinue(page, '16 февраля 2025');
  await page.getByRole('radio', { name: 'KitKat', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
}

test('keeps the second question and partial answer after reload and opening a new tab', async ({ page, context }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await answerAndContinue(page, 'На пляже');
  await page.getByRole('radio', { name: '8 марта 2024', exact: true }).check();
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Воспоминание 2 из 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: '8 марта 2024', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  const url = page.url();
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(url);
  await expect(reopened.getByRole('dialog').getByRole('heading', { name: 'Начало', exact: true })).toBeVisible();
  await expect(reopened.getByText('Воспоминание 2 из 4', { exact: true })).toBeVisible();
  await expect(reopened.getByRole('radio', { name: '8 марта 2024', exact: true })).toBeChecked();
  await reopened.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(reopened.getByRole('button', { name: 'Начало', exact: true })).toBeFocused();
});

test('restores confirmed feedback before Next and keeps the key locked until the fourth answer', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await answerAndContinue(page, 'На пляже');
  await page.getByRole('radio', { name: '28 марта 2024', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Воспоминание 2 из 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('мартовский букет');
  await expect(page.getByRole('radio')).toHaveCount(0);
  await page.getByRole('button', { name: 'Дальше', exact: true }).click();
  const question = page.getByText('Когда мы впервые пошли на свидание?', { exact: true });
  await expect(question).toBeFocused();
  await page.getByRole('radio', { name: '14 февраля 2025', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('через два дня');
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect(page.getByRole('radio', { name: '14 февраля 2025', exact: true })).toBeChecked();
  await answerAndContinue(page, '16 февраля 2025');
  await expect(page.getByText('Воспоминание 4 из 4', { exact: true })).toBeVisible();
  await expect(page.getByText('Ключ найден', { exact: true })).toHaveCount(0);
});

test('retries wrong answers and preserves exactly one key through reward reload and repeated visits', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await page.getByRole('radio', { name: 'В кафе', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('Подсказка');
  await answerAndContinue(page, 'На пляже');
  await page.getByRole('radio', { name: '8 марта 2024', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('концу марта');
  await answerAndContinue(page, '28 марта 2024');
  await answerAndContinue(page, '16 февраля 2025');
  await page.getByRole('radio', { name: 'Bounty', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('подсказка');
  await page.getByRole('radio', { name: 'KitKat', exact: true }).check();
  // Reload immediately after the click, without waiting for the reward animation.
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('dialog').getByText('Ключ найден', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
  for (let visit = 0; visit < 2; visit++) {
    await page.getByRole('button', { name: 'Начало', exact: true }).click();
    await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'На стол', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Далеко от дома', exact: true }).click();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Сундук', exact: true }).click();
  await expect(page.locator('#chest-hint')).toContainText('ещё 3 ключа');
});

test('cancels restart without losing progress and confirms a saved clean start', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await solveBeginning(page);
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  const previous = await page.evaluate(() => localStorage.getItem('gift:progress:v1'));
  await page.getByRole('button', { name: 'Меню игры', exact: true }).click();
  await page.getByRole('button', { name: 'Начать заново', exact: true }).click();
  await page.getByRole('button', { name: 'Продолжить игру', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('gift:progress:v1'))).toBe(previous);
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Меню игры', exact: true }).click();
  await page.getByRole('button', { name: 'Начать заново', exact: true }).click();
  await page.getByRole('button', { name: 'Да, начать заново', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect(page.getByText('Воспоминание 1 из 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
});

test('recovers from a broken save and explains when saving is unavailable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gift:progress:v1', '{broken'));
  await page.goto('./');
  await expect(page.getByRole('note', { name: 'Сохранение игры' })).toContainText('Начнём с чистого листа');
  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Private detail', 'SecurityError'); } });
  });
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('radio', { name: 'На пляже', exact: true }).check();
  await expect(page.getByRole('dialog').getByRole('note', { name: 'Сохранение игры' })).toContainText('не сохранится');
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('note', { name: 'Сохранение игры' })).toBeVisible();
  await page.getByRole('button', { name: 'Дальше', exact: true }).click();
  await answerAndContinue(page, '28 марта 2024');
  await answerAndContinue(page, '16 февраля 2025');
  await page.getByRole('radio', { name: 'KitKat', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('note', { name: 'Сохранение игры' })).toBeVisible();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByRole('note', { name: 'Сохранение игры' })).toContainText('не сохранится');
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Меню игры', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('note', { name: 'Сохранение игры' })).toContainText('не сохранится');
  await expect(page.getByText('История сохраняется в этом браузере. Можно закрыть страницу и вернуться позже.', { exact: true })).toHaveCount(0);
});

test('keeps all four questions and reward usable with enlarged text and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await solveBeginning(page);
  const reward = page.getByText('Ключ найден', { exact: true });
  await reward.scrollIntoViewIfNeeded();
  await expect(reward).toBeInViewport();
  expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
});
