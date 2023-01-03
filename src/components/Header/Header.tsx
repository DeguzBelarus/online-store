import React, { FC, useEffect, useState, useRef } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { NavigateFunction, useNavigate, useLocation } from 'react-router-dom';

import {
  getCategoryFilter,
  getBrandFilter,
  setCategoryFilter,
  setBrandFilter,
  getInStockFilter,
  setInStockFilter,
  getMinPriceFilter,
  setMinPriceFilter,
  getMaxPriceFilter,
  setMaxPriceFilter,
  getProductNameFilter,
  setProductNameFilter,
  getFilteredProducts,
  setFilteredProducts,
  getViewType,
  getSortByName,
  getSortByPrice,
  setViewType,
  setSortByName,
  setSortByPrice,
  setCurrentProduct,
  getCart,
  setCart,
  getCurrentCartPage,
  setCurrentCartPage,
  getProductsPerCartPage,
  setProductsPerCartPage,
  getActivePromoCodes,
  setActivePromoCodes,
} from 'app/shopSlice';
import {
  IProductData,
  ViewType,
  ICartProductData,
  PromoCode,
  ChangeInputHandler,
  ClickAndTouchButtonHandler,
  ClickAndTouchSpanHandler,
  ClickAndTouchDivHandler,
  Nullable,
} from '../../types/types';
import products from '../../products.json';
import { ILocalStorageSaveObject } from '../../types/types';
import cartLogo from '../../assets/img/cart-logo.svg';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import './Header.scss';

