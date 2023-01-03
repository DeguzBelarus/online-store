export type Nullable<T> = T | null;
export type PromoCode = [string, number];
export type ViewType = 'cards' | 'list';

export type ClickAndTouchDivHandler = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
) => void;
export type ClickAndTouchButtonHandler = (
  event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
) => void;
export type ClickAndTouchSpanHandler = (
  event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>
) => void;
export type ChangeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type FocusInputHandler = (event: React.FocusEvent<HTMLInputElement>) => void;
export type FormHandler = (event: React.FormEvent<HTMLFormElement>) => void;

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
  viewType: ViewType;
  sortByName: 'ascending' | 'descending' | null;
  sortByPrice: 'ascending' | 'descending' | null;
  cart: Array<IProductData>;
  currentCartPage: number;
  productsPerCartPage: number;
  activePromoCodes: Array<PromoCode>;
}

export interface IOrderData {
  products: Array<ICartProductData>;
  codes: Array<PromoCode>;
  total: number;
  firstAndLastNames: string;
  phoneNumber: string;
  address: string;
  email: string;
}
