import React, { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { Params, useParams, Link, useNavigate, NavigateFunction } from 'react-router-dom';

import {
  getCurrentProduct,
  setCurrentProduct,
  getFilteredProducts,
  getCart,
  setCart,
} from 'app/shopSlice';
import { IProductData, ClickAndTouchButtonHandler } from 'types/types';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import './ProductDetailsPage.scss';

export const ProductDetailsPage: FC = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const cartData: Array<IProductData> = useAppSelector(getCart);
  const filteredProducts: Array<IProductData> = useAppSelector(getFilteredProducts);
  const currentIProductData: IProductData | null = useAppSelector(getCurrentProduct);
  const { id }: Readonly<Params<string>> = useParams();
  const [bigPhotoSrc, setBigPhotoSrc] = useState('posters/A12/a12.jpeg');

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

  useEffect(() => {
    if (currentIProductData?.posters) {
      setBigPhotoSrc(currentIProductData?.posters[0]);
    }
  }, [currentIProductData?.posters]);

  const productInCartAvailabilityCheck = (): boolean => {
    return cartData.some((cartProduct: IProductData) => cartProduct.id === currentIProductData?.id);
  };

  const addProductToCart: ClickAndTouchButtonHandler = () => {
    if (currentIProductData) {
      const productToCart: IProductData = {
        id: currentIProductData.id,
        name: currentIProductData.name,
        brand: currentIProductData.name,
        price: currentIProductData.price,
        category: currentIProductData.category,
        description: currentIProductData.description,
        properties: currentIProductData.properties,
        posters: currentIProductData.posters,
        inStock: currentIProductData.inStock,
        amount: currentIProductData.amount,
      };
      dispatch(setCart([...cartData, { ...productToCart }]));
    }
  };

  const removeProductFromCart: ClickAndTouchButtonHandler = (event) => {
    dispatch(
      setCart(
        cartData.filter((cartProduct: IProductData) => cartProduct.id !== currentIProductData?.id)
      )
    );
  };

  const buyProduct: ClickAndTouchButtonHandler = (event) => {
    addProductToCart(event);
    navigate('/cart/order/');
  };

  return (
    <>
      <Header />
      <div className="breadcrumbs-wrapper">
        <div className="breadcrumbs">
          <div className="crumb">
            <Link to={`/`}>Store</Link>
          </div>
          <span> {'>>'} </span>
          <div className="crumb">
            <Link to={`/?category=${currentIProductData?.category}`}>
              {currentIProductData?.category}
            </Link>
          </div>
          <span> {'>>'} </span>
          <div className="crumb">
            <Link to={`/?brand=${currentIProductData?.brand}`}>{currentIProductData?.brand}</Link>
          </div>
          <span> {'>>'} </span>
          <div className="crumb">
            <span>{currentIProductData?.name}</span>
          </div>
        </div>
      </div>

      <div className="product-details-wrapper">
        <div className="product-title">
          <h1>{`${currentIProductData?.name}`}</h1>
        </div>
        <div className="product-data">
          <div className="product-photos">
            <div className="small-photos">
              {currentIProductData?.posters && currentIProductData.posters.length > 0 && (
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
              )}
            </div>
            <div className="big-photo-wrapper">
              <img
                className="big-photo"
                src={require(`../../assets/img/${bigPhotoSrc}`)}
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
            {currentIProductData?.inStock && currentIProductData.amount > 0 && (
              <button
                type="button"
                className="add-to-cart-button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  productInCartAvailabilityCheck()
                    ? removeProductFromCart(event)
                    : addProductToCart(event)
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
                className="add-to-cart-button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => buyProduct(event)}
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
      </div>

      <Footer />
    </>
  );
};
