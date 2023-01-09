import React, { FC, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';

import {
  setCart,
  getCart,
  getActivePromoCodes,
  getCurrentCartPage,
  getProductsPerCartPage,
} from 'app/shopSlice';
import {
  ClickAndTouchDivHandlerParametric,
  ICartProductData,
  IProductData,
  PromoCode,
} from 'types/types';
import './CartProductItem.scss';

interface Props extends ICartProductData {
  index: number;
}

export const CartProductItem: FC<Props> = ({ index, ...ICartProductData }): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  let cartProducts: Array<IProductData> = useAppSelector(getCart);
  const activePromoCodes: Array<PromoCode> = useAppSelector(getActivePromoCodes);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const currentCartPage: number = useAppSelector(getCurrentCartPage);
  const productsPerCartPage: number = useAppSelector(getProductsPerCartPage);
  const discountedPrice = (
    ICartProductData.price -
    ICartProductData.price *
      activePromoCodes.reduce(
        (sum: number, promoCode: PromoCode) => sum + promoCode.promoCodeDiscount / 100,
        0
      )
  ).toFixed(2);
  const productPositionInCart = (currentCartPage - 1) * productsPerCartPage + index + 1;
  const currentProductTotalCost =
    ICartProductData.sum -
    ICartProductData.sum *
      activePromoCodes.reduce(
        (sum: number, promoCode: PromoCode) => sum + promoCode.promoCodeDiscount / 100,
        0
      );

  const showNextPoster = (): void => {
    if (!ICartProductData.posters?.length || ICartProductData.posters?.length === 1) return;
    setCurrentPosterIndex(
      currentPosterIndex + 1 === ICartProductData.posters?.length ? 0 : currentPosterIndex + 1
    );
  };

  const showPreviousPoster = (): void => {
    if (!ICartProductData.posters?.length || ICartProductData.posters?.length === 1) return;
    setCurrentPosterIndex(
      !currentPosterIndex ? ICartProductData.posters?.length - 1 : currentPosterIndex - 1
    );
  };

  const addProductInCart: ClickAndTouchDivHandlerParametric<number> = (event, id): void => {
    if (ICartProductData.quantity === ICartProductData.amount) return;
    const addedProduct: IProductData | undefined = cartProducts.find(
      (cartProduct: IProductData) => cartProduct.id === id
    );
    if (addedProduct) {
      cartProducts = [...cartProducts, addedProduct];
    }
    dispatch(setCart(cartProducts));
  };

  const removeProductInCart: ClickAndTouchDivHandlerParametric<number> = (event, id): void => {
    const removedProductIndex = cartProducts.findIndex(
      (cartProduct: IProductData) => cartProduct.id === id
    );
    removedProductIndex >= 0 &&
      (cartProducts = cartProducts.filter(
        (cartProduct: IProductData, index: number) => index !== removedProductIndex
      ));
    dispatch(setCart(cartProducts));
  };

  return (
    <div
      className={
        productsPerCartPage === 2
          ? 'cart-product-item-wrapper'
          : productsPerCartPage === 3
          ? 'cart-product-item-wrapper three-per-page'
          : productsPerCartPage === 4
          ? 'cart-product-item-wrapper four-per-page'
          : 'cart-product-item-wrapper'
      }
    >
      <div className="cart-item-position-container">{productPositionInCart}</div>
      <div className="cart-product-main-container">
        <p className="product-name-paragraph">{ICartProductData.name}</p>
        <p className="product-brand-paragraph">{ICartProductData.brand}</p>
        <p className="product-category-paragraph">{ICartProductData.category}</p>
        <p
          className={
            activePromoCodes?.length
              ? 'product-price-paragraph price-discounted'
              : 'product-price-paragraph'
          }
        >
          {'Price: '}
          <span>{ICartProductData.price.toFixed(2) + '$'}</span>
        </p>
        {activePromoCodes?.length ? (
          <p className="price-with-discount"> {`Your price: ${discountedPrice + '$'}`}</p>
        ) : null}
        <p className="product-amount-paragraph">
          {'In stock: '}
          <span>{`${ICartProductData.amount} >> ${
            ICartProductData.amount - ICartProductData.quantity || '0!'
          } pcs`}</span>
        </p>
        {ICartProductData.properties?.length ? (
          <div className="properties-wrapper">
            <h4>Properties:</h4>
            {ICartProductData.properties.map((property: string, index: number) => {
              return (
                <div className="property-item" key={index}>
                  {property}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="cart-product-secondary-container">
        <div className="select-amount-container">
          <div
            className={
              ICartProductData.quantity === ICartProductData.amount
                ? 'increase-button increase-blocked'
                : 'increase-button'
            }
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              addProductInCart(event, ICartProductData.id)
            }
          >
            +
          </div>
          <div className="current-amount-cost-container">{`${ICartProductData.quantity}/${currentProductTotalCost}$`}</div>
          <div
            className={
              ICartProductData.quantity === 1 ? 'decrease-button remove-mode' : 'decrease-button'
            }
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              removeProductInCart(event, ICartProductData.id)
            }
          >
            -
          </div>
        </div>
        <div className="select-poster-container">
          <img
            draggable={false}
            className="cart-product-poster"
            src={require('../../../../assets/img/' + ICartProductData.posters[currentPosterIndex])}
            alt="a product preview"
          />
          <div className="switch-poster-buttons-container">
            <div className="switch-poster-button" onClick={showPreviousPoster}>
              prev
            </div>
            <div className="switch-poster-button" onClick={showNextPoster}>
              next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
