import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

import App from '../App';
import { Header } from './Header';

describe('HEADER COMPONENT TESTS', (): void => {
  test('renders the header HTML div element', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('shows FiltersBar component by click', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('filters-show-button')).toBeInTheDocument();
    expect(screen.getByTestId('filters-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filters-bar')).not.toHaveClass('active');
    fireEvent.click(screen.getByTestId('filters-show-button'));
    expect(screen.getByTestId('filters-bar')).toHaveClass('active');
    fireEvent.click(screen.getByTestId('filters-show-button'));
    expect(screen.getByTestId('filters-bar')).not.toHaveClass('active');
  });

  test('correctly finds products by entering data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('product-search-input')).toBeInTheDocument();
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(35);
    fireEvent.input(screen.getByTestId('product-search-input'), { target: { value: 'samsung' } });
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(7);
    fireEvent.input(screen.getByTestId('product-search-input'), { target: { value: 'apple' } });
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(4);
    fireEvent.input(screen.getByTestId('product-search-input'), { target: { value: '' } });
  });

  test('correctly filters products by brand when brand selector is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    const allBrandSelectors = await waitFor(() => screen.getAllByTestId('brand-filter-selector'));
    expect(allBrandSelectors.length).toBe(13);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(35);
    fireEvent.click(allBrandSelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(7);
    fireEvent.click(allBrandSelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(35);
  });

  test('correctly filters products by category when category selector is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    const allCategorySelectors = await waitFor(() =>
      screen.getAllByTestId('category-filter-selector')
    );
    expect(allCategorySelectors.length).toBe(3);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(35);
    fireEvent.click(allCategorySelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(21);
    fireEvent.click(allCategorySelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(35);
  });
});
