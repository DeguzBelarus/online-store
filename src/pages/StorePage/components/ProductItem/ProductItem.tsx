import React, { FC } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { useNavigate, NavigateFunction } from 'react-router-dom';

import addToCartLogo from '../../../../assets/img/add-to-cart.png';
import { getViewType, setCurrentProduct, getCart, setCart } from 'app/shopSlice';
import { IProductData, ViewType } from '../../../../types/types';
import './ProductItem.scss';

export const ProductItem: FC<IProductData> = ({ ...IProductData }) => {
  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const cartData: Array<IProductData> = useAppSelector(getCart);
  const viewType: ViewType = useAppSelector(getViewType);

  const productDetailsTransition = (): void => {
    dispatch(setCurrentProduct({ ...IProductData }));
    navigate(`/product/${IProductData.id}`);
  };

  const productInCartAvailabilityCheck = (): boolean => {
    return cartData.some((cartProduct: IProductData) => cartProduct.id === IProductData.id);
  };

  const addProductToCart = (): void => {
    dispatch(setCart([...cartData, { ...IProductData }]));
  };

  const removeProductFromCart = (): void => {
    dispatch(
      setCart(cartData.filter((cartProduct: IProductData) => cartProduct.id !== IProductData.id))
    );
  };

  return (
    <div className={viewType === 'cards' ? 'external-wrapper' : 'external-wrapper list-view'}>
      <div
        className={viewType === 'cards' ? 'product-item-wrapper' : 'product-item-wrapper list-view'}
        onClick={productDetailsTransition}
        data-testid="product-card"
      >
        <p className="name-paragraph">{IProductData.name}</p>
        <div
          className={
            !IProductData.inStock && !IProductData.amount
              ? 'poster-wrapper poster-out-of-stock'
              : 'poster-wrapper'
          }
        >
          <img
            draggable={false}
            src={require('../../../../assets/img/' + IProductData.posters[0])}
            className="poster"
            alt="product preview"
          />
        </div>
        {viewType === 'list' && (
          <>
            <span className="description-span">{`brand: ${IProductData.brand} amount: ${IProductData.amount} pcs`}</span>
          </>
        )}
        <p className="price-paragraph">{`${IProductData.price}`}$</p>
      </div>
      {IProductData.inStock && IProductData.amount && (
        <button
          type="button"
          className="add-to-cart-button"
          onClick={productInCartAvailabilityCheck() ? removeProductFromCart : addProductToCart}
        >
          {!productInCartAvailabilityCheck() ? (
            <img src={addToCartLogo} alt="an add to cart logo" />
          ) : (
            <span>remove</span>
          )}
        </button>
      )}
      {!IProductData.inStock && !IProductData.amount && (
        <div className="out-out-stock-container">
          <p className="out-of-stock-paragraph">OUT OF STOCK</p>
          <div className="left-ribbon"></div>
          <div className="right-ribbon"></div>
        </div>
      )}
    </div>
  );
};
