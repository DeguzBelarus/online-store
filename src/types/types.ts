export interface IProductData {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  properties: Array<string>;
  posters: Array<string>;
  inStock: boolean;
  amount: number;
}

export interface ICartProductData extends IProductData {
  quantity: number;
  sum: number;
}

export interface ILocalStorageSaveObject {
  categoryFilter: string | null;
  brandFilter: string | null;
  inStockFilter: boolean;
  minPriceFilter: number | null;
  maxPriceFilter: number | null;
  productNameFilter: string | null;
  isPriceRangesShown: boolean;
  isFiltersShown: boolean;
  viewType: 'cards' | 'list';
  sortByName: 'ascending' | 'descending' | null;
  sortByPrice: 'ascending' | 'descending' | null;
  cart: Array<IProductData>;
  currentCartPage: number;
  productsPerCartPage: number;
}

export type PromoCode = [string, number];
