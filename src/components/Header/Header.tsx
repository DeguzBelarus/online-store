import React, { FC, useEffect, useState, useRef } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { NavigateFunction, useNavigate } from 'react-router-dom';

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
} from 'app/shopSlice';
import { ProductData } from '../../types/types';
import products from '../../products.json';
import { LocalStorageSaveObject } from '../../types/types';
import cartLogo from '../../assets/img/cart-logo.svg';
import './Header.scss';

export const Header: FC = (): JSX.Element => {
  const productNameFilterInput = useRef<HTMLInputElement>(null);
  const minPriceRange = useRef<HTMLInputElement>(null);
  const maxPriceRange = useRef<HTMLInputElement>(null);

  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [isPriceRangesShown, setIsPriceRangesShown] = useState<boolean>(false);
  const [isFiltersShown, setIsFiltersShown] = useState<boolean>(false);
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [filteredProductsMinPrice, setFilteredProductsMinPrice] = useState<number | null>(null);
  const [filteredProductsMaxPrice, setFilteredProductsMaxPrice] = useState<number | null>(null);

  const filteredProducts: Array<ProductData> = useAppSelector(getFilteredProducts);
  const categoryFilter: string | null = useAppSelector(getCategoryFilter);
  const brandFilter: string | null = useAppSelector(getBrandFilter);
  const inStockFilter: boolean = useAppSelector(getInStockFilter);
  const minPriceFilter: number | null = useAppSelector(getMinPriceFilter);
  const maxPriceFilter: number | null = useAppSelector(getMaxPriceFilter);
  const productNameFilter: string | null = useAppSelector(getProductNameFilter);
  const viewType: 'cards' | 'list' = useAppSelector(getViewType);
  const sortByName: 'ascending' | 'descending' | null = useAppSelector(getSortByName);
  const sortByPrice: 'ascending' | 'descending' | null = useAppSelector(getSortByPrice);
  const cartData: Array<ProductData> = useAppSelector(getCart);

  const brandsArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: ProductData) => product.brand))
  );
  const categoriesArray: Array<string> = Array.from(
    new Set(filteredProducts.map((product: ProductData) => product.category))
  );
  const brandFilterHandler = (value: string): void => {
    if (value === brandFilter) {
      dispatch(setBrandFilter(null));
    } else {
      dispatch(setBrandFilter(value));
    }
  };

  const categoryFilterHandler = (value: string): void => {
    if (value === categoryFilter) {
      dispatch(setCategoryFilter(null));
    } else {
      dispatch(setCategoryFilter(value));
    }
  };

  const inStockFilterHandler = (): void => {
    if (inStockFilter) {
      dispatch(setInStockFilter(false));
    } else {
      dispatch(setInStockFilter(true));
    }
  };

  const productNameFilterHandler = (value: string): void => {
    if (value) {
      dispatch(setProductNameFilter(value));
    } else {
      dispatch(setProductNameFilter(null));
    }
  };

  const minPriceFilterHandler = (value: string): void => {
    if (value) {
      dispatch(setMinPriceFilter(Number(value)));
    }
  };

  const maxPriceFilterHandler = (value: string): void => {
    if (value) {
      dispatch(setMaxPriceFilter(Number(value)));
    }
  };

  function resetSearchFilters() {
    dispatch(setBrandFilter(null));
    dispatch(setCategoryFilter(null));
    dispatch(setInStockFilter(false));
    dispatch(setMaxPriceFilter(null));
    dispatch(setMinPriceFilter(null));
    dispatch(setProductNameFilter(null));
    setIsPriceRangesShown(false);
    productNameFilterInput.current && (productNameFilterInput.current.value = '');
  }

  function localStorageLoadData(): void {
    if (localStorage.getItem('online-store-data')) {
      const storageSaveData: LocalStorageSaveObject = JSON.parse(
        localStorage.getItem('online-store-data') || ''
      );

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
    }
  }

  function localStorageSaveData(): void {
    const storageSaveData: LocalStorageSaveObject = {
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
    };
    localStorage.setItem('online-store-data', JSON.stringify(storageSaveData));
  }

  function navigateToMain(): void {
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
  }

  function queryUpdate(): void {
    let filteredProducts: Array<ProductData> = products;
    const urlSearchParams = new URLSearchParams();

    if (categoryFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('category', categoryFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: ProductData) => product.category === categoryFilter
      );
    }
    if (brandFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('brand', brandFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: ProductData) => product.brand === brandFilter
      );
    }
    if (productNameFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('name', productNameFilter);
      }
      filteredProducts = filteredProducts.filter(
        (product: ProductData) =>
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
      filteredProducts = filteredProducts.filter((product: ProductData) => product.inStock);
    }
    if (filteredProducts.length) {
      const minPrice: number = Math.min(
        ...filteredProducts.map((product: ProductData) => product.price || 0)
      );
      const maxPrice: number = Math.max(
        ...filteredProducts.map((product: ProductData) => product.price || 0)
      );

      setFilteredProductsMinPrice(minPrice);
      setFilteredProductsMaxPrice(maxPrice);
    }
    if (minPriceFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('minprice', String(minPriceFilter));
      }
      filteredProducts = filteredProducts.filter(
        (product: ProductData) => product.price >= minPriceFilter
      );
    }
    if (maxPriceFilter) {
      if (!location.href.includes('cart') && !location.href.includes('product')) {
        urlSearchParams.append('maxprice', String(maxPriceFilter));
      }
      filteredProducts = filteredProducts.filter(
        (product: ProductData) => product.price <= maxPriceFilter
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
          (prevProduct: ProductData, nextProduct: ProductData) => {
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
          (prevProduct: ProductData, nextProduct: ProductData) => {
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
          (prevProduct: ProductData, nextProduct: ProductData) => {
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
          (prevProduct: ProductData, nextProduct: ProductData) => {
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

  const isPricesRangesShownHandler = (target: HTMLDivElement): void => {
    if (
      target.classList.contains('price-range-input') ||
      target.classList.contains('price-text-input') ||
      target.classList.contains('range-wrapper') ||
      target.classList.contains('price-range-span')
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

  const urlCopy = (): void => {
    if (isUrlCopied) return;
    navigator.clipboard.writeText(location.href);
    setIsUrlCopied(true);
    setTimeout(() => {
      setIsUrlCopied(false);
    }, 2000);
  };

  const cartTransition = (): void => {
    navigate('/cart');
  };

  useEffect(() => {
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
  ]);

  return (
    <header>
      <span className="text-logo" onClick={navigateToMain}>
        OnlineStore
      </span>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Enter a product name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            productNameFilterHandler(event.target.value)
          }
          spellCheck={false}
          ref={productNameFilterInput}
        />
      </div>
      <button
        type="button"
        className={isFiltersShown ? 'filters-show-button active' : 'filters-show-button'}
        onClick={isFiltersShownHandler}
      >
        Filters
      </button>
      <button
        type="button"
        className={isUrlCopied ? 'url-copy-button url-copied' : 'url-copy-button'}
        onClick={urlCopy}
      >
        {isUrlCopied ? `Copied!` : `URL Copy`}
      </button>
      {isFiltersShown && (
        <div className="filters-wrapper">
          <div className="brands-wrapper">
            <span>brands: </span>
            {brandsArray.map((brand: string, index: number) => {
              return (
                <div
                  className={brandFilter === brand ? 'brand-item active' : 'brand-item'}
                  key={index}
                  onClick={() => brandFilterHandler(brand)}
                >
                  <span>{brand}</span>
                </div>
              );
            })}
          </div>
          <div
            className="price-range-wrapper"
            onClick={(event: React.MouseEvent) =>
              isPricesRangesShownHandler(event.target as HTMLDivElement)
            }
          >
            <span className="prices-range-span">price range</span>
            {isPriceRangesShown && (
              <div className="ranges-wrapper">
                <div className="range-wrapper">
                  <span className="price-range-span">min: </span>
                  <input
                    type="range"
                    className="price-range-input"
                    title="choose the minimal prise"
                    min={filteredProductsMinPrice || 0}
                    max={maxPriceFilter || 5000}
                    value={minPriceFilter || 0}
                    step={10}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      minPriceFilterHandler(event.target.value)
                    }
                    ref={minPriceRange}
                  />
                  <input
                    type="text"
                    className="price-text-input"
                    title="current minimal price"
                    value={(minPriceFilter || filteredProductsMinPrice || 0) + '$'}
                    readOnly={true}
                  />
                </div>
                <div className="range-wrapper">
                  <span className="price-range-span">max: </span>
                  <input
                    type="range"
                    className="price-range-input"
                    title="choose the maximal prise"
                    min={minPriceFilter || 0}
                    max={filteredProductsMaxPrice || 5000}
                    value={maxPriceFilter || 5000}
                    step={10}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      maxPriceFilterHandler(event.target.value)
                    }
                    ref={maxPriceRange}
                  />
                  <input
                    type="text"
                    className="price-text-input"
                    title="current maximal price"
                    value={(maxPriceFilter || filteredProductsMaxPrice || 5000) + '$'}
                    readOnly={true}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="categories-wrapper">
            <span>categories: </span>
            {categoriesArray.map((category: string, index: number) => {
              return (
                <div
                  className={categoryFilter === category ? 'category-item active' : 'category-item'}
                  key={index}
                  onClick={() => categoryFilterHandler(category)}
                >
                  <span>{category}</span>
                </div>
              );
            })}
          </div>
          <div className="in-stock-wrapper">
            <span>in stock: </span>
            <input
              type="checkbox"
              className="in-stock-checkbox"
              title="in stock only"
              checked={inStockFilter}
              disabled={filteredProducts.length < 1}
              onChange={inStockFilterHandler}
            />
          </div>
          <button type="button" className="reset-filters-button" onClick={resetSearchFilters}>
            Reset
          </button>
        </div>
      )}
      <div className="cart-button" onClick={cartTransition}>
        <img src={cartLogo} alt="a cart logo" />
        {cartData.length > 0 && <span>{cartData.length}</span>}
      </div>
    </header>
  );
};
