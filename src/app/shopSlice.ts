import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { RootState } from './store';

import { IProductData, PromoCode, ViewType, Nullable } from '../types/types';

export interface ShopState {
  cart: Array<IProductData>;
  filteredProducts: Array<IProductData>;
  currentProduct: Nullable<IProductData>;
  categoryFilter: Nullable<string>;
  brandFilter: Nullable<string>;
  inStockFilter: boolean;
  minPriceFilter: Nullable<number>;
  maxPriceFilter: Nullable<number>;
  productNameFilter: Nullable<string>;
  sortByName: Nullable<'ascending' | 'descending'>;
  sortByPrice: Nullable<'ascending' | 'descending'>;
  viewType: ViewType;
  currentCartPage: number;
  productsPerCartPage: number;
  activePromoCodes: Array<PromoCode>;
  isFirstLoad: boolean;
  isFiltersShown: boolean;
  isPriceRangesShown: boolean;
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
  isFirstLoad: true,
  isFiltersShown: false,
  isPriceRangesShown: false,
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCategoryFilter(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<string>>
    ) {
      state.categoryFilter = payload;
    },
    setBrandFilter(state: WritableDraft<ShopState>, { payload }: PayloadAction<Nullable<string>>) {
      state.brandFilter = payload;
    },
    setCurrentProduct(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<IProductData>>
    ) {
      state.currentProduct = payload;
    },
    setInStockFilter(state: WritableDraft<ShopState>, { payload }: PayloadAction<boolean>) {
      state.inStockFilter = payload;
    },
    setMinPriceFilter(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<number>>
    ) {
      state.minPriceFilter = payload;
    },
    setMaxPriceFilter(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<number>>
    ) {
      state.maxPriceFilter = payload;
    },
    setProductNameFilter(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<string>>
    ) {
      state.productNameFilter = payload;
    },
    setCart(state: WritableDraft<ShopState>, { payload }: PayloadAction<Array<IProductData>>) {
      state.cart = payload;
    },
    setFilteredProducts(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Array<IProductData>>
    ) {
      state.filteredProducts = payload;
    },
    setSortByName(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<'ascending' | 'descending'>>
    ) {
      state.sortByName = payload;
    },
    setSortByPrice(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Nullable<'ascending' | 'descending'>>
    ) {
      state.sortByPrice = payload;
    },
    setViewType(state: WritableDraft<ShopState>, { payload }: PayloadAction<ViewType>) {
      state.viewType = payload;
    },
    setCurrentCartPage(state: WritableDraft<ShopState>, { payload }: PayloadAction<number>) {
      state.currentCartPage = payload;
    },
    setProductsPerCartPage(state: WritableDraft<ShopState>, { payload }: PayloadAction<number>) {
      state.productsPerCartPage = payload;
    },
    setActivePromoCodes(
      state: WritableDraft<ShopState>,
      { payload }: PayloadAction<Array<PromoCode>>
    ) {
      state.activePromoCodes = payload;
    },
    setIsFirstLoad(state: WritableDraft<ShopState>, { payload }: PayloadAction<boolean>) {
      state.isFirstLoad = payload;
    },
    setIsFiltersShown(state: WritableDraft<ShopState>, { payload }: PayloadAction<boolean>) {
      state.isFiltersShown = payload;
    },
    setIsPriceRangesShown(state: WritableDraft<ShopState>, { payload }: PayloadAction<boolean>) {
      state.isPriceRangesShown = payload;
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
  setIsFirstLoad,
  setIsFiltersShown,
  setIsPriceRangesShown,
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
export const getIsFirstLoad = (state: RootState) => state.shop.isFirstLoad;
export const getIsFiltersShown = (state: RootState) => state.shop.isFiltersShown;
export const getIsPriceRangesShown = (state: RootState) => state.shop.isPriceRangesShown;

export default shopSlice.reducer;
