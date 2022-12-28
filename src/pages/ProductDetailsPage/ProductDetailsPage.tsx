import React, { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { Params, useParams } from 'react-router-dom';

import { getCurrentProduct, setCurrentProduct, getFilteredProducts } from 'app/shopSlice';
import { IProductData } from 'types/types';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import './ProductDetailsPage.scss';

export const ProductDetailsPage: FC = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  const filteredProducts: Array<IProductData> = useAppSelector(getFilteredProducts);
  const currentIProductData: IProductData | null = useAppSelector(getCurrentProduct);
  const { id }: Readonly<Params<string>> = useParams();

  useEffect(() => {
    if (!currentIProductData) {
      const currentProduct: IProductData | null = filteredProducts.filter(
        (product: IProductData) => String(product.id) === id
      )[0];

      if (currentProduct) {
        dispatch(setCurrentProduct(currentProduct));
      }
    }
  }, [filteredProducts]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentProduct(null));
    };
  }, []);

  return (
    <>
      <Header />
      <div className="product-details-wrapper">{`${currentIProductData?.name}`}</div>
      <Footer />
    </>
  );
};
