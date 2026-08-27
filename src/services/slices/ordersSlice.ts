import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { getErrorMessage } from '../error';

type TOrdersState = {
  feed: TOrdersData;
  profileOrders: TOrder[];
  currentOrder: TOrder | null;
  isFeedLoading: boolean;
  isProfileOrdersLoading: boolean;
  isCurrentOrderLoading: boolean;
  feedError: string | null;
  profileOrdersError: string | null;
  currentOrderError: string | null;
};

const initialState: TOrdersState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  profileOrders: [],
  currentOrder: null,
  isFeedLoading: false,
  isProfileOrdersLoading: false,
  isCurrentOrderLoading: false,
  feedError: null,
  profileOrdersError: null,
  currentOrderError: null
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orders/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: response.orders,
      total: response.total,
      totalToday: response.totalToday
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];
    if (!order) {
      return rejectWithValue('Заказ не найден');
    }
    return order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError =
          action.payload ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
        state.profileOrdersError = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrdersError =
          action.payload ?? 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isCurrentOrderLoading = true;
        state.currentOrder = null;
        state.currentOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isCurrentOrderLoading = false;
        state.currentOrderError =
          action.payload ?? 'Не удалось загрузить заказ';
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
