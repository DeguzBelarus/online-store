import React, { FC } from 'react';

import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import './CartPage.scss';

export const CartPage: FC = (): JSX.Element => {
  return (
    <>
      <Header />
      <div className="cart-page-wrapper">CartPage</div>
      <Footer />
    </>
  );
};
