import React, { FC } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { useNavigate, NavigateFunction } from 'react-router-dom';

import addToCartLogo from '../../../../assets/img/add-to-cart.png';
import { getViewType, setCurrentProduct, getCart, setCart } from 'app/shopSlice';
import { ProductData } from '../../../../types/types';
import './ProductItem.scss';

export const ProductItem: FC<ProductData> = ({ ...productData }) => {
  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const cartData: Array<ProductData> = useAppSelector(getCart);
  const viewType: 'cards' | 'list' = useAppSelector(getViewType);

  const productDetailsTransition = (): void => {
    dispatch(setCurrentProduct({ ...productData }));
    navigate(`/product/${productData.id}`);
  };

  const addProductToCart = (): void => {
    dispatch(setCart([...cartData, { ...productData }]));
  };
  return (
    <div className={viewType === 'cards' ? 'external-wrapper' : 'external-wrapper list-view'}>
      <div
        className={viewType === 'cards' ? 'product-item-wrapper' : 'product-item-wrapper list-view'}
        onClick={productDetailsTransition}
      >
        <p className="name-paragraph">{productData.name}</p>
        <div className="poster-wrapper">
          <img
            draggable={false}
            src={require('../../../../assets/img/' + productData.posters[0])}
            className="poster"
            alt="product preview"
          />
        </div>
        <p className="price-paragraph">{`${productData.price}`}$</p>
        {viewType === 'list' && (
          <>
            <span>{`brand: ${productData.brand} amount: ${productData.amount}pcs`}</span>
          </>
        )}
      </div>
      <button type="button" className="add-to-cart-button" onClick={addProductToCart}>
        <img src={addToCartLogo} alt="an add to cart logo" />
      </button>
    </div>
  );
};
