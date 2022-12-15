import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

import { ProductData } from '../types/types';

export interface ShopState {
  cart: Array<ProductData>;
}

const initialState: ShopState = {
  cart: [],
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
});

export const getCart = (state: RootState) => state.shop.cart;

export default shopSlice.reducer;
