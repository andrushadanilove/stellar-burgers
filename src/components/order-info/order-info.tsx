import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectCurrentOrder,
  selectCurrentOrderError,
  selectCurrentOrderLoading,
  selectIngredients
} from '@selectors';
import {
  clearCurrentOrder,
  fetchOrderByNumber
} from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectCurrentOrderLoading);
  const error = useSelector(selectCurrentOrderError);
  const orderNumber = Number(number);
  const isValidOrderNumber = Number.isInteger(orderNumber) && orderNumber > 0;

  useEffect(() => {
    if (isValidOrderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, isValidOrderNumber, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count += 1;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!isValidOrderNumber) {
    return <p className='text text_type_main-medium'>Заказ не найден</p>;
  }

  if (isLoading || (!orderInfo && !error)) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <p className='text text_type_main-medium'>{error ?? 'Заказ не найден'}</p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
