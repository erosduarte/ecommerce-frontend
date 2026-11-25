import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: 'auth', value: 'true_secure_session', domain: 'localhost', path: '/' },
  ]);
});

test('el home carga datos desde la API de Node', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero_panel')).toHaveCount(3);
  await expect(page.locator('.colecciones_item')).toHaveCount(4);
  await expect(page.locator('.pilares_item')).toHaveCount(5);
});

test('el footer carga las columnas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer__columna')).toHaveCount(4);
});

test('la API exige la cabecera autorizado-por', async ({ request }) => {
  const sin = await request.get('http://localhost:3000/api/contenido/home');
  expect(sin.status()).toBe(403);
  const con = await request.get('http://localhost:3000/api/contenido/home', {
    headers: { 'autorizado-por': 'eros' },
  });
  expect(con.ok()).toBeTruthy();
});