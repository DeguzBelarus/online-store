import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { StorePage } from '../pages/StorePage/StorePage';
import { Page404 } from '../pages/Page404/Page404';

export const useRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StorePage />}></Route>
      <Route path="/?*" element={<StorePage />}></Route>
      <Route path="*" element={<Page404 />}></Route>
    </Routes>
  );
};
