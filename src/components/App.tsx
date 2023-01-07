import React from 'react';

import { useRoutes } from '../hooks/useRoutes';

export const App = (): JSX.Element => {
  const routes: JSX.Element = useRoutes();
  return <>{routes}</>;
};
