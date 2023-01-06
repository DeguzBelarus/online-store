import React, { FC, useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { useLocation, useNavigate, NavigateFunction } from 'react-router-dom';

import {
  getCart,
  getActivePromoCodes,
  setActivePromoCodes,
  setProductsPerCartPage,
  getProductsPerCartPage,
  setCurrentCartPage,
  getCurrentCartPage,
} from 'app/shopSlice';
import {
  ICartProductData,
  IProductData,
  PromoCode,
  ChangeInputHandler,
  Nullable,
  ClickAndTouchDivHandlerParametric,
  ClickAndTouchButtonHandlerParametric,
} from 'types/types';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import { CartProductItem } from './components/CartProductItem/CartProductItem';
import { Order } from './components/Order/Order';
import './CartPage.scss';

interface Props {
  orderMode: boolean;
}

export const CartPage: FC<Props> = ({ orderMode }): JSX.Element => {
  const promoCodeInput = useRef<Nullable<HTMLInputElement>>(null);

  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const search: string = useLocation().search;
  const cartPageQuery: Nullable<string> = new URLSearchParams(search).get('page');
  const productsPerPageQuery: Nullable<string> = new URLSearchParams(search).get('limit');
  const cartProducts: Array<IProductData> = useAppSelector(getCart);
  const currentCartPage: number = useAppSelector(getCurrentCartPage);
  const productsPerCartPage: number = useAppSelector(getProductsPerCartPage);
  const activePromoCodes: Array<PromoCode> = useAppSelector(getActivePromoCodes);
  const [cartProductsModified, setCartProductsModified] = useState<Array<ICartProductData>>([]);
  const [cartProductsSlices, setCartProductsSlices] = useState<Array<Array<ICartProductData>>>([]);
  const [enteredPromoCode, setEnteredPromoCode] = useState<string>('');
  const [cartPages, setCartPages] = useState<Array<string>>([]);
  const validPromoCodes: Array<PromoCode> = [
    { promoCodeName: 'super', promoCodeDiscount: 25 },
    { promoCodeName: 'mega', promoCodeDiscount: 50 },
  ];

  const queryUpdate = (): void => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('page', String(currentCartPage));
    urlSearchParams.append('limit', String(productsPerCartPage));
    navigate(`?${urlSearchParams}`);
  };

  const validatePromoCode = (code: string): boolean => {
    if (activePromoCodes.some((promoCode: PromoCode) => promoCode.promoCodeName === code))
      return false;
    if (!validPromoCodes.some((promoCode: PromoCode) => promoCode.promoCodeName === code))
      return false;
    return true;
  };

  const enteredPromoCodeHandler: ChangeInputHandler = ({ target: { value } }): void => {
    setEnteredPromoCode(value);
  };

  const activatePromoCode = (): void => {
    if (validatePromoCode(enteredPromoCode)) {
      const validCode = validPromoCodes.find(
        (promoCode: PromoCode) => promoCode.promoCodeName === enteredPromoCode
      );

      if (validCode !== undefined) {
        dispatch(setActivePromoCodes([...activePromoCodes, validCode]));
        promoCodeInput.current && (promoCodeInput.current.value = '');
        setEnteredPromoCode('');
      }
    }
  };

  const removePromoCode: ClickAndTouchDivHandlerParametric<string> = (event, code): void => {
    if (!event.currentTarget.classList.contains('remove-code-button')) return;
    const foundCode = activePromoCodes.find(
      (promoCode: PromoCode) => promoCode.promoCodeName === code
    );

    if (foundCode !== undefined) {
      dispatch(
        setActivePromoCodes(
          activePromoCodes.filter(
            (promoCode: PromoCode) => promoCode.promoCodeName !== foundCode.promoCodeName
          )
        )
      );
    }
  };

  const orderModeHandler = (): void => {
    location.href.includes('order') ? navigate('/cart') : navigate('/cart/order');
  };

  const sortByNameMethod = (
    prevCartProduct: IProductData,
    nextCartProduct: IProductData
  ): number => {
    if (prevCartProduct.name < nextCartProduct.name) {
      return -1;
    }
    if (prevCartProduct.name > nextCartProduct.name) {
      return 1;
    }
    return 0;
  };

  const cartProductsModifiedUpdate = (): void => {
    setCartProductsModified(
      cartProducts
        .map((cartProduct: IProductData, index: number, array: Array<IProductData>) => {
          const productId: number = cartProduct.id;

          return {
            id: cartProduct.id,
            name: cartProduct.name,
            brand: cartProduct.brand,
            price: cartProduct.price,
            category: cartProduct.category,
            description: cartProduct.description,
            properties: cartProduct.properties,
            inStock: cartProduct.inStock,
            amount: cartProduct.amount,
            posters: cartProduct.posters,
            quantity: array.filter((cartProduct: IProductData) => cartProduct.id === productId)
              ?.length,
            sum: array.reduce((sum: number, cartProduct: IProductData) => {
              if (cartProduct.id === productId) {
                return (sum += cartProduct.price || sum);
              } else {
                return sum;
              }
            }, 0),
          };
        })
        .sort(sortByNameMethod)
        .reduce((unique: Array<ICartProductData>, cartProduct: ICartProductData) => {
          return unique.find(
            (uniqueProduct: ICartProductData) => uniqueProduct.id === cartProduct.id
          )
            ? unique
            : [...unique, cartProduct];
        }, [])
    );
  };

  const productsPerCartPageHandler: ClickAndTouchButtonHandlerParametric<number> = (
    event,
    value
  ): void => {
    if (productsPerCartPage === value) return;
    dispatch(setProductsPerCartPage(value));
  };

  const currentCartPageHandler: ClickAndTouchButtonHandlerParametric<string> = (
    event,
    value
  ): void => {
    if (String(currentCartPage) === value) return;
    dispatch(setCurrentCartPage(Number(value)));
  };

  useEffect((): void => {
    cartProductsModifiedUpdate();
  }, [cartProducts]);

  useEffect((): void => {
    if (cartProductsModified?.length) {
      let cartProductsSlices: Array<Array<ICartProductData>> = [];
      for (let i = 0; i < cartProductsModified?.length; i = productsPerCartPage + i) {
        let cartPageProducts: Array<ICartProductData> = [];
        for (let j = 0; j < productsPerCartPage; j++) {
          if (cartProductsModified[j + i]) {
            cartPageProducts = [...cartPageProducts, cartProductsModified[j + i]];
          }
        }
        cartProductsSlices = [...cartProductsSlices, cartPageProducts];
      }
      setCartProductsSlices(cartProductsSlices);
    }
  }, [cartProductsModified, productsPerCartPage]);

  useEffect((): void => {
    queryUpdate();
  }, [currentCartPage, productsPerCartPage, orderMode, activePromoCodes?.length]);

  useEffect((): void => {
    const cartPagesArray = new Array(Math.ceil(cartProductsModified?.length / productsPerCartPage))
      .fill('0')
      .map((page: string, index: number) => String(index + 1));
    setCartPages(cartPagesArray);
  }, [cartProductsModified?.length, productsPerCartPage]);

  useEffect((): void => {
    if (cartPageQuery && String(currentCartPage) !== cartPageQuery) {
      dispatch(setCurrentCartPage(Number(cartPageQuery)));
    }
    if (cartPages?.length && currentCartPage > cartPages?.length) {
      dispatch(setCurrentCartPage(cartPages?.length));
    }

    if (productsPerPageQuery && String(productsPerCartPage) !== productsPerPageQuery) {
      dispatch(setProductsPerCartPage(Number(productsPerPageQuery)));
    }
    if (cartPages?.length && (productsPerCartPage > 4 || productsPerCartPage < 2)) {
      dispatch(setProductsPerCartPage(2));
    }
    if (cartProductsModified?.length && cartProductsModified?.length < productsPerCartPage) {
      if (cartProductsModified?.length < 2) {
        dispatch(setProductsPerCartPage(2));
      } else {
        dispatch(setProductsPerCartPage(cartProductsModified?.length));
      }
    }
  }, [cartPages?.length, cartProductsModified?.length]);

  return (
    <>
      <Header />
      <main className="cart-page-wrapper">
        {orderMode && <Order orderModeHandler={orderModeHandler} />}
        <div
          className={
            cartProducts?.length
              ? productsPerCartPage === 2
                ? 'cart-items-wrapper'
                : productsPerCartPage === 3
                ? 'cart-items-wrapper three-per-page'
                : productsPerCartPage === 4
                ? 'cart-items-wrapper four-per-page'
                : 'cart-items-wrapper'
              : 'cart-items-wrapper empty-cart'
          }
        >
          {cartProducts?.length > 0 &&
          cartProductsSlices?.length > 0 &&
          cartProductsSlices[currentCartPage - 1]?.length ? (
            cartProductsSlices[currentCartPage - 1].map(
              (cartProduct: ICartProductData, index: number) => {
                return (
                  <CartProductItem
                    key={index}
                    quantity={cartProduct.quantity}
                    sum={cartProduct.sum}
                    id={cartProduct.id}
                    name={cartProduct.name}
                    brand={cartProduct.brand}
                    price={cartProduct.price}
                    category={cartProduct.category}
                    description={cartProduct.description}
                    properties={cartProduct.properties}
                    posters={cartProduct.posters}
                    inStock={cartProduct.inStock}
                    amount={cartProduct.amount}
                    index={index}
                  />
                );
              }
            )
          ) : (
            <p className="no-products-paragraph">There are no products in your cart :(</p>
          )}
          {cartProductsModified?.length ? (
            <div className="cart-lower-container">
              <div className="promo-codes-container">
                <span className="tip">*valid codes: super, mega</span>
                <div className="promo-code-input-wrapper">
                  <input
                    type="text"
                    className="promo-code-input"
                    placeholder="Enter your promo code..."
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      enteredPromoCodeHandler(event)
                    }
                    ref={promoCodeInput}
                  />
                  <button
                    type="button"
                    className="promo-code-accept-button"
                    disabled={!validatePromoCode(enteredPromoCode)}
                    onClick={activatePromoCode}
                  >
                    Accept
                  </button>
                </div>
                {activePromoCodes?.length ? (
                  <div className="promo-codes-wrapper">
                    {`${activePromoCodes.reduce(
                      (sum: number, promoCode: PromoCode) => sum + promoCode.promoCodeDiscount,
                      0
                    )}% discount, active codes:`}
                    <div className="active-codes-wrapper">
                      {activePromoCodes.map((promoCode: PromoCode) => {
                        return (
                          <div className="active-code" key={promoCode.promoCodeName}>
                            {`${promoCode.promoCodeName}(${promoCode.promoCodeDiscount}%)`}
                            <div
                              className="remove-code-button"
                              onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                removePromoCode(event, promoCode.promoCodeName)
                              }
                            >
                              remove
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="cart-pages-container">
                <div className="cart-pages-upper-container">
                  <span>Products per page:</span>
                  <button
                    type="button"
                    className={
                      productsPerCartPage === 2
                        ? 'products-per-page-selector active'
                        : 'products-per-page-selector'
                    }
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                      productsPerCartPageHandler(event, 2)
                    }
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className={
                      productsPerCartPage === 3
                        ? 'products-per-page-selector active'
                        : 'products-per-page-selector'
                    }
                    disabled={cartProductsModified?.length < 3}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                      productsPerCartPageHandler(event, 3)
                    }
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className={
                      productsPerCartPage === 4
                        ? 'products-per-page-selector active'
                        : 'products-per-page-selector'
                    }
                    disabled={cartProductsModified?.length < 4}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                      productsPerCartPageHandler(event, 4)
                    }
                  >
                    4
                  </button>
                </div>
                <div className="cart-pages-lower-container">
                  {cartPages?.length
                    ? cartPages.map((page: string) => {
                        return (
                          <button
                            type="button"
                            className={
                              String(currentCartPage) === page
                                ? 'cart-page-selector active'
                                : 'cart-page-selector'
                            }
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                              currentCartPageHandler(event, page)
                            }
                            key={page}
                          >
                            {page}
                          </button>
                        );
                      })
                    : null}
                </div>
              </div>
              <div className="cart-total-container">
                <p>Cart total:</p>
                <div className="cart-info-container">
                  <p>{`Quantity: ${cartProducts?.length} pcs`}</p>
                  <p
                    className={
                      activePromoCodes?.length
                        ? 'price-paragraph price-discounted'
                        : 'price-paragraph'
                    }
                  >{`Cost: ${cartProducts
                    .reduce((sum, product: IProductData) => sum + product.price, 0)
                    .toFixed(2)}$`}</p>
                  {activePromoCodes?.length ? (
                    <p className="price-with-discount">{`Your cost: ${(
                      cartProducts.reduce((sum, product: IProductData) => sum + product.price, 0) -
                      cartProducts.reduce((sum, product: IProductData) => sum + product.price, 0) *
                        activePromoCodes.reduce(
                          (sum: number, promoCode: PromoCode) =>
                            sum + promoCode.promoCodeDiscount / 100,
                          0
                        )
                    ).toFixed(2)}$`}</p>
                  ) : null}
                  <div className="proceed-order-button" onClick={orderModeHandler}>
                    Proceed
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
};
