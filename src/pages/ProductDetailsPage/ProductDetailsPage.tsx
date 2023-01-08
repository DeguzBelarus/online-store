import React, { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { Params, useParams, useNavigate, NavigateFunction } from 'react-router-dom';

import {
  getCurrentProduct,
  setCurrentProduct,
  getFilteredProducts,
  getCart,
  setCart,
  setCategoryFilter,
  setBrandFilter,
  setIsFiltersShown,
} from 'app/shopSlice';
import { IProductData, Nullable } from 'types/types';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import './ProductDetailsPage.scss';

export const ProductDetailsPage: FC = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const cartData: Array<IProductData> = useAppSelector(getCart);
  const filteredProducts: Array<IProductData> = useAppSelector(getFilteredProducts);
  const currentIProductData: Nullable<IProductData> = useAppSelector(getCurrentProduct);
  const { id }: Readonly<Params<string>> = useParams();
  const [bigPhotoSrc, setBigPhotoSrc] = useState<Nullable<string>>(null);

  const productInCartAvailabilityCheck = (): boolean => {
    return cartData.some((cartProduct: IProductData) => cartProduct.id === currentIProductData?.id);
  };

  const addProductToCart = (): void => {
    if (currentIProductData) {
      dispatch(setCart([...cartData, { ...currentIProductData }]));
    }
  };

  const removeProductFromCart = (): void => {
    dispatch(
      setCart(
        cartData.filter((cartProduct: IProductData) => cartProduct.id !== currentIProductData?.id)
      )
    );
  };

  const instantlyBuyProduct = (): void => {
    addProductToCart();
    navigate('/cart/order/');
  };

  const translateToCurrentCategory = (): void => {
    dispatch(setBrandFilter(null));
    dispatch(
      setCategoryFilter(
        currentIProductData && currentIProductData.category ? currentIProductData.category : null
      )
    );
    dispatch(setIsFiltersShown(true));
    navigate(`/`);
  };

  const translateToCurrentBrand = (): void => {
    dispatch(setCategoryFilter(null));
    dispatch(
      setBrandFilter(
        currentIProductData && currentIProductData.brand ? currentIProductData.brand : null
      )
    );
    dispatch(setIsFiltersShown(true));
    navigate(`/`);
  };

  const translateToMainNoBrandAndCategory = (): void => {
    dispatch(setCategoryFilter(null));
    dispatch(setBrandFilter(null));
    dispatch(setIsFiltersShown(true));
    navigate(`/`);
  };

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
    if (currentIProductData?.posters) {
      setBigPhotoSrc(currentIProductData?.posters[0]);
    }
  }, [currentIProductData?.posters]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentProduct(null));
    };
  }, []);

  return (
    <div className="product-details-page-wrapper">
      <Header />
      <div className="product-details-page-content">
        {currentIProductData ? (
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumbs">
              <div className="crumb">
                <span onClick={translateToMainNoBrandAndCategory}>Store</span>
              </div>
              <span> {'>>'} </span>
              <div className="crumb">
                <span onClick={translateToCurrentCategory}>{currentIProductData?.category}</span>
              </div>
              <span> {'>>'} </span>
              <div className="crumb">
                <span onClick={translateToCurrentBrand}>{currentIProductData?.brand}</span>
              </div>
              <span> {'>>'} </span>
              <div className="crumb">
                <span>{currentIProductData?.name}</span>
              </div>
            </div>
          </div>
        ) : null}
        <div
          className={
            currentIProductData ? 'product-details-wrapper' : 'product-details-wrapper no-product'
          }
        >
          {currentIProductData ? (
            <>
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
                              onClick={() => setBigPhotoSrc(poster)}
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
                    {bigPhotoSrc ? (
                      <img
                        className="big-photo"
                        src={require(`../../assets/img/${bigPhotoSrc}`)}
                        alt="a product photo"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-detail-item">
                    <h3 className="product-detail-item-title">Brand</h3>
                    <p className="product-detail-item-text">{`${currentIProductData?.brand}`}</p>
                  </div>
                  <div className="product-detail-item">
                    <h3 className="product-detail-item-title">Description</h3>
                    <p className="product-detail-item-text">{`${currentIProductData?.description}`}</p>
                  </div>
                  <div className="product-detail-item">
                    <h3 className="product-detail-item-title">Category</h3>
                    <p className="product-detail-item-text">{`${currentIProductData?.category}`}</p>
                  </div>
                </div>
                <div className="add-to-cart">
                  <div className="product-data-price">{`${currentIProductData?.price}`}</div>
                  {currentIProductData?.inStock && currentIProductData.amount > 0 && (
                    <button
                      type="button"
                      className="add-to-cart-button"
                      onClick={
                        productInCartAvailabilityCheck() ? removeProductFromCart : addProductToCart
                      }
                    >
                      add to cart
                    </button>
                  )}
                  {!currentIProductData?.inStock && currentIProductData?.amount === 0 && (
                    <div className="out-out-stock-container">
                      <p className="out-of-stock-paragraph">OUT OF STOCK</p>
                    </div>
                  )}
                  {currentIProductData?.inStock && currentIProductData.amount > 0 && (
                    <button
                      type="button"
                      className="add-to-cart-button"
                      onClick={instantlyBuyProduct}
                    >
                      buy now
                    </button>
                  )}
                  {!currentIProductData?.inStock && currentIProductData?.amount === 0 && (
                    <div className="out-out-stock-container">
                      <p className="out-of-stock-paragraph">OUT OF STOCK</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="no-products-paragraph">Such a product was not found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
