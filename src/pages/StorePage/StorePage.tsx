import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/hooks';

import { getFilteredProducts, getViewType } from 'app/shopSlice';
import { IProductData, ViewType, Nullable } from '../../types/types';
import { ProductItem } from './components/ProductItem/ProductItem';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { SortBar } from './components/SortBar/SortBar';
import './StorePage.scss';

export const StorePage: FC = (): JSX.Element => {
  const filteredProducts: Array<IProductData> = useAppSelector(getFilteredProducts);
  const search: string = useLocation().search;
  const brandFilter: Nullable<string> = new URLSearchParams(search).get('brand');
  const categoryFilter: Nullable<string> = new URLSearchParams(search).get('category');
  const nameFilter: Nullable<string> = new URLSearchParams(search).get('name');
  const inStockFilter = Boolean(new URLSearchParams(search).get('instock'));
  const minPriceFilter: Nullable<number> = Number(new URLSearchParams(search).get('minprice'));
  const maxPriceFilter: Nullable<number> = Number(new URLSearchParams(search).get('maxprice'));
  const viewType: ViewType = useAppSelector(getViewType);
  const [isMouseOnMain, setIsMouseOnMain] = useState<boolean>(false);

  const isMouseOnMainTrue = (): void => {
    setIsMouseOnMain(true);
  };

  const isMouseOnMainFalse = (): void => {
    setIsMouseOnMain(false);
  };

  const filtersIsActive = (): boolean => {
    if (
      !brandFilter &&
      !categoryFilter &&
      !nameFilter &&
      !inStockFilter &&
      !minPriceFilter &&
      !maxPriceFilter
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Header />
      <main
        className={!filteredProducts?.length ? 'store-wrapper no-products' : 'store-wrapper'}
        onMouseOver={isMouseOnMainTrue}
        onMouseLeave={isMouseOnMainFalse}
      >
        {filteredProducts?.length && filtersIsActive() ? (
          <div
            className={
              viewType === 'cards' ? 'found-products-wrapper' : 'found-products-wrapper list-view'
            }
          >
            <span>{`Was found ${filteredProducts?.length} product(s)`}</span>
          </div>
        ) : null}
        <SortBar isMouseOnMain={isMouseOnMain} />
        <div
          className={viewType === 'cards' ? 'products-wrapper' : 'products-wrapper list-view'}
          data-testid="products-wrapper"
        >
          {filteredProducts?.length
            ? filteredProducts.map((product: IProductData) => {
                return (
                  <ProductItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    category={product.category}
                    description={product.description}
                    properties={product.properties}
                    posters={product.posters}
                    inStock={product.inStock}
                    amount={product.amount}
                  />
                );
              })
            : null}
          {!filteredProducts?.length && (
            <p className="no-products-paragraph">
              There are no products according to your filters...
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