export const Header: FC = (): JSX.Element => {
  const productNameFilterInput = useRef<Nullable<HTMLInputElement>>(null);
  const minPriceRange = useRef<Nullable<HTMLInputElement>>(null);
  const maxPriceRange = useRef<Nullable<HTMLInputElement>>(null);

  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [isPriceRangesShown, setIsPriceRangesShown] = useState<boolean>(false);
  const [isFiltersShown, setIsFiltersShown] = useState<boolean>(false);
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [filteredProductsMinPrice, setFilteredProductsMinPrice] = useState<Nullable<number>>(null);
  const [filteredProductsMaxPrice, setFilteredProductsMaxPrice] = useState<Nullable<number>>(null);
  const [cartProductsModified, setCartProductsModified] = useState<Array<ICartProductData>>([]);
  const [increasableProductsInCart, setIncreasableProductsInCart] = useState<
    Array<ICartProductData>
  >([]);

  const filteredProducts: Array<IProductData> = useAppSelector(getFilteredProducts);
  const activePromoCodes: Array<PromoCode> = useAppSelector(getActivePromoCodes);
  const categoryFilter: Nullable<string> = useAppSelector(getCategoryFilter);
  const brandFilter: Nullable<string> = useAppSelector(getBrandFilter);
  const inStockFilter: boolean = useAppSelector(getInStockFilter);
  const minPriceFilter: Nullable<number> = useAppSelector(getMinPriceFilter);
  const maxPriceFilter: Nullable<number> = useAppSelector(getMaxPriceFilter);
  const productNameFilter: Nullable<string> = useAppSelector(getProductNameFilter);
  const viewType: ViewType = useAppSelector(getViewType);
  const sortByName: Nullable<'ascending' | 'descending'> = useAppSelector(getSortByName);
  const sortByPrice: Nullable<'ascending' | 'descending'> = useAppSelector(getSortByPrice);
  const cartData: Array<IProductData> = useAppSelector(getCart);
  const currentCartPage: number = useAppSelector(getCurrentCartPage);
  const productsPerCartPage: number = useAppSelector(getProductsPerCartPage);
  const search: string = useLocation().search;
  const cartPageQuery: Nullable<string> = new URLSearchParams(search).get('page');
  const productsPerPageQuery: Nullable<string> = new URLSearchParams(search).get('limit');

  function cartProductsModifiedUpdate(): void {
    setCartProductsModified(
      cartData
        .map((cartProduct: IProductData, index: number, array: Array<IProductData>) => {
          const productId: number = cartProduct.id;

          return {
            id: cartProduct.id,
            name: cartProduct.name,
            brand: cartProduct.brand,
            price: cartProduct.price,
            category: cartProduct.category,
            description: cartProduct.description,
            properties: cartProduct.properties,
            inStock: cartProduct.inStock,
            amount: cartProduct.amount,
            posters: cartProduct.posters,
            quantity: array.filter((cartProduct: IProductData) => cartProduct.id === productId)
              .length,
            sum: array.reduce((sum: number, cartProduct: IProductData) => {
              if (cartProduct.id === productId) {
                return (sum += cartProduct.price || sum);
              } else {
                return sum;
              }
            }, 0),
          };
        })
        .reduce((unique: Array<ICartProductData>, cartProduct: ICartProductData) => {
          return unique.find(
            (uniqueProduct: ICartProductData) => uniqueProduct.id === cartProduct.id
          )
            ? unique
            : [...unique, cartProduct];
        }, [])
    );
  }

  const increasableProductsInCartUpdate = (): void => {
    setIncreasableProductsInCart(
      cartProductsModified.filter(
        (cartProduct: ICartProductData) => cartProduct.amount !== cartProduct.quantity
      )
    );
  };

  const brandsArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: IProductData) => product.brand))
  );
  const categoriesArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: IProductData) => product.category))
  );

  const brandFilterHandler = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    value: string
  ): void => {
    if (value === brandFilter) {
      dispatch(setBrandFilter(null));
    } else {
      dispatch(setBrandFilter(value));
    }
  };

  const categoryFilterHandler = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    value: string
  ): void => {
    if (value === categoryFilter) {
      dispatch(setCategoryFilter(null));
    } else {
      dispatch(setCategoryFilter(value));
    }
  };

  const inStockFilterHandler: ChangeInputHandler = (event) => {
    if (inStockFilter) {
      dispatch(setInStockFilter(false));
    } else {
      dispatch(setInStockFilter(true));
    }
  };

  const productNameFilterHandler: ChangeInputHandler = (event) => {
    if (event.target.value) {
      dispatch(setProductNameFilter(event.target.value));
    } else {
      dispatch(setProductNameFilter(null));
    }
  };

  const minPriceFilterHandler: ChangeInputHandler = (event) => {
    if (event.target.value) {
      if (Number(event.target.value) === filteredProductsMinPrice) {
        dispatch(setMinPriceFilter(null));
      } else {
        dispatch(setMinPriceFilter(Number(event.target.value)));
      }
    }
  };

  const maxPriceFilterHandler: ChangeInputHandler = (event) => {
    if (event.target.value) {
      if (Number(event.target.value) === filteredProductsMaxPrice) {
        dispatch(setMaxPriceFilter(null));
      } else {
        dispatch(setMaxPriceFilter(Number(event.target.value)));
      }
    }
  };

  const resetSearchFilters: ClickAndTouchButtonHandler = (event) => {
    dispatch(setBrandFilter(null));
    dispatch(setCategoryFilter(null));
    dispatch(setInStockFilter(false));
    dispatch(setMaxPriceFilter(null));
    dispatch(setMinPriceFilter(null));
    dispatch(setProductNameFilter(null));
    setIsPriceRangesShown(false);
    productNameFilterInput.current && (productNameFilterInput.current.value = '');
  };

  function localStorageLoadData(): void {
    if (localStorage.getItem('online-store-data')) {
      const storageSaveData: ILocalStorageSaveObject = JSON.parse(
        localStorage.getItem('online-store-data') || ''
      );

      if (storageSaveData.cart.length > 0) {
        dispatch(setCart(storageSaveData.cart));
      }
      if (storageSaveData.brandFilter) {
        dispatch(setBrandFilter(storageSaveData.brandFilter));
      }
      if (storageSaveData.categoryFilter) {
        dispatch(setCategoryFilter(storageSaveData.categoryFilter));
      }
      if (storageSaveData.inStockFilter) {
        dispatch(setInStockFilter(storageSaveData.inStockFilter));
      }
      if (storageSaveData.maxPriceFilter) {
        dispatch(setMaxPriceFilter(storageSaveData.maxPriceFilter));
      }
      if (storageSaveData.minPriceFilter) {
        dispatch(setMinPriceFilter(storageSaveData.minPriceFilter));
      }
      if (storageSaveData.productNameFilter) {
        dispatch(setProductNameFilter(storageSaveData.productNameFilter));
        productNameFilterInput.current &&
          (productNameFilterInput.current.value = storageSaveData.productNameFilter);
      }
      if (storageSaveData.isPriceRangesShown) {
        setIsPriceRangesShown(true);
      }
      if (storageSaveData.isFiltersShown) {
        setIsFiltersShown(true);
      }
      if (storageSaveData.viewType) {
        dispatch(setViewType(storageSaveData.viewType));
      }
      if (storageSaveData.sortByName) {
        dispatch(setSortByName(storageSaveData.sortByName));
      }
      if (storageSaveData.sortByPrice) {
        dispatch(setSortByPrice(storageSaveData.sortByPrice));
      }
      if (storageSaveData.currentCartPage !== 1) {
        if (!cartPageQuery) {
          dispatch(setCurrentCartPage(storageSaveData.currentCartPage));
        } else {
          if (storageSaveData.currentCartPage === Number(cartPageQuery)) {
            dispatch(setCurrentCartPage(storageSaveData.currentCartPage));
          } else {
            dispatch(setCurrentCartPage(Number(cartPageQuery)));
          }
        }
      }
      if (storageSaveData.productsPerCartPage !== 2) {
        if (!productsPerPageQuery) {
          dispatch(setProductsPerCartPage(storageSaveData.productsPerCartPage));
        } else {
          if (storageSaveData.productsPerCartPage === Number(productsPerPageQuery)) {
            dispatch(setProductsPerCartPage(storageSaveData.productsPerCartPage));
          } else {
            dispatch(setProductsPerCartPage(Number(productsPerPageQuery)));
          }
        }
      }
      if (storageSaveData.activePromoCodes.length > 0) {
        dispatch(setActivePromoCodes(storageSaveData.activePromoCodes));
      }
    }
  }

  function localStorageSaveData(): void {
    const storageSaveData: ILocalStorageSaveObject = {
      brandFilter,
      categoryFilter,
      inStockFilter,
      maxPriceFilter,
      minPriceFilter,
      productNameFilter,
      isPriceRangesShown,
      viewType,
      sortByName,
      sortByPrice,
      isFiltersShown,
      cart: cartData,
      currentCartPage,
      productsPerCartPage,
      activePromoCodes,
    };
    localStorage.setItem('online-store-data', JSON.stringify(storageSaveData));
  }

  const navigateToMain: ClickAndTouchSpanHandler = (event) => {
    const urlSearchParams = new URLSearchParams();
    if (categoryFilter) {
      urlSearchParams.append('category', categoryFilter);
    }
    if (brandFilter) {
      urlSearchParams.append('brand', brandFilter);
    }
    if (productNameFilter) {
      urlSearchParams.append('name', productNameFilter);
    }
    if (inStockFilter) {
      urlSearchParams.append('instock', String(inStockFilter));
    }
    if (minPriceFilter) {
      urlSearchParams.append('minprice', String(minPriceFilter));
    }
    if (maxPriceFilter) {
      urlSearchParams.append('maxprice', String(maxPriceFilter));
    }
    if (viewType !== 'cards') {
      urlSearchParams.append('view', viewType);
    }
    if (sortByName) {
      urlSearchParams.append('namesort', sortByName);
    }
    if (sortByPrice) {
      urlSearchParams.append('pricesort', sortByPrice);
    }
    navigate(`/?${urlSearchParams}`);
    dispatch(setCurrentProduct(null));
  };

  function queryUpdate(): void {
    let filteredProducts: Array<IProductData> = products;
    const urlSearchParams = new URLSearchParams();

    if (categoryFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('category', categoryFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: IProductData) => product.category === categoryFilter
      );
    }
    if (brandFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('brand', brandFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: IProductData) => product.brand === brandFilter
      );
    }
    if (productNameFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('name', productNameFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: IProductData) =>
          product.name.toUpperCase().startsWith(productNameFilter.toUpperCase()) ||
          product.brand.toUpperCase().startsWith(productNameFilter.toUpperCase()) ||
          product.category.toUpperCase().startsWith(productNameFilter.toUpperCase()) ||
          product.description.toUpperCase().includes(productNameFilter.toUpperCase()) ||
          (product.inStock === true && productNameFilter.toUpperCase().includes('IN STOCK')) ||
          String(product.amount) === productNameFilter ||
          String(product.price) === productNameFilter ||
          product.properties.some((property: string) =>
            property.toUpperCase().includes(productNameFilter.toUpperCase())
          )
      );
    }
    if (inStockFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('instock', String(inStockFilter));
      }
      filteredProducts = filteredProducts.filter((product: IProductData) => product.inStock);
    }
    if (filteredProducts.length) {
      const minPrice: number = Math.min(
        ...filteredProducts.map((product: IProductData) => product.price || 0)
      );
      const maxPrice: number = Math.max(
        ...filteredProducts.map((product: IProductData) => product.price || 0)
      );

      setFilteredProductsMinPrice(minPrice);
      setFilteredProductsMaxPrice(maxPrice);
    }
    if (minPriceFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('minprice', String(minPriceFilter));
      }
      filteredProducts = filteredProducts.filter(
        (product: IProductData) => product.price >= minPriceFilter
      );
    }
    if (maxPriceFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('maxprice', String(maxPriceFilter));
      }
      filteredProducts = filteredProducts.filter(
        (product: IProductData) => product.price <= maxPriceFilter
      );
    }
    if (viewType !== 'cards') {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('view', viewType);
      }
    }
    if (sortByName) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('namesort', sortByName);
      }

      if (sortByName === 'ascending') {
        filteredProducts = [...filteredProducts].sort(
          (prevProduct: IProductData, nextProduct: IProductData) => {
            if (prevProduct.name > nextProduct.name) {
              return 1;
            }
            if (prevProduct.name < nextProduct.name) {
              return -1;
            }
            return 0;
          }
        );
      } else {
        filteredProducts = [...filteredProducts].sort(
          (prevProduct: IProductData, nextProduct: IProductData) => {
            if (prevProduct.name > nextProduct.name) {
              return -1;
            }
            if (prevProduct.name < nextProduct.name) {
              return 1;
            }
            return 0;
          }
        );
      }
    }
    if (sortByPrice) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('pricesort', sortByPrice);
      }

      if (sortByPrice === 'ascending') {
        filteredProducts = [...filteredProducts].sort(
          (prevProduct: IProductData, nextProduct: IProductData) => {
            if (prevProduct.price > nextProduct.price) {
              return 1;
            }
            if (prevProduct.price < nextProduct.price) {
              return -1;
            }
            return 0;
          }
        );
      } else {
        filteredProducts = [...filteredProducts].sort(
          (prevProduct: IProductData, nextProduct: IProductData) => {
            if (prevProduct.price > nextProduct.price) {
              return -1;
            }
            if (prevProduct.price < nextProduct.price) {
              return 1;
            }
            return 0;
          }
        );
      }
    }
    if (isFirstLoad) {
      localStorageLoadData();
      setIsFirstLoad(false);
    } else {
      localStorageSaveData();
    }

    dispatch(setFilteredProducts(filteredProducts));
    navigate(`?${urlSearchParams}`);
  }

  const isPricesRangesShownHandler: ClickAndTouchDivHandler = (event) => {
    const eventTarget = event.target as HTMLDivElement;
    if (
      eventTarget.classList.contains('price-range-input') ||
      eventTarget.classList.contains('price-text-input') ||
      eventTarget.classList.contains('range-wrapper') ||
      eventTarget.classList.contains('price-range-span')
    )
      return;
    if (isPriceRangesShown) {
      setIsPriceRangesShown(false);
    } else {
      setIsPriceRangesShown(true);
    }
  };

  const isFiltersShownHandler: ClickAndTouchButtonHandler = (event) => {
    if (isFiltersShown) {
      setIsFiltersShown(false);
    } else {
      setIsFiltersShown(true);
    }
  };

  const urlCopy: ClickAndTouchButtonHandler = (event) => {
    if (isUrlCopied) return;
    navigator.clipboard.writeText(location.href);
    setIsUrlCopied(true);
    setTimeout(() => {
      setIsUrlCopied(false);
    }, 2000);
  };

  const cartTransition: ClickAndTouchDivHandler = (event) => {
    if (location.href.includes('cart')) return;
    navigate('/cart');
  };

  useEffect((): void => {
    queryUpdate();
  }, [
    categoryFilter,
    brandFilter,
    productNameFilter,
    inStockFilter,
    minPriceFilter,
    maxPriceFilter,
    isPriceRangesShown,
    viewType,
    sortByName,
    sortByPrice,
    isFiltersShown,
    currentCartPage,
    productsPerCartPage,
    activePromoCodes.length,
  ]);

  useEffect((): void => {
    localStorageSaveData();
    cartProductsModifiedUpdate();
  }, [cartData]);

  useEffect((): void => {
    increasableProductsInCartUpdate();
  }, [cartProductsModified]);

  return (
    <header>
      {!location.href.includes('cart') && !location.href.includes('product') && (
        <FiltersBar
          filteredProducts={filteredProducts}
          brandsArray={brandsArray}
          brandFilter={brandFilter}
          categoriesArray={categoriesArray}
          categoryFilter={categoryFilter}
          brandFilterHandler={brandFilterHandler}
          categoryFilterHandler={categoryFilterHandler}
          isPricesRangesShownHandler={isPricesRangesShownHandler}
          minPriceFilterHandler={minPriceFilterHandler}
          maxPriceFilterHandler={maxPriceFilterHandler}
          isPriceRangesShown={isPriceRangesShown}
          filteredProductsMinPrice={filteredProductsMinPrice}
          filteredProductsMaxPrice={filteredProductsMaxPrice}
          maxPriceFilter={maxPriceFilter}
          minPriceFilter={minPriceFilter}
          minPriceRange={minPriceRange}
          maxPriceRange={maxPriceRange}
          inStockFilter={inStockFilter}
          inStockFilterHandler={inStockFilterHandler}
          resetSearchFilters={resetSearchFilters}
          isFiltersShown={isFiltersShown}
        />
      )}
      <span
        className="text-logo"
        onClick={(event: React.MouseEvent<HTMLSpanElement>) => navigateToMain(event)}
      >
        OnlineStore
      </span>
      {!location.href.includes('cart') && !location.href.includes('product') && (
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Product name or other info..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              productNameFilterHandler(event)
            }
            spellCheck={false}
            ref={productNameFilterInput}
          />
        </div>
      )}
      {!location.href.includes('cart') && !location.href.includes('product') && (
        <button
          type="button"
          className={isFiltersShown ? 'filters-show-button active' : 'filters-show-button'}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => isFiltersShownHandler(event)}
        >
          Filters
        </button>
      )}
      <button
        type="button"
        className={isUrlCopied ? 'url-copy-button url-copied' : 'url-copy-button'}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => urlCopy(event)}
      >
        {isUrlCopied ? `Copied!` : `URL Copy`}
      </button>
      <div
        className="cart-button"
        onClick={(event: React.MouseEvent<HTMLDivElement>) => cartTransition(event)}
      >
        {cartData.length > 0 && (
          <span className="cart-quantity-span">
            {increasableProductsInCart.length > 0
              ? `${cartData.length} (${increasableProductsInCart.length}) pcs`
              : `${cartData.length} pcs`}
          </span>
        )}
        <img src={cartLogo} alt="a cart logo" />
        {cartData.length > 0 && (
          <span className="cart-summary-span">{`${cartData.reduce(
            (sum, product: IProductData) => sum + product.price,
            0
          )}$`}</span>
        )}
      </div>
    </header>
  );
};
