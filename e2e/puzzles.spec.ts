import { expect, test } from '@playwright/test';
import { completeGameTasks } from './helpers';

test('restores travel photo answers and awards one key only after all eight photographs', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Далеко от дома', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveClass(/scene-panel--heart/);
  await expect(page.getByRole('radio')).toHaveCount(4);
  const photo = page.getByRole('img', { name: 'Наше путешествие — фотография 1', exact: true });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('radio', { name: 'Египет', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('попробуй ещё раз');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Египет', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'Турция', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Дальше', exact: true })).toBeVisible();
  await expect(page.getByText('Ключ найден', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Дальше', exact: true }).click();
  await page.getByRole('radio', { name: 'Дубай', exact: true }).check();
  await page.reload();
  await expect(page.getByText('Воспоминание 2 из 8', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Дубай', exact: true })).toBeChecked();
  const remainingAnswers = ['Дубай', 'Турция', 'Россия', 'Турция', 'Египет', 'Дубай', 'Россия'];
  for (const [index, answer] of remainingAnswers.entries()) {
    await expect(page.getByRole('radio')).toHaveCount(4);
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
    if (index < remainingAnswers.length - 1) {
      await expect(page.getByText('Ключ найден', { exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Дальше', exact: true }).click();
    }
  }
  await page.reload();
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
});

test('keeps a partial phrase and inspected details across reload and reopening', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Один вопрос', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить слово «навсегда»', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить слово «С»', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('list', { name: 'Собранная фраза' }).getByRole('listitem')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Убрать слово 1: навсегда', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Добавить слово «тобой»', exact: true }).click();
  await page.getByRole('button', { name: 'Проверить фразу', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('порядок');
  await page.getByRole('button', { name: 'Очистить фразу', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить слово «С»', exact: true }).click();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.getByRole('button', { name: 'Один вопрос', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Убрать слово 1: С', exact: true })).toBeVisible();
  for (const word of ['тобой', 'навсегда']) await page.getByRole('button', { name: `Добавить слово «${word}»`, exact: true }).click();
  await page.getByRole('button', { name: 'Проверить фразу', exact: true }).click();
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
  await page.getByRole('button', { name: 'Самое дорогое', exact: true }).click();
  await page.getByRole('button', { name: 'Пионы', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('пелёнке');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Пионы', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Сердечко на пелёнке', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByText('Ключи: 2 из 4', { exact: true })).toBeVisible();
});

for (const order of [
  ['beginning', 'journey', 'proposal', 'family'],
  ['family', 'proposal', 'journey', 'beginning'],
] as const) {
  test(`collects four unique keys in order ${order.join(', ')}`, async ({ page }) => {
    await page.goto('./');
    await completeGameTasks(page, order);
    await page.reload();
    await expect(page.locator('#chest-hint')).toContainText('Все ключи нашлись');
    for (const name of ['Начало', 'Далеко от дома', 'Один вопрос', 'Самое дорогое']) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'На стол', exact: true }).click();
    }
    await expect(page.getByText('Ключи: 4 из 4', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Сундук', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Самое тёплое — внутри' })).toBeVisible();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').chestOpened)).toBe(true);
  });
}

test('keeps all tasks solvable without their illustrations', async ({ page }) => {
  await page.route('**/*journey-*.webp', route => route.abort());
  await page.route('**/*family-keepsakes*.webp', route => route.abort());
  await page.goto('./');
  await completeGameTasks(page, ['journey', 'family', 'proposal', 'beginning']);
});

test('keeps the new tasks usable at 320px with enlarged text and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  for (const name of ['Далеко от дома', 'Один вопрос', 'Самое дорогое']) {
    await page.getByRole('button', { name, exact: true }).click();
    const dialog = page.getByRole('dialog');
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    const targets = dialog.locator('.quiz-choice, .phrase-word, .detail-spot');
    expect(await targets.count()).toBeGreaterThan(0);
    expect(await targets.evaluateAll(elements => elements.every(element => {
      const rect = element.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44 && element.scrollWidth <= element.clientWidth + 1;
    }))).toBe(true);
    await page.getByRole('button', { name: 'На стол', exact: true }).click();
  }
  await completeGameTasks(page, ['proposal', 'family', 'journey', 'beginning']);
});
