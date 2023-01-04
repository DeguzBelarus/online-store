import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/hooks';

import { getFilteredProducts, getViewType } from 'app/shopSlice';
import { IProductData, ViewType, ClickAndTouchDivHandler, Nullable } from '../../types/types';
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
  const instockFilter: boolean =
    new URLSearchParams(search).get('instock') === 'true' ? true : false;
  const minpriceFilter: Nullable<number> = Number(new URLSearchParams(search).get('minprice'));
  const maxpriceFilter: Nullable<number> = Number(new URLSearchParams(search).get('maxprice'));
  const viewType: ViewType = useAppSelector(getViewType);
  const [isMouseOnMain, setIsMouseOnMain] = useState<boolean>(false);

  const isMouseOnMainTrue: ClickAndTouchDivHandler = (event) => {
    setIsMouseOnMain(true);
  };

  const isMouseOnMainFalse: ClickAndTouchDivHandler = (event) => {
    setIsMouseOnMain(false);
  };

  const filtersIsActive = (): boolean => {
    if (
      brandFilter !== null ||
      categoryFilter !== null ||
      nameFilter !== null ||
      instockFilter ||
      minpriceFilter !== 0 ||
      maxpriceFilter !== 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Header />
      <div
        className={filteredProducts.length < 1 ? 'store-wrapper no-products' : 'store-wrapper'}
        onMouseOver={(event: React.MouseEvent<HTMLDivElement>) => isMouseOnMainTrue(event)}
        onMouseLeave={(event: React.MouseEvent<HTMLDivElement>) => isMouseOnMainFalse(event)}
        data-testid="store-page"
      >
        {filteredProducts.length > 0 && filtersIsActive() && (
          <div
            className={
              viewType === 'cards' ? 'found-products-wrapper' : 'found-products-wrapper list-view'
            }
          >
            <span>{`Was found ${filteredProducts.length} product(s)`}</span>
          </div>
        )}
        <SortBar isMouseOnMain={isMouseOnMain} />
        <div
          className={viewType === 'cards' ? 'products-wrapper' : 'products-wrapper list-view'}
          data-testid="products-wrapper"
        >
          {filteredProducts.length > 0 &&
            filteredProducts.map((product: IProductData) => {
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
            })}
          {filteredProducts.length === 0 && (
            <p className="no-products-paragraph">
              There are no products according to your filters...
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
