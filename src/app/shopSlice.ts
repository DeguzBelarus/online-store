import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { RootState } from './store';

import { ProductData } from '../types/types';

export interface ShopState {
  cart: Array<ProductData>;
  filteredProducts: Array<ProductData>;
  currentProduct: ProductData | null;
  categoryFilter: string | null;
  brandFilter: string | null;
  inStockFilter: boolean;
  minPriceFilter: number | null;
  maxPriceFilter: number | null;
  productNameFilter: string | null;
  sortByName: 'ascending' | 'descending' | null;
  sortByPrice: 'ascending' | 'descending' | null;
  viewType: 'cards' | 'list';
}

const initialState: ShopState = {
  cart: [],
  filteredProducts: [],
  currentProduct: null,
  categoryFilter: null,
  brandFilter: null,
  inStockFilter: false,
  minPriceFilter: null,
  maxPriceFilter: null,
  productNameFilter: null,
  sortByName: null,
  sortByPrice: null,
  viewType: 'cards',
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCategoryFilter(state: WritableDraft<ShopState>, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.categoryFilter = action.payload;
      } else {
        state.categoryFilter = initialState.categoryFilter;
      }
    },
    setBrandFilter(state: WritableDraft<ShopState>, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.brandFilter = action.payload;
      } else {
        state.brandFilter = initialState.brandFilter;
      }
    },
    setCurrentProduct(state: WritableDraft<ShopState>, action: PayloadAction<ProductData | null>) {
      if (action.payload) {
        state.currentProduct = action.payload;
      } else {
        state.currentProduct = initialState.currentProduct;
      }
    },
    setInStockFilter(state: WritableDraft<ShopState>, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.inStockFilter = action.payload;
      } else {
        state.inStockFilter = initialState.inStockFilter;
      }
    },
    setMinPriceFilter(state: WritableDraft<ShopState>, action: PayloadAction<number | null>) {
      if (action.payload) {
        state.minPriceFilter = action.payload;
      } else {
        state.minPriceFilter = initialState.minPriceFilter;
      }
    },
    setMaxPriceFilter(state: WritableDraft<ShopState>, action: PayloadAction<number | null>) {
      if (action.payload) {
        state.maxPriceFilter = action.payload;
      } else {
        state.maxPriceFilter = initialState.maxPriceFilter;
      }
    },
    setProductNameFilter(state: WritableDraft<ShopState>, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.productNameFilter = action.payload;
      } else {
        state.productNameFilter = initialState.productNameFilter;
      }
    },
    setCart(state: WritableDraft<ShopState>, action: PayloadAction<Array<ProductData>>) {
      if (action.payload) {
        state.cart = action.payload;
      } else {
        state.cart = initialState.cart;
      }
    },
    setFilteredProducts(
      state: WritableDraft<ShopState>,
      action: PayloadAction<Array<ProductData>>
    ) {
      if (action.payload) {
        state.filteredProducts = action.payload;
      } else {
        state.filteredProducts = initialState.filteredProducts;
      }
    },
    setSortByName(
      state: WritableDraft<ShopState>,
      action: PayloadAction<'ascending' | 'descending' | null>
    ) {
      if (action.payload) {
        state.sortByName = action.payload;
      } else {
        state.sortByName = initialState.sortByName;
      }
    },
    setSortByPrice(
      state: WritableDraft<ShopState>,
      action: PayloadAction<'ascending' | 'descending' | null>
    ) {
      if (action.payload) {
        state.sortByPrice = action.payload;
      } else {
        state.sortByPrice = initialState.sortByPrice;
      }
    },
    setViewType(state: WritableDraft<ShopState>, action: PayloadAction<'cards' | 'list'>) {
      if (action.payload) {
        state.viewType = action.payload;
      } else {
        state.viewType = initialState.viewType;
      }
    },
  },
});

export const {
  setBrandFilter,
  setCategoryFilter,
  setCurrentProduct,
  setInStockFilter,
  setMaxPriceFilter,
  setMinPriceFilter,
  setProductNameFilter,
  setCart,
  setFilteredProducts,
  setSortByName,
  setSortByPrice,
  setViewType,
} = shopSlice.actions;

export const getCart = (state: RootState) => state.shop.cart;
export const getFilteredProducts = (state: RootState) => state.shop.filteredProducts;
export const getCategoryFilter = (state: RootState) => state.shop.categoryFilter;
export const getBrandFilter = (state: RootState) => state.shop.brandFilter;
export const getCurrentProduct = (state: RootState) => state.shop.currentProduct;
export const getInStockFilter = (state: RootState) => state.shop.inStockFilter;
export const getMinPriceFilter = (state: RootState) => state.shop.minPriceFilter;
export const getMaxPriceFilter = (state: RootState) => state.shop.maxPriceFilter;
export const getProductNameFilter = (state: RootState) => state.shop.productNameFilter;
export const getSortByName = (state: RootState) => state.shop.sortByName;
export const getSortByPrice = (state: RootState) => state.shop.sortByPrice;
export const getViewType = (state: RootState) => state.shop.viewType;

export default shopSlice.reducer;
