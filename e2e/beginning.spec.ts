import { expect, test, type Page } from '@playwright/test';

async function openLastQuestion(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('gift:progress:v1', JSON.stringify({
    schemaVersion: 1, contentRevision: 2, completedPouches: [], foundSecrets: [],
    drafts: { beginning: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: false } },
    chestOpened: false, letterOpened: false, secondBottomOpened: false,
    scene: { kind: 'pouch', pouchId: 'beginning' },
  })));
  await page.reload();
  await expect(page.getByRole('radio', { name: 'KitKat', exact: true })).toBeChecked();
}

test('reveals the supplied photos in order with the reply above and Next below', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  for (const [index, name] of ['В кафе', 'На пляже', 'В зале'].entries()) {
    await expect(page.getByRole('radio').nth(index)).toHaveAccessibleName(name);
  }
  const memories = [
    ['На пляже', 'Настя на том самом пляже'],
    ['28 марта 2024', 'Букет, который я подарил тебе впервые'],
    ['16 февраля 2025', 'Кафе нашего первого свидания'],
  ];
  for (const [index, [answer, alt]] of memories.entries()) {
    if (index === 2) await expect(page.getByRole('radio').first()).toHaveAccessibleName('16 февраля 2025');
    await expect(page.getByRole('img', { name: alt })).toHaveCount(0);
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
    const photo = page.getByRole('img', { name: alt });
    await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const source = await photo.getAttribute('src');
    expect(source).toMatch(/^\/gift\/assets\/beginning-.*\.webp$/);
    const reply = await page.getByRole('dialog').getByRole('status').boundingBox();
    const image = await photo.boundingBox();
    const next = await page.getByRole('button', { name: 'Дальше', exact: true }).boundingBox();
    expect(reply!.y + reply!.height).toBeLessThanOrEqual(image!.y);
    expect(image!.y + image!.height).toBeLessThanOrEqual(next!.y);
    if (index === 1) {
      await page.reload();
      await expect(photo).toBeVisible();
      await expect(page.getByRole('radio')).toHaveCount(0);
    }
    await page.getByRole('button', { name: 'Дальше', exact: true }).click();
  }
  await expect(page.getByText('Воспоминание 4 из 4', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('keeps all personal memories and Next reachable with 200% text at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  for (const answer of ['На пляже', '28 марта 2024', '16 февраля 2025']) {
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
    const photo = page.getByRole('dialog').getByRole('img');
    await expect(photo).toHaveCSS('object-fit', 'contain');
    const next = page.getByRole('button', { name: 'Дальше', exact: true });
    await next.scrollIntoViewIfNeeded();
    await expect(next).toBeInViewport();
    expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await next.click();
  }
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Начало', exact: true })).toBeFocused();
});

test('reserves the portrait photo height while it loads so Next does not jump', async ({ page }) => {
  let release: () => void = () => {};
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*beginning-beach*.webp', async route => { await waiting; await route.continue(); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await page.getByRole('radio', { name: 'На пляже', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  const photo = page.getByRole('img', { name: 'Настя на том самом пляже' });
  const heightBefore = await photo.evaluate(image => image.getBoundingClientRect().height);
  release();
  await photo.evaluate((image: HTMLImageElement) => image.decode());
  expect(await photo.evaluate(image => image.getBoundingClientRect().height)).toBeCloseTo(heightBefore, 0);
});

test('continues through failed photographs and chocolate art without losing the key', async ({ page }) => {
  await page.route('**/*beginning-*.webp', route => route.abort());
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  for (const answer of ['На пляже', '28 марта 2024', '16 февраля 2025']) {
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
    await expect(page.getByText('Иллюстрация недоступна', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Дальше', exact: true }).click();
  }
  await page.getByRole('radio', { name: 'KitKat', exact: true }).check();
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
});

test('flies KitKat to the right before showing the already saved single key', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openLastQuestion(page);
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Сладкая находка' })).toBeVisible();
  await expect(page.getByText('Ключ найден', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').completedPouches)).toEqual(['beginning']);
  const flight = page.locator('.kitkat-flight__bar');
  await expect.poll(() => flight.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const positions = await flight.evaluate(image => {
    const animation = image.getAnimations()[0];
    animation.pause();
    animation.currentTime = 900;
    const start = image.getBoundingClientRect().left;
    animation.currentTime = 2100;
    return { start, end: image.getBoundingClientRect().left };
  });
  expect(positions.end).toBeGreaterThan(positions.start + 50);
  await page.clock.fastForward(2999);
  await expect(page.getByText('Ключ найден', { exact: true })).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Сладкая находка' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
  await expect(page.getByText('Ключи: 1 из 4', { exact: true })).toBeVisible();
});

test('reload during the flight restores the key without replaying the celebration', async ({ page }) => {
  await openLastQuestion(page);
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Сладкая находка' })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Сладкая находка' })).toHaveCount(0);
});

test('skips the long flight and heart reveal when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openLastQuestion(page);
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
  await expect(page.getByText('Ключ найден', { exact: true })).toBeVisible({ timeout: 1500 });
  await expect(page.getByRole('status', { name: 'Сладкая находка' })).toHaveCount(0);
});

test('opens from a heart and plays an opening sound only with effects enabled by a gesture', async ({ page }) => {
  await page.addInitScript(() => {
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof start>) {
      document.documentElement.dataset.audioStarts = String(Number(document.documentElement.dataset.audioStarts ?? 0) + 1);
      return start.apply(this, args);
    };
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'panel-heart-arrive');
  expect(await page.evaluate(() => Number(document.documentElement.dataset.audioStarts ?? 0))).toBe(0);
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.getByRole('button', { name: 'Включить звуки', exact: true }).click();
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect.poll(() => page.evaluate(() => Number(document.documentElement.dataset.audioStarts ?? 0))).toBe(1);
  await page.reload();
  expect(await page.evaluate(() => Number(document.documentElement.dataset.audioStarts ?? 0))).toBe(0);
});
