import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

import { App } from '../../components/App';

const renderApplication = (): void => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('StorePage tests', (): void => {
  test('renders the store page with products wrapper HTML div elements', () => {
    renderApplication();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('products-wrapper')).toBeInTheDocument();
  });
});
