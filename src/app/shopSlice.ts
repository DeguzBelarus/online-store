import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { RootState } from './store';

import { IProductData, PromoCode, ViewType } from '../types/types';

export interface ShopState {
  cart: Array<IProductData>;
  filteredProducts: Array<IProductData>;
  currentProduct: IProductData | null;
  categoryFilter: string | null;
  brandFilter: string | null;
  inStockFilter: boolean;
  minPriceFilter: number | null;
  maxPriceFilter: number | null;
  productNameFilter: string | null;
  sortByName: 'ascending' | 'descending' | null;
  sortByPrice: 'ascending' | 'descending' | null;
  viewType: ViewType;
  currentCartPage: number;
  productsPerCartPage: number;
  activePromoCodes: Array<PromoCode>;
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
  currentCartPage: 1,
  productsPerCartPage: 2,
  activePromoCodes: [],
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
    setCurrentProduct(state: WritableDraft<ShopState>, action: PayloadAction<IProductData | null>) {
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
    setCart(state: WritableDraft<ShopState>, action: PayloadAction<Array<IProductData>>) {
      if (action.payload) {
        state.cart = action.payload;
      } else {
        state.cart = initialState.cart;
      }
    },
    setFilteredProducts(
      state: WritableDraft<ShopState>,
      action: PayloadAction<Array<IProductData>>
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
    setViewType(state: WritableDraft<ShopState>, action: PayloadAction<ViewType>) {
      if (action.payload) {
        state.viewType = action.payload;
      } else {
        state.viewType = initialState.viewType;
      }
    },
    setCurrentCartPage(state: WritableDraft<ShopState>, action: PayloadAction<number>) {
      if (action.payload) {
        state.currentCartPage = action.payload;
      } else {
        state.currentCartPage = initialState.currentCartPage;
      }
    },
    setProductsPerCartPage(state: WritableDraft<ShopState>, action: PayloadAction<number>) {
      if (action.payload) {
        state.productsPerCartPage = action.payload;
      } else {
        state.productsPerCartPage = initialState.productsPerCartPage;
      }
    },
    setActivePromoCodes(state: WritableDraft<ShopState>, action: PayloadAction<Array<PromoCode>>) {
      if (action.payload) {
        state.activePromoCodes = action.payload;
      } else {
        state.activePromoCodes = initialState.activePromoCodes;
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
  setCurrentCartPage,
  setActivePromoCodes,
  setProductsPerCartPage,
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
export const getCurrentCartPage = (state: RootState) => state.shop.currentCartPage;
export const getProductsPerCartPage = (state: RootState) => state.shop.productsPerCartPage;
export const getActivePromoCodes = (state: RootState) => state.shop.activePromoCodes;

export default shopSlice.reducer;
