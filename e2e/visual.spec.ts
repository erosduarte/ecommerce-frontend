import { expect, Page, test } from '@playwright/test';

async function listo(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map((img) =>
        img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
      )
    )
  );
  await page.evaluate(() => document.fonts.ready);
}

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: 'auth', value: 'true_secure_session', domain: 'localhost', path: '/' },
  ]);
});

test('home completo', async ({ page }) => {
  await page.goto('/');
  await listo(page);
  await expect(page).toHaveScreenshot('home.png', {
    fullPage: true,
    mask: [page.locator('.footer__extra')],
  });
});

test('header', async ({ page }) => {
  await page.goto('/');
  await listo(page);
  await expect(page.locator('app-header')).toHaveScreenshot('header.png');
});

test('footer', async ({ page }) => {
  await page.goto('/');
  await listo(page);
  await expect(page.locator('app-footer')).toHaveScreenshot('footer.png', {
    mask: [page.locator('.footer__extra')],
  });
});

test('catalogo', async ({ page }) => {
  await page.goto('/catalogo');
  await listo(page);
  await expect(page).toHaveScreenshot('catalogo.png', { fullPage: true });
}); 