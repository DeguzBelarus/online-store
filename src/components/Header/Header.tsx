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
  ClickAndTouchDivHandler,
  Nullable,
  ClickAndTouchDivHandlerParametric,
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
  const brandFilterQuery: Nullable<string> = new URLSearchParams(search).get('brand');
  const categoryFilterQuery: Nullable<string> = new URLSearchParams(search).get('category');
  const nameFilterQuery: Nullable<string> = new URLSearchParams(search).get('name');
  const instockFilterQuery = Boolean(new URLSearchParams(search).get('instock'));
  const minPriceFilterQuery: Nullable<number> = Number(new URLSearchParams(search).get('minprice'));
  const maxPriceFilterQuery: Nullable<number> = Number(new URLSearchParams(search).get('maxprice'));
  const viewTypeQuery: Nullable<string> = new URLSearchParams(search).get('view');
  const sortByNameQuery: Nullable<string> = new URLSearchParams(search).get('namesort');
  const sortByPriceQuery: Nullable<string> = new URLSearchParams(search).get('pricesort');

  const brandsArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: IProductData) => product.brand))
  );
  const categoriesArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: IProductData) => product.category))
  );

  const filtersIsActive = (): boolean => {
    if (
      !brandFilter &&
      !categoryFilter &&
      !productNameFilter &&
      !inStockFilter &&
      !minPriceFilter &&
      !maxPriceFilter
    ) {
      return false;
    }
    return true;
  };

  const cartProductsModifiedUpdate = (): void => {
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
              ?.length,
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
  };

  const increasableProductsInCartUpdate = (): void => {
    setIncreasableProductsInCart(
      cartProductsModified.filter(
        (cartProduct: ICartProductData) => cartProduct.amount !== cartProduct.quantity
      )
    );
  };

  const brandFilterHandler: ClickAndTouchDivHandlerParametric<string> = (event, value): void => {
    dispatch(setBrandFilter(value === brandFilter ? null : value));
  };

  const categoryFilterHandler: ClickAndTouchDivHandlerParametric<string> = (event, value): void => {
    dispatch(setCategoryFilter(value === categoryFilter ? null : value));
  };

  const inStockFilterHandler = (): void => {
    dispatch(setInStockFilter(inStockFilter ? false : true));
  };

  const productNameFilterHandler: ChangeInputHandler = ({ target: { value } }) => {
    dispatch(setProductNameFilter(value ? value : null));
  };

  const minPriceFilterHandler: ChangeInputHandler = ({ target: { value } }) => {
    if (value) {
      dispatch(
        setMinPriceFilter(Number(value) === filteredProductsMinPrice ? null : Number(value))
      );
    }
  };

  const maxPriceFilterHandler: ChangeInputHandler = ({ target: { value } }) => {
    if (value) {
      dispatch(
        setMaxPriceFilter(Number(value) === filteredProductsMaxPrice ? null : Number(value))
      );
    }
  };

  const resetSearchFilters = (): void => {
    dispatch(setBrandFilter(null));
    dispatch(setCategoryFilter(null));
    dispatch(setInStockFilter(false));
    dispatch(setMaxPriceFilter(null));
    dispatch(setMinPriceFilter(null));
    dispatch(setProductNameFilter(null));
    setIsPriceRangesShown(false);
    productNameFilterInput.current && (productNameFilterInput.current.value = '');
  };

  const localStorageLoadData = (): void => {
    if (localStorage.getItem('online-store-data')) {
      const storageSaveData: ILocalStorageSaveObject = JSON.parse(
        localStorage.getItem('online-store-data') || ''
      );

      if (storageSaveData.cart?.length) {
        dispatch(setCart(storageSaveData.cart));
      }
      if (storageSaveData.brandFilter || brandFilterQuery) {
        if (!brandFilterQuery) {
          dispatch(setBrandFilter(storageSaveData.brandFilter));
        } else {
          if (storageSaveData.brandFilter === brandFilterQuery) {
            dispatch(setBrandFilter(storageSaveData.brandFilter));
          } else {
            dispatch(setBrandFilter(brandFilterQuery));
          }
        }
      }
      if (storageSaveData.categoryFilter || categoryFilterQuery) {
        if (!categoryFilterQuery) {
          dispatch(setCategoryFilter(storageSaveData.categoryFilter));
        } else {
          if (storageSaveData.categoryFilter === categoryFilterQuery) {
            dispatch(setCategoryFilter(storageSaveData.categoryFilter));
          } else {
            dispatch(setCategoryFilter(categoryFilterQuery));
          }
        }
      }
      if (storageSaveData.inStockFilter || instockFilterQuery) {
        if (!instockFilterQuery) {
          dispatch(setInStockFilter(storageSaveData.inStockFilter));
        } else {
          if (storageSaveData.inStockFilter === instockFilterQuery) {
            dispatch(setInStockFilter(storageSaveData.inStockFilter));
          } else {
            dispatch(setInStockFilter(instockFilterQuery));
          }
        }
      }
      if (storageSaveData.maxPriceFilter || maxPriceFilterQuery) {
        if (!maxPriceFilterQuery) {
          dispatch(setMaxPriceFilter(storageSaveData.maxPriceFilter));
        } else {
          if (storageSaveData.maxPriceFilter === maxPriceFilterQuery) {
            dispatch(setMaxPriceFilter(storageSaveData.maxPriceFilter));
          } else {
            dispatch(setMaxPriceFilter(maxPriceFilterQuery));
          }
        }
      }
      if (storageSaveData.minPriceFilter || minPriceFilterQuery) {
        if (!minPriceFilterQuery) {
          dispatch(setMinPriceFilter(storageSaveData.minPriceFilter));
        } else {
          if (storageSaveData.minPriceFilter === minPriceFilterQuery) {
            dispatch(setMinPriceFilter(storageSaveData.minPriceFilter));
          } else {
            dispatch(setMinPriceFilter(minPriceFilterQuery));
          }
        }
      }
      if (storageSaveData.productNameFilter || nameFilterQuery) {
        if (!nameFilterQuery) {
          dispatch(setProductNameFilter(storageSaveData.productNameFilter));
          productNameFilterInput.current &&
            storageSaveData.productNameFilter &&
            (productNameFilterInput.current.value = storageSaveData.productNameFilter);
        } else {
          if (storageSaveData.productNameFilter === nameFilterQuery) {
            dispatch(setProductNameFilter(storageSaveData.productNameFilter));
            productNameFilterInput.current &&
              storageSaveData.productNameFilter &&
              (productNameFilterInput.current.value = storageSaveData.productNameFilter);
          } else {
            dispatch(setProductNameFilter(nameFilterQuery));
            productNameFilterInput.current &&
              nameFilterQuery &&
              (productNameFilterInput.current.value = nameFilterQuery);
          }
        }
      }
      if (storageSaveData.isPriceRangesShown) {
        setIsPriceRangesShown(true);
      }
      if (storageSaveData.isFiltersShown) {
        setIsFiltersShown(true);
      }
      if (storageSaveData.viewType || viewTypeQuery) {
        if (!viewTypeQuery && storageSaveData.viewType) {
          dispatch(setViewType(storageSaveData.viewType));
        } else {
          if (storageSaveData.viewType === viewTypeQuery) {
            dispatch(setViewType(storageSaveData.viewType));
          } else {
            if (viewTypeQuery === 'cards' || viewTypeQuery === 'list') {
              dispatch(setViewType(viewTypeQuery));
            }
          }
        }
      }
      if (storageSaveData.sortByName || sortByNameQuery) {
        if (!sortByNameQuery && storageSaveData.sortByName) {
          dispatch(setSortByName(storageSaveData.sortByName));
        } else {
          if (storageSaveData.sortByName === sortByNameQuery) {
            dispatch(setSortByName(storageSaveData.sortByName));
          } else {
            if (sortByNameQuery === 'ascending' || sortByNameQuery === 'descending') {
              dispatch(setSortByName(sortByNameQuery));
            }
          }
        }
      }
      if (storageSaveData.sortByPrice || sortByPriceQuery) {
        if (!sortByPriceQuery && storageSaveData.sortByPrice) {
          dispatch(setSortByPrice(storageSaveData.sortByPrice));
        } else {
          if (storageSaveData.sortByPrice === sortByPriceQuery) {
            dispatch(setSortByPrice(storageSaveData.sortByPrice));
          } else {
            if (sortByPriceQuery === 'ascending' || sortByPriceQuery === 'descending') {
              dispatch(setSortByPrice(sortByPriceQuery));
            }
          }
        }
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
      if (storageSaveData.activePromoCodes?.length) {
        dispatch(setActivePromoCodes(storageSaveData.activePromoCodes));
      }
    } else {
      if (brandFilterQuery) {
        dispatch(setBrandFilter(brandFilterQuery));
      }
      if (categoryFilterQuery) {
        dispatch(setCategoryFilter(categoryFilterQuery));
      }
      if (instockFilterQuery) {
        dispatch(setInStockFilter(instockFilterQuery));
      }
      if (maxPriceFilterQuery) {
        dispatch(setMaxPriceFilter(maxPriceFilterQuery));
      }
      if (minPriceFilterQuery) {
        dispatch(setMinPriceFilter(minPriceFilterQuery));
      }
      if (nameFilterQuery) {
        dispatch(setProductNameFilter(nameFilterQuery));
        productNameFilterInput.current &&
          nameFilterQuery &&
          (productNameFilterInput.current.value = nameFilterQuery);
      }
      if (viewTypeQuery) {
        if (viewTypeQuery === 'cards' || viewTypeQuery === 'list') {
          dispatch(setViewType(viewTypeQuery));
        }
      }
      if (sortByNameQuery) {
        if (sortByNameQuery === 'ascending' || sortByNameQuery === 'descending') {
          dispatch(setSortByName(sortByNameQuery));
        }
      }
      if (sortByPriceQuery) {
        if (sortByPriceQuery === 'ascending' || sortByPriceQuery === 'descending') {
          dispatch(setSortByPrice(sortByPriceQuery));
        }
      }
    }
  };

  const localStorageSaveData = (): void => {
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
  };

  const navigateToMain = (): void => {
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

  const queryUpdate = (): void => {
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
    if (filteredProducts?.length) {
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
  };

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

  const isFiltersShownHandler = (): void => {
    if (isFiltersShown) {
      setIsFiltersShown(false);
    } else {
      setIsFiltersShown(true);
    }
  };

  const urlCopy: ClickAndTouchButtonHandler = (): void => {
    if (isUrlCopied) return;
    navigator.clipboard.writeText(location.href);
    setIsUrlCopied(true);
    setTimeout(() => {
      setIsUrlCopied(false);
    }, 2000);
  };

  const cartTransition = (): void => {
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
    activePromoCodes?.length,
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
          filtersIsActive={filtersIsActive}
        />
      )}
      <span className="text-logo" onClick={navigateToMain}>
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
          className={
            isFiltersShown
              ? 'filters-show-button shown'
              : filtersIsActive()
              ? 'filters-show-button active'
              : 'filters-show-button'
          }
          onClick={isFiltersShownHandler}
        >
          Filters
        </button>
      )}
      <button
        type="button"
        className={isUrlCopied ? 'url-copy-button url-copied' : 'url-copy-button'}
        onClick={urlCopy}
      >
        {isUrlCopied ? `Copied!` : `URL Copy`}
      </button>
      <div className="cart-button" onClick={cartTransition}>
        {cartData?.length ? (
          <span className="cart-quantity-span">
            {increasableProductsInCart?.length
              ? `${cartData?.length} (${increasableProductsInCart.length}) pcs`
              : `${cartData?.length} pcs`}
          </span>
        ) : null}
        <img src={cartLogo} alt="a cart logo" />
        {cartData?.length ? (
          <span className="cart-summary-span">{`${cartData.reduce(
            (sum, product: IProductData) => sum + product.price,
            0
          )}$`}</span>
        ) : null}
      </div>
    </header>
  );
};
