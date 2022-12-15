import React from 'react';
import { useRoutes } from './hooks/useRoutes';

function App(): JSX.Element {
  const routes: JSX.Element = useRoutes();
  return <>{routes}</>;
}

export default App;
