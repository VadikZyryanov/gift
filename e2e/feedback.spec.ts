import { expect, test } from '@playwright/test';

test('replays locked chest feedback without granting keys', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const chest = page.getByRole('button', { name: 'Сундук', exact: true });

  for (let attempt = 0; attempt < 2; attempt++) {
    await chest.click();
    await expect(page.getByRole('status')).toHaveText('Пока закрыто. Осталось найти ещё 4 ключа.');
    await expect.poll(() => chest.evaluate(element => (
      element.getAnimations({ subtree: true }).some(animation => animation.playState === 'running')
    ))).toBe(true);
    await chest.evaluate(element => Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished)));
  }

  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('explains a locked chest without movement when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const chest = page.getByRole('button', { name: 'Сундук', exact: true });
  await chest.click();

  await expect(page.getByRole('status')).toHaveText('Пока закрыто. Осталось найти ещё 4 ключа.');
  expect(await chest.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
});

test('does not add hover highlights or focus rings to buttons', async ({ page }) => {
  await page.goto('./');
  const pouch = page.getByRole('button', { name: 'Начало', exact: true });
  const image = pouch.locator('img');
  const initialStyle = await image.evaluate(element => ({ filter: getComputedStyle(element).filter, scale: getComputedStyle(element).scale }));
  await pouch.hover();
  await expect.poll(() => image.evaluate(element => ({
    filter: getComputedStyle(element).filter,
    scale: getComputedStyle(element).scale,
  }))).toEqual(initialStyle);
  await pouch.click();

  const back = page.getByRole('button', { name: 'На стол', exact: true });
  await expect(back).toBeFocused();
  await expect(back).toHaveCSS('outline-style', 'none');
  const background = await back.evaluate(element => getComputedStyle(element).backgroundColor);
  await back.hover();
  await expect(back).toHaveCSS('background-color', background);
  await back.click();
  await expect(pouch).toBeFocused();
  await expect(pouch).toHaveCSS('outline-style', 'none');
});

test('matches the mobile canvas fallback to the scene edges', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('./');

  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(230, 191, 215)');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(230, 191, 215)');
  await expect(page.locator('body')).toHaveCSS('background-image', /table-background/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#e6bfd7');
  for (const selector of ['.table', '.table-wrap']) {
    await expect(page.locator(selector)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator(selector)).toHaveCSS('background-image', 'none');
  }

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeInViewport();
});

test('keeps the decoded chest image stable during rapid presses', async ({ page }) => {
  await page.goto('./');
  const chest = page.getByRole('button', { name: 'Сундук', exact: true });
  const image = chest.locator('img');
  await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  const originalImage = await image.elementHandle();

  for (let attempt = 0; attempt < 3; attempt++) {
    await chest.click();
    expect(await image.evaluate((current, original) => current === original, originalImage)).toBe(true);
    await expect(image).toHaveJSProperty('complete', true);
  }

  expect(await chest.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeLessThanOrEqual(1);
  await expect(page.getByRole('status')).toHaveText('Пока закрыто. Осталось найти ещё 4 ключа.');
});
