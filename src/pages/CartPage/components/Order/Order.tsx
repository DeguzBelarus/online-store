import React, { FC, Dispatch, SetStateAction } from 'react';

import './Order.scss';

interface Props {
  setIsOrderMode: Dispatch<SetStateAction<boolean>>;
}

export const Order: FC<Props> = ({ setIsOrderMode }): JSX.Element => {
  return (
    <div className="order-wrapper">
      <form className="order-form">
        <h3>Your Order:</h3>
        <div className="order-return-button" onClick={() => setIsOrderMode(false)}>
          Back
        </div>
      </form>
    </div>
  );
};
