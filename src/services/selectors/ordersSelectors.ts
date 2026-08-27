import { RootState } from '../store';

export const selectFeed = (state: RootState) => state.orders.feed;
export const selectFeedOrders = (state: RootState) => state.orders.feed.orders;
export const selectFeedLoading = (state: RootState) =>
  state.orders.isFeedLoading;
export const selectProfileOrders = (state: RootState) =>
  state.orders.profileOrders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.orders.isProfileOrdersLoading;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectCurrentOrderLoading = (state: RootState) =>
  state.orders.isCurrentOrderLoading;
export const selectFeedError = (state: RootState) => state.orders.feedError;
export const selectProfileOrdersError = (state: RootState) =>
  state.orders.profileOrdersError;
export const selectCurrentOrderError = (state: RootState) =>
  state.orders.currentOrderError;
