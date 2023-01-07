import React, { FC } from 'react';

import { IProductData, Nullable } from 'types/types';
import './FiltersBar.scss';

interface Props {
  isFiltersShown: boolean;
  filteredProducts: Array<IProductData>;
  brandsArray: Array<string>;
  brandFilter: Nullable<string>;
  categoriesArray: Array<string>;
  categoryFilter: Nullable<string>;
  inStockFilter: boolean;
  brandFilterHandler: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    value: string
  ) => void;
  categoryFilterHandler: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    value: string
  ) => void;
  isPricesRangesShownHandler: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  inStockFilterHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minPriceFilterHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxPriceFilterHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetSearchFilters: (
    event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => void;
  isPriceRangesShown: boolean;
  filteredProductsMinPrice: Nullable<number>;
  filteredProductsMaxPrice: Nullable<number>;
  minPriceFilter: Nullable<number>;
  maxPriceFilter: Nullable<number>;
  minPriceRange: React.RefObject<HTMLInputElement>;
  maxPriceRange: React.RefObject<HTMLInputElement>;
  filtersIsActive: () => boolean;
}

export const FiltersBar: FC<Props> = ({
  isFiltersShown,
  brandsArray,
  brandFilter,
  categoriesArray,
  categoryFilter,
  inStockFilter,
  brandFilterHandler,
  categoryFilterHandler,
  isPricesRangesShownHandler,
  resetSearchFilters,
  isPriceRangesShown,
  inStockFilterHandler,
  minPriceFilterHandler,
  maxPriceFilterHandler,
  filteredProductsMinPrice,
  filteredProductsMaxPrice,
  minPriceFilter,
  maxPriceFilter,
  minPriceRange,
  maxPriceRange,
  filtersIsActive,
}): JSX.Element => {
  return (
    <div
      className={isFiltersShown ? 'filters-bar-wrapper active' : 'filters-bar-wrapper'}
      data-testid="filters-bar"
    >
      <h3>Filters:</h3>
      <div className="brands-wrapper">
        <h4>Brands: </h4>
        {brandsArray.map((brand: string, index: number) => {
          return (
            <div
              className={brandFilter === brand ? 'brand-item active' : 'brand-item'}
              key={index}
              onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                brandFilterHandler(event, brand)
              }
              data-testid="brand-filter-selector"
            >
              <span className="brand-selector-span">{brand}</span>
            </div>
          );
        })}
      </div>
      <div className="categories-wrapper">
        <h4>Categories: </h4>
        {categoriesArray.map((category: string, index: number) => {
          return (
            <div
              className={categoryFilter === category ? 'category-item active' : 'category-item'}
              key={index}
              onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                categoryFilterHandler(event, category)
              }
              data-testid="category-filter-selector"
            >
              <span className="category-selector-span">{category}</span>
            </div>
          );
        })}
      </div>
      <div className="price-range-wrapper" onClick={isPricesRangesShownHandler}>
        <span
          className={
            minPriceFilter || maxPriceFilter ? 'prices-range-span active' : 'prices-range-span'
          }
        >
          price ranges
        </span>
        {isPriceRangesShown && isFiltersShown && (
          <div className="ranges-wrapper">
            <div className="range-wrapper">
              <span className="price-range-span">min: </span>
              <input
                type="range"
                className="price-range-input"
                title="choose the minimal prise"
                min={filteredProductsMinPrice || 0}
                max={Number(maxPriceRange.current?.value) || 5000}
                value={minPriceFilter || 0}
                step={5}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  minPriceFilterHandler(event)
                }
                ref={minPriceRange}
              />
              <input
                type="text"
                className="price-text-input"
                title="current minimal price"
                value={(minPriceFilter || filteredProductsMinPrice || 0) + '$'}
                readOnly={true}
              />
            </div>
            <div className="range-wrapper">
              <span className="price-range-span">max: </span>
              <input
                type="range"
                className="price-range-input"
                title="choose the maximal prise"
                min={Number(minPriceRange.current?.value) || 0}
                max={filteredProductsMaxPrice || 5000}
                value={maxPriceFilter || 5000}
                step={5}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  maxPriceFilterHandler(event)
                }
                ref={maxPriceRange}
              />
              <input
                type="text"
                className="price-text-input"
                title="current maximal price"
                value={(maxPriceFilter || filteredProductsMaxPrice || 5000) + '$'}
                readOnly={true}
              />
            </div>
          </div>
        )}
      </div>
      <div className="in-stock-wrapper">
        <span className={inStockFilter ? 'in-stock-span active' : 'in-stock-span'}>In stock: </span>
        <input
          type="checkbox"
          className="in-stock-checkbox"
          title="in stock only"
          checked={inStockFilter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => inStockFilterHandler(event)}
        />
      </div>
      <button
        type="button"
        className="reset-filters-button"
        onClick={resetSearchFilters}
        disabled={!filtersIsActive()}
      >
        Reset filters
      </button>
    </div>
  );
};
