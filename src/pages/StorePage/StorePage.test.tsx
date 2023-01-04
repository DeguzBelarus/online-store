import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

import { StorePage } from './StorePage';

describe('STORE PAGE COMPONENT TESTS', (): void => {
  test('renders the store page with products wrapper HTML div elements', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <StorePage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('store-page')).toBeInTheDocument();
    expect(screen.getByTestId('products-wrapper')).toBeInTheDocument();
  });
});
