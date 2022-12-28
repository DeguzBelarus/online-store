import React, { FC } from 'react';

import './Order.scss';

interface Props {
  orderModeHandler: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
}

export const Order: FC<Props> = ({ orderModeHandler }): JSX.Element => {
  return (
    <div className="order-wrapper">
      <form className="order-form">
        <h3>Your Order:</h3>
        <div
          className="order-return-button"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => orderModeHandler(event)}
        >
          Back
        </div>
      </form>
    </div>
  );
};
