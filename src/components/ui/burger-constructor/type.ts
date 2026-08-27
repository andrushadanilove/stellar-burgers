import { TConstructorItems, TNewOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TNewOrder | null;
  orderError: string | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
