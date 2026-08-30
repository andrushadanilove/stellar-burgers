import { TConstructorIngredient, TIngredient } from '@utils-types';
import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from './constructorSlice';
import { createOrder } from './orderSlice';

const bun: TIngredient = {
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
};

const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Первая начинка',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 250,
  price: 200,
  image: 'main-1.png',
  image_large: 'main-1-large.png',
  image_mobile: 'main-1-mobile.png'
};

const firstIngredient: TConstructorIngredient = {
  ...mainIngredient,
  id: 'constructor-main-1'
};

const secondIngredient: TConstructorIngredient = {
  _id: 'sauce-1',
  id: 'constructor-sauce-1',
  name: 'Второй ингредиент',
  type: 'sauce',
  proteins: 5,
  fat: 7,
  carbohydrates: 12,
  calories: 150,
  price: 80,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('constructorReducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку экшеном addIngredient', () => {
    const result = constructorReducer(undefined, addIngredient(bun));

    expect(result.bun).toEqual(expect.objectContaining(bun));
    expect(result.bun).toHaveProperty('id');
    expect(result.ingredients).toEqual([]);
  });

  test('добавляет начинку экшеном addIngredient', () => {
    const result = constructorReducer(undefined, addIngredient(mainIngredient));

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(
      expect.objectContaining(mainIngredient)
    );
    expect(result.ingredients[0].id).toEqual(expect.any(String));
  });

  test('удаляет ингредиент экшеном removeIngredient', () => {
    const state = {
      bun,
      ingredients: [firstIngredient, secondIngredient]
    };

    const result = constructorReducer(
      state,
      removeIngredient(firstIngredient.id)
    );

    expect(result.ingredients).toEqual([secondIngredient]);
  });

  test('перемещает ингредиент экшеном moveIngredient', () => {
    const state = {
      bun,
      ingredients: [firstIngredient, secondIngredient]
    };

    const result = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(result.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('очищает конструктор экшеном clearConstructor', () => {
    const state = {
      bun,
      ingredients: [firstIngredient, secondIngredient]
    };

    expect(constructorReducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('очищает конструктор после createOrder.fulfilled', () => {
    const state = {
      bun,
      ingredients: [firstIngredient, secondIngredient]
    };

    const order = {
      _id: 'order-id',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-08-29T10:00:00.000Z',
      updatedAt: '2026-08-29T10:00:00.000Z',
      number: 12345,
      price: 280
    };

    const result = constructorReducer(
      state,
      createOrder.fulfilled(order, 'request-id', [
        bun._id,
        firstIngredient._id,
        bun._id
      ])
    );

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
