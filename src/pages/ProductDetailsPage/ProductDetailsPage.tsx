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
      <div className="hleb"></div>
      <div className="product-details-wrapper">
        <div className="product-title">
          <h1>{`${currentIProductData?.name}`}</h1>
        </div>
        <div className="product-data">
          <div className="product-photos">
            <div className="small-photos">
              {currentIProductData?.posters && currentIProductData.posters.length ? (
                <div className="small-photo-wrapper">
                  {currentIProductData?.posters.map((poster: string, index: number) => {
                    return (
                      <img
                        className="small-photo"
                        src={require(`../../assets/img/${poster}`)}
                        key={index}
                        alt="a product preview"
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="big-photo-wrapper">
              <img
                className="big-photo"
                src={require(`../../assets/img/posters/A70/a70.jpeg`)}
                alt="a product photo"
              />
            </div>
          </div>
          <div className="product-info">
            <div className="product-detail-item">
              <h3>Brand</h3>
              <p>{`${currentIProductData?.brand}`}</p>
            </div>
            <div className="product-detail-item">
              <h3>Description</h3>
              {`${currentIProductData?.description}`}
            </div>
            <div className="product-detail-item">
              <h3>Category</h3>
              {`${currentIProductData?.category}`}
            </div>
          </div>
          <div className="add-to-cart">
            <div className="product-data-price">{`${currentIProductData?.price}`}</div>
            <button className="add-to-cart-button">add to cart</button>
            <button className="add-to-cart-button">buy now</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
