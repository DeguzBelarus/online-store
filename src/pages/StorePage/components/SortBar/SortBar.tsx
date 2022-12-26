import React, { FC } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Dispatch } from '@reduxjs/toolkit';

import {
  getViewType,
  getSortByName,
  getSortByPrice,
  setViewType,
  setSortByName,
  setSortByPrice,
} from 'app/shopSlice';
import './SortBar.scss';

export const SortBar: FC = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  const viewType: 'cards' | 'list' = useAppSelector(getViewType);
  const sortByName: string | null = useAppSelector(getSortByName);
  const sortByPrice: string | null = useAppSelector(getSortByPrice);

  const viewTypeHandler = (value: 'cards' | 'list'): void => {
    if (viewType !== value) {
      dispatch(setViewType(value));
    }
  };

  const sortByNameHandler = (value: 'ascending' | 'descending' | null): void => {
    if (sortByName !== value) {
      dispatch(setSortByName(value));
    } else {
      dispatch(setSortByName(null));
    }
    if (sortByPrice) {
      dispatch(setSortByPrice(null));
    }
  };

  const sortByPriceHandler = (value: 'ascending' | 'descending' | null): void => {
    if (sortByPrice !== value) {
      dispatch(setSortByPrice(value));
    } else {
      dispatch(setSortByPrice(null));
    }
    if (sortByName) {
      dispatch(setSortByName(null));
    }
  };

  return (
    <aside>
      <div className="sort-types-wrapper">
        <h3>Sort Type:</h3>
        <div className="sort-type-wrapper">
          <h4>By Name</h4>
          <p
            className={
              sortByName && sortByName === 'ascending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={() => sortByNameHandler('ascending')}
          >
            ascending
          </p>
          <p
            className={
              sortByName && sortByName === 'descending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={() => sortByNameHandler('descending')}
          >
            descending
          </p>
        </div>
        <div className="sort-type-wrapper">
          <h4>By Price</h4>
          <p
            className={
              sortByPrice && sortByPrice === 'ascending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={() => sortByPriceHandler('ascending')}
          >
            ascending
          </p>
          <p
            className={
              sortByPrice && sortByPrice === 'descending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={() => sortByPriceHandler('descending')}
          >
            descending
          </p>
        </div>
      </div>
      <div className="sort-types-wrapper">
        <h3>View:</h3>
        <div className="sort-type-wrapper">
          <p
            className={viewType === 'cards' ? 'sort-type-selector active' : 'sort-type-selector'}
            onClick={() => viewTypeHandler('cards')}
          >
            cards
          </p>
          <p
            className={viewType === 'list' ? 'sort-type-selector active' : 'sort-type-selector'}
            onClick={() => viewTypeHandler('list')}
          >
            list
          </p>
        </div>
      </div>
    </aside>
  );
};
