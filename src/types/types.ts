export type Nullable<T> = T | null;
export type PromoCode = { promoCodeName: string; promoCodeDiscount: number };
export type ViewType = 'cards' | 'list';

// handler types
// one param
export type ClickAndTouchDivHandler = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
) => void;
export type ClickAndTouchButtonHandler = (
  event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
) => void;
export type ClickAndTouchSpanHandler = (
  event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>
) => void;
export type ClickAndTouchParagraphHandler = (
  event: React.MouseEvent<HTMLParagraphElement> | React.TouchEvent<HTMLParagraphElement>
) => void;
export type ChangeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type FocusInputHandler = (event: React.FocusEvent<HTMLInputElement>) => void;
export type FormHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type FormHandlerBoolean = (event: React.FormEvent<HTMLFormElement>) => boolean;

// two params
export type ClickAndTouchDivHandlerParametric<T> = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  secondParam: T
) => void;
export type ClickAndTouchButtonHandlerParametric<T> = (
  event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
  secondParam: T
) => void;
export type ClickAndTouchSpanHandlerParametric<T> = (
  event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>,
  secondParam: T
) => void;
export type ClickAndTouchParagraphHandlerParametric<T> = (
  event: React.MouseEvent<HTMLParagraphElement> | React.TouchEvent<HTMLParagraphElement>,
  secondParam: T
) => void;
export type ChangeInputHandlerParametric<T> = (
  event: React.ChangeEvent<HTMLInputElement>,
  secondParam: T
) => void;
export type FocusInputHandlerParametric<T> = (
  event: React.FocusEvent<HTMLInputElement>,
  secondParam: T
) => void;
export type FormHandlerParametric<T> = (
  event: React.FormEvent<HTMLFormElement>,
  secondParam: T
) => void;

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
