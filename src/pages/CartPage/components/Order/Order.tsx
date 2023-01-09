import React, { FC, useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { useNavigate, NavigateFunction } from 'react-router-dom';

import { getActivePromoCodes, getCart, setCart, setActivePromoCodes } from 'app/shopSlice';
import {
  ClickAndTouchDivHandler,
  IOrderData,
  PromoCode,
  ChangeInputHandler,
  IProductData,
  ICartProductData,
  FormHandler,
  Nullable,
  FormHandlerBoolean,
} from 'types/types';
import './Order.scss';

interface Props {
  orderModeHandler: ClickAndTouchDivHandler;
}

export const Order: FC<Props> = ({ orderModeHandler }): JSX.Element => {
  const firstAndLastNamesInput = useRef<Nullable<HTMLInputElement>>(null);
  const phoneInput = useRef<Nullable<HTMLInputElement>>(null);
  const addressInput = useRef<Nullable<HTMLInputElement>>(null);
  const emailInput = useRef<Nullable<HTMLInputElement>>(null);
  const creditCardNumberInput = useRef<Nullable<HTMLInputElement>>(null);
  const creditCardExpirationInput = useRef<Nullable<HTMLInputElement>>(null);
  const creditCardCVVInput = useRef<Nullable<HTMLInputElement>>(null);

  const dispatch: Dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false);
  const activePromoCodes: Array<PromoCode> = useAppSelector(getActivePromoCodes);
  const [firstAndLastNamesError, setFirstAndLastNamesError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [creditCardError, setCreditCardError] = useState<string>('');
  const cartProducts: Array<IProductData> = useAppSelector(getCart);
  const [cartProductsModified, setCartProductsModified] = useState<Array<ICartProductData>>([]);
  const [orderFormData, setOrderFormData] = useState<IOrderData>({
    address: '',
    firstAndLastNames: '',
    email: '',
    phoneNumber: '',
    codes: activePromoCodes,
    total:
      cartProducts.reduce(
        (total: number, cartProduct: IProductData) => total + cartProduct.price,
        0
      ) -
      cartProducts.reduce(
        (total: number, cartProduct: IProductData) => total + cartProduct.price,
        0
      ) *
        (activePromoCodes.reduce(
          (discount: number, promoCode: PromoCode) => discount + promoCode.promoCodeDiscount,
          0
        ) /
          100),
    products: cartProductsModified,
  });
  const [enteredCreditCardNumber, setEnteredCreditCardNumber] = useState<string>('');
  const [enteredCreditCardExpiration, setEnteredCreditCardExpiration] = useState<string>('');
  const [enteredCreditCardCVV, setEnteredCreditCardCVV] = useState<string>('');

  const creditCardEnteredDataValidator = (): void => {
    let isCardNumberValid = true;
    let isCardExpirationValid = true;
    let isCardCVVValid = true;

    if (creditCardExpirationInput.current?.classList.contains('invalid')) {
      creditCardExpirationInput.current?.classList.remove('invalid');
    }

    if (
      creditCardNumberInput.current &&
      creditCardNumberInput.current.value !== '' &&
      !creditCardNumberInput.current.validity.valid
    ) {
      isCardNumberValid = false;
    }

    if (
      creditCardExpirationInput.current &&
      creditCardExpirationInput.current.value !== '' &&
      !creditCardExpirationInput.current.validity.valid
    ) {
      isCardExpirationValid = false;
    } else if (creditCardExpirationInput.current?.value !== '') {
      if (Number(creditCardExpirationInput.current?.value.split('/')[0] || 13) > 12) {
        isCardExpirationValid = false;
        creditCardExpirationInput.current?.classList.add('invalid');
      }
      if (Number(creditCardExpirationInput.current?.value.split('/')[1] || 0) < 1) {
        isCardExpirationValid = false;
        creditCardExpirationInput.current?.classList.add('invalid');
      }
    }

    if (
      creditCardCVVInput.current &&
      creditCardCVVInput.current.value !== '' &&
      !creditCardCVVInput.current.validity.valid
    ) {
      isCardCVVValid = false;
    }

    if (!isCardNumberValid || !isCardExpirationValid || !isCardCVVValid) {
      if (!isCardNumberValid) {
        setCreditCardError('Please enter valid credit card data: card number');
      }
      if (!isCardExpirationValid) {
        if (isCardNumberValid) {
          setCreditCardError('Please enter valid credit card data: expiration');
        } else {
          setCreditCardError('Please enter valid credit card data: card number, expiration');
        }
      }
      if (!isCardCVVValid) {
        if (isCardNumberValid && isCardExpirationValid) {
          setCreditCardError('Please enter valid credit card data: CVV');
        } else if (!isCardNumberValid && isCardExpirationValid) {
          setCreditCardError('Please enter valid credit card data: card number, CVV');
        } else if (isCardNumberValid && !isCardExpirationValid) {
          setCreditCardError('Please enter valid credit card data: expiration, CVV');
        } else {
          setCreditCardError('Please enter valid credit card data: card number, expiration, CVV');
        }
      }
    } else {
      setCreditCardError('');
    }
  };

  const orderConfirmValidator: FormHandlerBoolean = (event): boolean => {
    event.preventDefault();

    setFirstAndLastNamesError('');
    setPhoneError('');
    setAddressError('');
    setEmailError('');

    if (creditCardError.includes('valid')) return false;
    setCreditCardError('');

    if (
      firstAndLastNamesInput.current?.value === '' ||
      phoneInput.current?.value === '' ||
      addressInput.current?.value === '' ||
      emailInput.current?.value === '' ||
      !firstAndLastNamesInput.current?.validity.valid ||
      !phoneInput.current?.validity.valid ||
      !addressInput.current?.validity.valid ||
      !emailInput.current?.validity.valid ||
      creditCardNumberInput.current?.value === '' ||
      creditCardExpirationInput.current?.value === '' ||
      creditCardCVVInput.current?.value === ''
    ) {
      if (
        firstAndLastNamesInput.current?.value === '' ||
        phoneInput.current?.value === '' ||
        addressInput.current?.value === '' ||
        emailInput.current?.value === ''
      ) {
        if (firstAndLastNamesInput.current?.value === '') {
          setFirstAndLastNamesError('Please enter your first and last name');
        }
        if (phoneInput.current?.value === '') {
          setPhoneError('Please enter your phone number');
        }
        if (addressInput.current?.value === '') {
          setAddressError('Please enter your address');
        }
        if (emailInput.current?.value === '') {
          setEmailError('Please enter your email address');
        }
      }

      if (
        !firstAndLastNamesInput.current?.validity.valid ||
        !phoneInput.current?.validity.valid ||
        !addressInput.current?.validity.valid ||
        !emailInput.current?.validity.valid
      ) {
        if (
          firstAndLastNamesInput.current?.value !== '' &&
          !firstAndLastNamesInput.current?.validity.valid
        ) {
          setFirstAndLastNamesError('At least 2 word of 3 chars length');
        }
        if (phoneInput.current?.value !== '' && !phoneInput.current?.validity.valid) {
          setPhoneError('Enter a correct phone number (with +)');
        }
        if (addressInput.current?.value !== '' && !addressInput.current?.validity.valid) {
          setAddressError('At least 3 word of 5 chars length');
        }
        if (emailInput.current?.value !== '' && !emailInput.current?.validity.valid) {
          setEmailError('Enter a correct email address');
        }
      }

      if (
        creditCardNumberInput.current?.value === '' ||
        creditCardExpirationInput.current?.value === '' ||
        creditCardCVVInput.current?.value === ''
      ) {
        if (creditCardNumberInput.current?.value === '') {
          setCreditCardError('Please enter credit card data: card number');
        }
        if (creditCardExpirationInput.current?.value === '') {
          if (creditCardNumberInput.current?.value === '') {
            setCreditCardError('Please enter credit card data: card number, expiration');
          } else {
            setCreditCardError('Please enter credit card data: expiration');
          }
        }
        if (creditCardCVVInput.current?.value === '') {
          if (
            creditCardNumberInput.current?.value !== '' &&
            creditCardExpirationInput.current?.value !== ''
          ) {
            setCreditCardError('Please enter credit card data: CVV');
          } else if (
            creditCardNumberInput.current?.value === '' &&
            creditCardExpirationInput.current?.value !== ''
          ) {
            setCreditCardError('Please enter credit card data: card number, CVV');
          } else if (
            creditCardNumberInput.current?.value !== '' &&
            creditCardExpirationInput.current?.value === ''
          ) {
            setCreditCardError('Please enter credit card data: expiration, CVV');
          } else {
            setCreditCardError('Please enter credit card data: card number, expiration, CVV');
          }
        }
      }
      return false;
    }
    return true;
  };

  const confirmOrder: FormHandler = (event) => {
    if (orderConfirmValidator(event)) {
      setIsOrderCompleted(true);
    }
  };

  const orderFormDataUpdate: ChangeInputHandler = ({ target: { value, name } }) => {
    setOrderFormData({ ...orderFormData, [name]: value });
  };

  const enteredCreditCardNumberHandler: ChangeInputHandler = ({ target: { value } }) => {
    setEnteredCreditCardNumber(value);
  };

  const enteredCreditCardExpirationHandler: ChangeInputHandler = ({ target: { value } }) => {
    setEnteredCreditCardExpiration(value);
  };

  const enteredCreditCardCVVHandler: ChangeInputHandler = ({ target: { value } }) => {
    setEnteredCreditCardCVV(value);
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

  useEffect((): void => {
    cartProductsModifiedUpdate();
  }, [cartProducts]);

  useEffect((): void => {
    setOrderFormData({ ...orderFormData, codes: activePromoCodes });
  }, [activePromoCodes?.length]);

  useEffect((): void => {
    setOrderFormData({
      ...orderFormData,
      total:
        cartProducts.reduce(
          (total: number, cartProduct: IProductData) => total + cartProduct.price,
          0
        ) -
        cartProducts.reduce(
          (total: number, cartProduct: IProductData) => total + cartProduct.price,
          0
        ) *
          (activePromoCodes.reduce(
            (discount: number, promoCode: PromoCode) => discount + promoCode.promoCodeDiscount,
            0
          ) /
            100),
    });
  }, [cartProducts?.length]);

  useEffect((): void => {
    if (
      Number.isNaN(
        Number(
          enteredCreditCardNumber
            .split('')
            .filter((element: string) => element !== ' ')
            .join('')
        )
      )
    ) {
      setEnteredCreditCardNumber(
        enteredCreditCardNumber.slice(0, enteredCreditCardNumber?.length - 1)
      );
    }
    if (enteredCreditCardNumber?.length === 5 && enteredCreditCardNumber[4] !== ' ') {
      const formattedCreditCardNumber: Array<string> = enteredCreditCardNumber.split('');
      formattedCreditCardNumber.splice(4, 0, ' ');
      setEnteredCreditCardNumber(formattedCreditCardNumber.join(''));
    }
    if (enteredCreditCardNumber?.length === 10 && enteredCreditCardNumber[9] !== ' ') {
      const formattedCreditCardNumber: Array<string> = enteredCreditCardNumber.split('');
      formattedCreditCardNumber.splice(9, 0, ' ');
      setEnteredCreditCardNumber(formattedCreditCardNumber.join(''));
    }
    if (enteredCreditCardNumber?.length === 15 && enteredCreditCardNumber[14] !== ' ') {
      const formattedCreditCardNumber: Array<string> = enteredCreditCardNumber.split('');
      formattedCreditCardNumber.splice(14, 0, ' ');
      setEnteredCreditCardNumber(formattedCreditCardNumber.join(''));
    }
  }, [enteredCreditCardNumber]);

  useEffect((): void => {
    if (
      Number.isNaN(
        Number(
          enteredCreditCardExpiration
            .split('')
            .filter((element: string) => element !== '/')
            .join('')
        )
      )
    ) {
      setEnteredCreditCardExpiration(
        enteredCreditCardExpiration.slice(0, enteredCreditCardExpiration?.length - 1)
      );
    }
    if (enteredCreditCardExpiration?.length === 3 && enteredCreditCardExpiration[2] !== '/') {
      const formattedCreditCardExpiration: Array<string> = enteredCreditCardExpiration.split('');
      formattedCreditCardExpiration.splice(2, 0, '/');
      setEnteredCreditCardExpiration(formattedCreditCardExpiration.join(''));
    }
  }, [enteredCreditCardExpiration]);

  useEffect((): void => {
    if (Number.isNaN(Number(enteredCreditCardCVV.split('').join('')))) {
      setEnteredCreditCardCVV(enteredCreditCardCVV.slice(0, enteredCreditCardCVV?.length - 1));
    }
  }, [enteredCreditCardCVV]);

  useEffect((): void => {
    if (isOrderCompleted) {
      console.log('Thank you for your order, your order details: ', orderFormData);
      dispatch(setActivePromoCodes([]));
      dispatch(setCart([]));
      setTimeout(() => {
        navigate('/');
      }, 5000);
    }
  }, [isOrderCompleted]);

  useEffect((): void => {
    setOrderFormData({ ...orderFormData, products: cartProductsModified });
  }, [cartProductsModified]);

  return (
    <div className="order-wrapper">
      {!isOrderCompleted ? (
        <form className="order-form" onSubmit={confirmOrder} onInvalid={orderConfirmValidator}>
          <h3>Order description:</h3>
          <label
            className={
              firstAndLastNamesInput.current?.value !== ''
                ? firstAndLastNamesInput.current?.validity.valid === true
                  ? 'input-label valid-input'
                  : 'input-label invalid-input'
                : 'input-label'
            }
            htmlFor="name-input"
          >
            <span>Your first and last name:</span>
            {firstAndLastNamesError && <span className="error-span">{firstAndLastNamesError}</span>}
            <input
              type="text"
              id="name-input"
              name="firstAndLastNames"
              minLength={7}
              pattern="[A-Za-zА-Яа-яЁё0-9]{3,}\s[A-Za-zА-Яа-яЁё0-9]{3,}"
              placeholder="Name LastName"
              title="Please enter your first and last name"
              required
              autoComplete="false"
              value={orderFormData.firstAndLastNames}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => orderFormDataUpdate(event)}
              ref={firstAndLastNamesInput}
            />
          </label>
          <label
            className={
              phoneInput.current?.value !== ''
                ? phoneInput.current?.validity.valid === true
                  ? 'input-label valid-input'
                  : 'input-label invalid-input'
                : 'input-label'
            }
            htmlFor="phone-input"
          >
            <span>Your phone number:</span>
            {phoneError && <span className="error-span">{phoneError}</span>}
            <input
              type="tel"
              id="phone-input"
              name="phoneNumber"
              pattern="\+[0-9]{9,}"
              maxLength={19}
              required
              placeholder="+PhoneNumber"
              title="Please enter your phone number"
              value={orderFormData.phoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => orderFormDataUpdate(event)}
              ref={phoneInput}
            />
          </label>
          <label
            className={
              addressInput.current?.value !== ''
                ? addressInput.current?.validity.valid === true
                  ? 'input-label valid-input'
                  : 'input-label invalid-input'
                : 'input-label'
            }
            htmlFor="address-input"
          >
            <span>Your address:</span>
            {addressError && <span className="error-span">{addressError}</span>}
            <input
              type="text"
              id="address-input"
              name="address"
              pattern="[A-Za-zА-Яа-яЁё0-9]{5,}\s[A-Za-zА-Яа-яЁё0-9]{5,}\s[A-Za-zА-Яа-яЁё0-9]{5,}"
              required
              placeholder="Country, city, address"
              title="Please enter your address"
              value={orderFormData.address}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => orderFormDataUpdate(event)}
              ref={addressInput}
            />
          </label>
          <label
            className={
              emailInput.current?.value !== ''
                ? emailInput.current?.validity.valid === true
                  ? 'input-label valid-input'
                  : 'input-label invalid-input'
                : 'input-label'
            }
            htmlFor="email-input"
          >
            <span>Your email:</span>
            {emailError && <span className="error-span">{emailError}</span>}
            <input
              type="email"
              id="email-input"
              name="email"
              pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,4}"
              placeholder="mail@mail.com"
              title="Please enter your email address"
              autoComplete="off"
              minLength={8}
              maxLength={255}
              required
              value={orderFormData.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => orderFormDataUpdate(event)}
              ref={emailInput}
            />
          </label>
          <div className="credit-card-wrapper">
            {activePromoCodes?.length ? (
              <div className="active-promo-codes">
                {activePromoCodes.map((promoCode: PromoCode, index: number) => {
                  return <span key={index}>{promoCode.promoCodeName}</span>;
                })}
              </div>
            ) : null}
            <span className="transaction-total-span">{orderFormData.total.toFixed(2) + '$'}</span>
            <input
              type="text"
              className="card-number-input"
              title="Enter your card number"
              placeholder="XXXX XXXX XXXX XXXX"
              minLength={19}
              maxLength={19}
              pattern="[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}"
              required
              value={enteredCreditCardNumber}
              ref={creditCardNumberInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                enteredCreditCardNumberHandler(event)
              }
              onBlur={creditCardEnteredDataValidator}
            />
            <div
              className={
                enteredCreditCardNumber.startsWith('4')
                  ? 'card-type-container card-visa'
                  : enteredCreditCardNumber.startsWith('5')
                  ? 'card-type-container card-mastercard'
                  : enteredCreditCardNumber.startsWith('6')
                  ? 'card-type-container card-maestro'
                  : 'card-type-container'
              }
            ></div>
            <input
              type="text"
              className="card-expiration-input"
              title="Enter credit card expiration date"
              placeholder="mm/yy"
              pattern="[0-1]{1}[0-9]{1}/+?[0-9]{2}"
              minLength={5}
              maxLength={5}
              required
              value={enteredCreditCardExpiration}
              ref={creditCardExpirationInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                enteredCreditCardExpirationHandler(event)
              }
              onBlur={creditCardEnteredDataValidator}
            />
            <input
              type="text"
              className="card-cvv-input"
              title="Enter credit card cvv"
              placeholder="CVV"
              pattern="[0-9]{3}"
              minLength={3}
              maxLength={3}
              required
              value={enteredCreditCardCVV}
              ref={creditCardCVVInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                enteredCreditCardCVVHandler(event)
              }
              onBlur={creditCardEnteredDataValidator}
            />
            <div className="error-message-container">{creditCardError}</div>
          </div>
          <button type="submit" className="order-submit-button">
            SUBMIT
          </button>
          <div className="order-return-button" onClick={orderModeHandler}>
            Back
          </div>
        </form>
      ) : (
        <h3 className="order-completed-heading">
          Your order confirmed. You will be redirected to the main page in 5 seconds...
        </h3>
      )}
    </div>
  );
};
