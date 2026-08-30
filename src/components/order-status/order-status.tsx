import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: Record<string, string> = {
  cancelled: 'Отменён',
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '#F2F2F3';

  if (status === 'done') {
    textStyle = '#00CCCC';
  } else if (status === 'cancelled') {
    textStyle = '#E52B1A';
  }

  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] ?? status} />
  );
};
