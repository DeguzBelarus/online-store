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
import { ViewType, Nullable } from 'types/types';
import './SortBar.scss';

interface Props {
  isMouseOnMain: boolean;
}

export const SortBar: FC<Props> = ({ isMouseOnMain }): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch();

  const viewType: ViewType = useAppSelector(getViewType);
  const sortByName: Nullable<string> = useAppSelector(getSortByName);
  const sortByPrice: Nullable<string> = useAppSelector(getSortByPrice);

  const viewTypeHandler = (
    event: React.MouseEvent<HTMLParagraphElement> | React.TouchEvent<HTMLParagraphElement>,
    value: ViewType
  ): void => {
    if (viewType !== value) {
      dispatch(setViewType(value));
    }
  };

  const sortByNameHandler = (
    event: React.MouseEvent<HTMLParagraphElement> | React.TouchEvent<HTMLParagraphElement>,
    value: Nullable<'ascending' | 'descending'>
  ): void => {
    if (sortByName !== value) {
      dispatch(setSortByName(value));
    } else {
      dispatch(setSortByName(null));
    }
    if (sortByPrice) {
      dispatch(setSortByPrice(null));
    }
  };

  const sortByPriceHandler = (
    event: React.MouseEvent<HTMLParagraphElement> | React.TouchEvent<HTMLParagraphElement>,
    value: Nullable<'ascending' | 'descending'>
  ): void => {
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
    <aside className={isMouseOnMain ? 'active' : ''}>
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
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              sortByNameHandler(event, 'ascending')
            }
          >
            ascending
          </p>
          <p
            className={
              sortByName && sortByName === 'descending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              sortByNameHandler(event, 'descending')
            }
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
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              sortByPriceHandler(event, 'ascending')
            }
          >
            ascending
          </p>
          <p
            className={
              sortByPrice && sortByPrice === 'descending'
                ? 'sort-type-selector active clickable'
                : 'sort-type-selector clickable'
            }
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              sortByPriceHandler(event, 'descending')
            }
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
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              viewTypeHandler(event, 'cards')
            }
          >
            cards
          </p>
          <p
            className={viewType === 'list' ? 'sort-type-selector active' : 'sort-type-selector'}
            onClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
              viewTypeHandler(event, 'list')
            }
          >
            list
          </p>
        </div>
      </div>
    </aside>
  );
};
