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
import { ICartProductData, IProductData, PromoCode } from 'types/types';
import './CartProductItem.scss';

interface Props {
  index: number;
}

export const CartProductItem: FC<ICartProductData & Props> = ({
  index,
  ...ICartProductData
}): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  let cartProducts: Array<IProductData> = useAppSelector(getCart);
  const activePromoCodes: Array<PromoCode> = useAppSelector(getActivePromoCodes);
  const [currentPosterIndex, setCurrentPosterIndex] = useState<number>(0);
  const currentCartPage: number = useAppSelector(getCurrentCartPage);
  const productsPerCartPage: number = useAppSelector(getProductsPerCartPage);

  const showNextPoster = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ): void => {
    if (ICartProductData.posters.length < 2) return;
    if (currentPosterIndex + 1 === ICartProductData.posters.length) {
      setCurrentPosterIndex(0);
    } else {
      setCurrentPosterIndex(currentPosterIndex + 1);
    }
  };

  const showPreviousPoster = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ): void => {
    if (ICartProductData.posters.length < 2) return;
    if (currentPosterIndex === 0) {
      setCurrentPosterIndex(ICartProductData.posters.length - 1);
    } else {
      setCurrentPosterIndex(currentPosterIndex - 1);
    }
  };

  const addProductInCart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    id: number
  ): void => {
    if (ICartProductData.quantity === ICartProductData.amount) return;
    const addedProduct: IProductData | undefined = cartProducts.find(
      (cartProduct: IProductData) => cartProduct.id === id
    );
    addedProduct !== undefined && (cartProducts = [...cartProducts, addedProduct]);
    dispatch(setCart(cartProducts));
  };

  const removeProductInCart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    id: number
  ): void => {
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
      <div className="cart-item-position-container">
        {(currentCartPage - 1) * productsPerCartPage + index + 1}
      </div>
      <div className="cart-product-main-container">
        <p className="product-name-paragraph">{ICartProductData.name}</p>
        <p className="product-brand-paragraph">{ICartProductData.brand}</p>
        <p className="product-category-paragraph">{ICartProductData.category}</p>
        <p
          className={
            activePromoCodes.length > 0
              ? 'product-price-paragraph price-discounted'
              : 'product-price-paragraph'
          }
        >
          {'Price: '}
          <span>{ICartProductData.price + '$'}</span>
        </p>
        {activePromoCodes.length > 0 && (
          <p className="price-with-discount">
            {' '}
            {`Your price: ${
              ICartProductData.price -
              ICartProductData.price *
                activePromoCodes.reduce(
                  (sum: number, promoCode: PromoCode) => sum + promoCode[1] / 100,
                  0
                ) +
              '$'
            }`}
          </p>
        )}
        <p className="product-amount-paragraph">
          {'In stock: '}
          <span>{`${ICartProductData.amount} >> ${
            ICartProductData.amount - ICartProductData.quantity || '0!'
          } pcs`}</span>
        </p>
        {ICartProductData.properties.length > 0 && (
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
        )}
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
          <div className="current-amount-cost-container">{`${ICartProductData.quantity}/${
            ICartProductData.sum -
            ICartProductData.sum *
              activePromoCodes.reduce(
                (sum: number, promoCode: PromoCode) => sum + promoCode[1] / 100,
                0
              )
          }$`}</div>
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
            <div
              className="switch-poster-button"
              onClick={(event: React.MouseEvent<HTMLDivElement>) => showPreviousPoster(event)}
            >
              prev
            </div>
            <div
              className="switch-poster-button"
              onClick={(event: React.MouseEvent<HTMLDivElement>) => showNextPoster(event)}
            >
              next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
