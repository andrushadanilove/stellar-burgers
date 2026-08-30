import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 250,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  }
];

describe('ingredientsReducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = {
      ingredients: mockIngredients,
      isLoading: false,
      error: 'Предыдущая ошибка'
    };

    const result = ingredientsReducer(
      state,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const result = ingredientsReducer(
      state,
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const result = ingredientsReducer(
      state,
      fetchIngredients.rejected(
        new Error('Ошибка загрузки'),
        'request-id',
        undefined,
        'Ошибка загрузки'
      )
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
