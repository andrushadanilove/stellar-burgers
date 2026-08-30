import { expect, test } from '@playwright/test';
import path from 'path';

const apiHar = path.join(__dirname, 'hars', 'mock-api.har');
const bunId = 'mock-bun';
const mainId = 'mock-main';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(apiHar, {
      url: '**/api/**',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText('Тестовая булка')).toBeVisible();
  });

  test('добавляет булку и начинку из списка в конструктор', async ({
    page
  }) => {
    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(constructor.getByText('Тестовая булка (низ)')).toBeVisible();
    await expect(constructor.getByText('Тестовая начинка')).toBeVisible();
  });

  test('открывает модальное окно с данными выбранного ингредиента и закрывает по крестику', async ({
    page
  }) => {
    await page.getByTestId(`ingredient-link-${mainId}`).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/ingredients/${mainId}$`));
    await expect(modal.getByText('Тестовая начинка')).toBeVisible();
    await expect(modal.getByText('250', { exact: true })).toBeVisible();
    await expect(modal.getByText('20', { exact: true })).toBeVisible();
    await expect(modal.getByText('10', { exact: true })).toBeVisible();
    await expect(modal.getByText('5', { exact: true })).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.getByTestId(`ingredient-link-${bunId}`).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR(apiHar, {
      url: '**/api/**',
      notFound: 'abort'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        domain: '127.0.0.1',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('/');
    await expect(page.getByText('Тестовый пользователь')).toBeVisible();
  });

  test('оформляет заказ, показывает номер и очищает конструктор', async ({
    page
  }) => {
    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Тестовая начинка')).toBeVisible();

    await constructor.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('424242')).toBeVisible();

    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Тестовая начинка')).toHaveCount(0);

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
