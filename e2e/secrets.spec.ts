import { expect, test, type Page } from '@playwright/test';
import { completeGameTasks } from './helpers';

async function turnChest(page: Page) {
  const chest = page.getByRole('group', { name: 'Сундук на столе', exact: true });
  await chest.scrollIntoViewIfNeeded();
  const box = await chest.boundingBox();
  if (!box) throw new Error('Chest has no bounding box');
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .2, box.y + box.height * .5, { steps: 12 });
  await page.mouse.up();
}

async function findPouchSecret(page: Page, pouch: string, spot: string, title: string) {
  await page.getByRole('button', { name: pouch, exact: true }).click();
  await page.getByRole('button', { name: spot, exact: true }).click();
  await expect(page.getByRole('dialog', { name: title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'К предмету', exact: true }).click();
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
}

async function findAll(page: Page) {
  await page.getByRole('button', { name: 'Белая обёртка', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Белый Bueno', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'К предмету', exact: true }).click();
  await findPouchSecret(page, 'Один вопрос', 'Край открытки', 'То самое зелёное платье');
  await turnChest(page);
  await page.getByRole('button', { name: 'Наклейка с чёрной машиной', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Одна мечта на будущее', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'К предмету', exact: true }).click();
}

async function openFinale(page: Page) {
  await page.getByRole('button', { name: 'Сундук', exact: true }).click();
  await page.getByRole('button', { name: 'Открыть письмо', exact: true }).click();
  await page.getByRole('button', { name: 'Заглянуть под второе дно', exact: true }).click();
}

test('discovers and rereads a keepsake without revealing totals or losing a quiz draft', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await page.getByRole('radio', { name: 'В кафе', exact: true }).check();
  await expect(page.getByRole('dialog', { name: 'Начало', exact: true }).getByRole('button', { name: 'Белая обёртка', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'На стол', exact: true }).click();
  await page.getByRole('button', { name: 'Белая обёртка', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Белый Bueno', exact: true })).toBeVisible();
  await expect(page.getByText(/\d из 3/)).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').foundSecrets)).toEqual(['white-bueno']);
  await page.getByRole('button', { name: 'К предмету', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Белая обёртка', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Белая обёртка', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Начало', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'В кафе', exact: true })).toBeChecked();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').foundSecrets)).toEqual(['white-bueno']);
});

for (const [pouch, spot, title] of [
  [null, 'Белая обёртка', 'Белый Bueno'],
  ['Один вопрос', 'Край открытки', 'То самое зелёное платье'],
] as const) {
  test(`Escape closes only the secret note on ${pouch ?? 'the table'} and restores scrolling afterwards`, async ({ page }) => {
    await page.goto('./');
    if (pouch) await page.getByRole('button', { name: pouch, exact: true }).click();
    await page.getByRole('button', { name: spot, exact: true }).click();
    await expect(page.getByRole('dialog', { name: title, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: spot, exact: true })).toBeFocused();
    if (pouch) {
      await expect(page.getByRole('dialog', { name: pouch, exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
      await page.keyboard.press('Escape');
    }
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    if (pouch) await expect(page.getByRole('button', { name: pouch, exact: true })).toBeFocused();
  });
}

for (const unlocked of [false, true]) {
  test(`does not press the ${unlocked ? 'unlocked' : 'locked'} chest after a long diagonal drag`, async ({ page }) => {
    await page.goto('./');
    if (unlocked) await completeGameTasks(page, ['family', 'journey', 'proposal', 'beginning']);
    const front = page.getByRole('button', { name: 'Сундук', exact: true });
    await front.scrollIntoViewIfNeeded();
    const box = await front.boundingBox();
    if (!box) throw new Error('Chest has no bounding box');
    const x = box.x + box.width * .4;
    const y = box.y + box.height * .4;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 60, y + 55, { steps: 6 });
    await page.mouse.up();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    if (!unlocked) await expect(page.getByText('Сундук откроется, когда найдутся все 4 ключа.', { exact: true })).toBeVisible();
    // The next deliberate press still checks the lock or opens the chest normally.
    await front.click();
    if (unlocked) await expect(page.getByRole('dialog', { name: 'Самое тёплое — внутри', exact: true })).toBeVisible();
    else await expect(page.getByText('Пока закрыто. Осталось найти ещё 4 ключа.', { exact: true })).toBeVisible();
  });
}

test('keeps secret notes and their return controls within a narrow screen with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  for (const [pouch, spot, title] of [
    [null, 'Белая обёртка', 'Белый Bueno'],
    ['Один вопрос', 'Край открытки', 'То самое зелёное платье'],
  ] as const) {
    if (pouch) await page.getByRole('button', { name: pouch, exact: true }).click();
    await page.getByRole('button', { name: spot, exact: true }).click();
    const note = page.getByRole('dialog', { name: title, exact: true });
    expect(await note.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await note.getByText('С любовью. Для тебя.', { exact: true }).scrollIntoViewIfNeeded();
    await expect(note.getByText('С любовью. Для тебя.', { exact: true })).toBeInViewport();
    await page.getByRole('button', { name: 'К предмету', exact: true }).click();
    if (pouch) await page.getByRole('button', { name: 'На стол', exact: true }).click();
  }
});

test('turns the locked chest on the table and never treats a swipe as a press', async ({ page }) => {
  await page.goto('./');
  const front = page.getByRole('button', { name: 'Сундук', exact: true });
  const image = await front.locator('img').elementHandle();
  await expect(page.getByRole('button', { name: 'Наклейка с чёрной машиной', exact: true })).toHaveCount(0);
  await turnChest(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('Ключи: 0 из 4', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Наклейка с чёрной машиной', exact: true }).click();
  await page.getByRole('button', { name: 'К предмету', exact: true }).click();
  await turnChest(page);
  await front.click();
  await expect(page.getByText('Пока закрыто. Осталось найти ещё 4 ключа.', { exact: true })).toBeVisible();
  expect(await image?.evaluate(element => element.isConnected)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gift:progress:v1') ?? '{}').foundSecrets)).toEqual(['black-g-class']);
});

test('does not paint the hidden face through either side of the chest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const chest = page.getByRole('group', { name: 'Сундук на столе', exact: true });
  await chest.scrollIntoViewIfNeeded();
  for (const hiddenFace of ['.chest-orbit__back', '.chest-orbit__front']) {
    const actual = await chest.screenshot();
    // Removing the face that is facing away must not change visible pixels.
    await page.locator(hiddenFace).evaluate((element: HTMLElement) => { element.style.visibility = 'hidden'; });
    const reference = await chest.screenshot();
    expect.soft(actual.equals(reference), `Hidden ${hiddenFace} must not paint through the visible side`).toBe(true);
    await page.locator(hiddenFace).evaluate((element: HTMLElement) => { element.style.visibility = ''; });
    await turnChest(page);
  }
});

test('does not open an unlocked chest on a swipe and supports keyboard turning', async ({ page }) => {
  await page.goto('./');
  await completeGameTasks(page, ['family', 'journey', 'proposal', 'beginning']);
  await turnChest(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const rear = page.getByRole('button', { name: 'Наклейка с чёрной машиной', exact: true });
  await rear.focus();
  await rear.press('ArrowRight');
  const front = page.getByRole('button', { name: 'Сундук', exact: true });
  await expect(front).toBeFocused();
  await front.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Самое тёплое — внутри', exact: true })).toBeVisible();
});

test('releases a cancelled vertical gesture before a later keyboard press', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('group', { name: 'Сундук на столе', exact: true }).evaluate(element => {
    const base = { bubbles: true, pointerId: 42, isPrimary: true, pointerType: 'touch', button: 0, clientX: 100, clientY: 100 };
    element.dispatchEvent(new PointerEvent('pointerdown', base));
    element.dispatchEvent(new PointerEvent('pointermove', { ...base, clientY: 140 }));
    element.dispatchEvent(new PointerEvent('pointercancel', { ...base, clientY: 140 }));
  });
  const front = page.getByRole('button', { name: 'Сундук', exact: true });
  await front.focus();
  await front.press('Enter');
  await expect(page.getByText('Пока закрыто. Осталось найти ещё 4 ключа.', { exact: true })).toBeVisible();
});

test('preserves native vertical touch scrolling and cancels a horizontal touch without pressing', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !isMobile, 'Native CDP touch input is Chromium-only; pointer behavior is also tested in WebKit.');
  await page.setViewportSize({ width: 440, height: 600 });
  await page.goto('./');
  const chest = page.getByRole('group', { name: 'Сундук на столе', exact: true });
  await chest.scrollIntoViewIfNeeded();
  const box = await chest.boundingBox();
  if (!box) throw new Error('Chest has no bounding box');
  const cdp = await page.context().newCDPSession(page);
  const before = await page.evaluate(() => scrollY);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + step * 12 }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before - 24);
  await expect(page.getByRole('button', { name: 'Сундук', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await chest.scrollIntoViewIfNeeded();
  const next = await chest.boundingBox();
  if (!next) throw new Error('Chest has no bounding box');
  const start = { x: next.x + next.width * .8, y: next.y + next.height * .5 };
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  for (let step = 1; step <= 6; step++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...start, x: start.x - next.width * .1 * step }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(page.getByRole('button', { name: 'Сундук', exact: true })).toBeVisible();
  await expect(page.getByText('Сундук откроется, когда найдутся все 4 ключа.', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('shows 0 of 3 only in the finale and unlocks the bonus after returning for all secrets', async ({ page }) => {
  await page.goto('./');
  await completeGameTasks(page, ['beginning', 'journey', 'proposal', 'family']);
  await expect(page.getByText(/\d из 3/)).toHaveCount(0);
  await openFinale(page);
  await expect(page.getByText('Маленькие тайны: 0 из 3', { exact: true })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Ещё кое-что для тебя', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Вернуться на стол', exact: true }).click();
  await findAll(page);
  await turnChest(page);
  await openFinale(page);
  await expect(page.getByText('Маленькие тайны: 3 из 3', { exact: true })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Ещё кое-что для тебя', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('article', { name: 'Ещё кое-что для тебя', exact: true })).toBeVisible();
});

test('finds all secrets before the keys and keeps every target reachable with missing art and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*secret-*.webp', route => route.abort());
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await findAll(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.reload();
  await completeGameTasks(page, ['proposal', 'family', 'beginning', 'journey']);
  await openFinale(page);
  await expect(page.getByText('Маленькие тайны: 3 из 3', { exact: true })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Ещё кое-что для тебя', exact: true })).toBeVisible();
});
