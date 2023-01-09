import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

import { App } from '../App';

const maxProductsInStore = 35;
const maxSamsungProductsInStore = 7;
const maxAppleProductsInStore = 4;
const maxBrandsInStore = 13;
const maxCategoriesInStore = 3;
const maxSmartphonesInStore = 21;

const renderApplication = (): void => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('Header tests', (): void => {
  test('renders the header HTML div element', () => {
    renderApplication();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('shows FiltersBar component by click', () => {
    renderApplication();
    expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.getByTestId('filters-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filters-bar')).not.toHaveClass('active');
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByTestId('filters-bar')).toHaveClass('active');
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByTestId('filters-bar')).not.toHaveClass('active');
  });

  test('correctly finds products by entering data', async () => {
    renderApplication();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxProductsInStore
    );
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'samsung' } });
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxSamsungProductsInStore
    );
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'apple' } });
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxAppleProductsInStore
    );
    fireEvent.input(screen.getByRole('textbox'), { target: { value: '' } });
  });

  test('correctly filters products by brand when brand selector is clicked', async () => {
    renderApplication();
    const allBrandSelectors = await waitFor(() => screen.getAllByTestId('brand-filter-selector'));
    expect(allBrandSelectors.length).toBe(maxBrandsInStore);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxProductsInStore
    );
    fireEvent.click(allBrandSelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxSamsungProductsInStore
    );
    fireEvent.click(allBrandSelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxProductsInStore
    );
  });

  test('correctly filters products by category when category selector is clicked', async () => {
    renderApplication();
    const allCategorySelectors = await waitFor(() =>
      screen.getAllByTestId('category-filter-selector')
    );
    expect(allCategorySelectors.length).toBe(maxCategoriesInStore);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxProductsInStore
    );
    fireEvent.click(allCategorySelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxSmartphonesInStore
    );
    fireEvent.click(allCategorySelectors[0]);
    expect((await waitFor(() => screen.getAllByTestId('product-card'))).length).toBe(
      maxProductsInStore
    );
  });
});
