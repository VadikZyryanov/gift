import { expect, test } from '@playwright/test';
import { completeGameTasks, solvePouch } from './helpers';

const audioFixture = 'http://127.0.0.1:4174/gift/e2e/fixtures/letter.html';

test('keeps text readable after a failed audio request and retries by a new gesture', async ({ page }) => {
  let failAudio = true;
  let requests = 0;
  await page.route('**/voice-tone.wav', route => {
    requests++;
    return failAudio ? route.abort() : route.continue();
  });
  await page.goto(audioFixture);
  const voice = page.locator('audio');
  expect(await voice.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  expect(requests).toBe(0);
  await page.getByRole('button', { name: 'Послушать послание', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Попробовать ещё раз', exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toContainText('Текст доступен и без записи.');
  failAudio = false;
  await page.getByRole('button', { name: 'Попробовать ещё раз', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  expect(await voice.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await expect(page.getByRole('article')).toBeVisible();
  await page.reload();
  expect(await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await expect(page.getByRole('button', { name: 'Послушать послание', exact: true })).toBeVisible();
});

test('pauses the real media element on pagehide and when leaving the letter', async ({ page }) => {
  await page.goto(audioFixture);
  await page.getByRole('button', { name: 'Послушать послание', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')));
  expect(await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow')));
  await expect(page.getByRole('button', { name: 'Продолжить послание', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Продолжить послание', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  expect(await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
});

test('opens the finale by hand and restores every stable scene without secrets', async ({ page }) => {
  await page.goto('./');
  for (const pouch of ['beginning', 'journey', 'proposal'] as const) {
    await page.getByRole('button', { name: 'Сундук', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await solvePouch(page, pouch);
  }
  await solvePouch(page, 'family');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Сундук', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Самое тёплое — внутри' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Открыть письмо', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('article', { name: 'Письмо для тебя' })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
  await page.getByRole('button', { name: 'Заглянуть под второе дно', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'У этой истории есть продолжение' })).toBeVisible();
  await page.getByRole('button', { name: 'Перечитать письмо', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Письмо для тебя' })).toBeVisible();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.getByRole('button', { name: 'Сундук', exact: true }).click();
  await page.getByRole('button', { name: 'Открыть письмо', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').foundSecrets)).toEqual([]);
});

test('keeps the letter and ending reachable with reduced motion, large text and missing art', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*chest-open*.webp', route => route.abort());
  await page.route('**/*envelope*.webp', route => route.abort());
  await page.goto('./');
  await completeGameTasks(page, ['family', 'journey', 'beginning', 'proposal']);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.getByRole('button', { name: 'Сундук', exact: true }).click();
  await page.getByRole('button', { name: 'Открыть письмо', exact: true }).click();
  const dialog = page.getByRole('dialog');
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.getByRole('article').locator('p').last().scrollIntoViewIfNeeded();
  await expect(page.getByRole('article').locator('p').last()).toBeVisible();
  await page.getByRole('button', { name: 'Заглянуть под второе дно', exact: true }).click();
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
  await expect(page.getByText('Ключи: 4 из 4', { exact: true })).toBeVisible();
});
