import React, { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { Params, useParams } from 'react-router-dom';

import { getCurrentProduct, setCurrentProduct, getFilteredProducts } from 'app/shopSlice';
import { ProductData } from 'types/types';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import './ProductDetailsPage.scss';

export const ProductDetailsPage: FC = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  const filteredProducts: Array<ProductData> = useAppSelector(getFilteredProducts);
  const currentProductData: ProductData | null = useAppSelector(getCurrentProduct);
  const { id }: Readonly<Params<string>> = useParams();

  useEffect(() => {
    if (!currentProductData) {
      const currentProduct: ProductData | null = filteredProducts.filter(
        (product: ProductData) => String(product.id) === id
      )[0];

      if (currentProduct) {
        dispatch(setCurrentProduct(currentProduct));
      }
    }
  }, [filteredProducts]);

  return (
    <>
      <Header />
      <div className="product-details-wrapper">{`${currentProductData?.name}`}</div>
      <Footer />
    </>
  );
};
