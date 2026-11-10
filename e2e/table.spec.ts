import { expect, test } from '@playwright/test';

const pouchNames = ['Начало', 'Далеко от дома', 'Один вопрос', 'Самое дорогое'] as const;

for (const name of pouchNames) {
  test(`opens ${name} and returns focus to the pouch`, async ({ page }) => {
    await page.goto('./');
    const pouch = page.getByRole('button', { name, exact: true });

    await pouch.click();
    const closeup = page.getByRole('dialog');
    await expect(closeup.getByRole('heading', { name, exact: true })).toBeVisible();
    await closeup.getByRole('button', { name: 'На стол', exact: true }).click();

    await expect(closeup).toHaveCount(0);
    await expect(pouch).toBeFocused();
  });
}

for (const width of [320, 440]) {
  test(`keeps the table and closeups within a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 956 });
    await page.goto('./');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    for (const name of pouchNames) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.getByRole('dialog').getByRole('heading', { name, exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: 'На стол', exact: true }).click();
    }
  });
}

test('allows navigation with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');

  for (const name of pouchNames) {
    const pouch = page.getByRole('button', { name, exact: true });
    await pouch.click();
    const closeup = page.getByRole('dialog');
    await expect(closeup.getByRole('heading', { name, exact: true })).toBeVisible();
    await closeup.getByRole('button', { name: 'На стол', exact: true }).click();
    await expect(closeup).toHaveCount(0);
    await expect(pouch).toBeFocused();
  }
});

test('supports keyboard opening and Escape with focus restoration', async ({ page }) => {
  await page.goto('./');
  const pouch = page.getByRole('button', { name: 'Начало', exact: true });
  await pouch.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'На стол', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(pouch).toBeFocused();
});

test('keeps enlarged text readable on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.evaluate(() => document.fonts.ready);

  const titles = page.locator('h1, .pouch__tag');
  await expect.poll(() => titles.evaluateAll(elements => elements.every(element => (
    element.scrollWidth <= element.clientWidth + 1
  )))).toBe(true);
  await page.getByRole('button', { name: 'Самое дорогое', exact: true }).click();
  const closeup = page.getByRole('dialog');
  await expect(closeup.getByRole('heading', { name: 'Самое дорогое', exact: true })).toBeVisible();
  await closeup.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeInViewport();
});

test('keeps closeups scrollable on a short screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Далеко от дома', exact: true }).click();
  const closeup = page.getByRole('dialog');
  await expect(closeup).toBeVisible();
  const description = closeup.locator('.pouch-preview__description');
  await description.scrollIntoViewIfNeeded();
  await expect(description).toBeInViewport();
  await closeup.getByRole('button', { name: 'На стол', exact: true }).click();
  await expect(closeup).toHaveCount(0);
});

test('loads scene assets under the Pages base path without JavaScript errors', async ({ page }) => {
  const pageErrors: string[] = [];
  const failedAssets: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && ['image', 'font'].includes(response.request().resourceType())) {
      failedAssets.push(response.url());
    }
  });
  page.on('requestfailed', (request) => {
    if (['image', 'font'].includes(request.resourceType())) {
      failedAssets.push(request.url());
    }
  });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Начало', exact: true })).toBeVisible();

  async function expectSceneImagesLoaded() {
    const sceneImages = page.locator('img');
    expect(await sceneImages.count()).toBeGreaterThan(0);
    await expect.poll(() => sceneImages.evaluateAll((images) => images.every((image) => (
      image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
    )))).toBe(true);
    const imagePaths = await sceneImages.evaluateAll((images) => images.map((image) => (
      new URL((image as HTMLImageElement).currentSrc).pathname
    )));
    expect(imagePaths.every((path) => path.startsWith('/gift/'))).toBe(true);
  }

  await expectSceneImagesLoaded();
  for (const name of pouchNames) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { name, exact: true })).toBeVisible();
    await expectSceneImagesLoaded();
    await page.getByRole('button', { name: 'На стол', exact: true }).click();
  }
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  expect(failedAssets).toEqual([]);
  expect(pageErrors).toEqual([]);
});
