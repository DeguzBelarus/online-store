import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { StorePage } from '../pages/StorePage/StorePage';
import { CartPage } from 'pages/CartPage/CartPage';
import { ProductDetailsPage } from 'pages/ProductDetailsPage/ProductDetailsPage';
import { Page404 } from '../pages/Page404/Page404';

export const useRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StorePage />}></Route>
      <Route
        path="/:brand?/:category?/:name?/:instock?/:minprice?/:maxprice?/:pricesort?/:namesort?/:view?"
        element={<StorePage />}
      ></Route>
      <Route path="/cart" element={<CartPage />}></Route>
      <Route path="/cart/:page?/:limit?" element={<CartPage />}></Route>
      <Route path="/product/:id" element={<ProductDetailsPage />}></Route>
      <Route path="*" element={<Page404 />}></Route>
    </Routes>
  );
};
