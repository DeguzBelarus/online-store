import React, { FC } from 'react';
import './Page404.scss';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const Page404: FC = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="page-404-wrapper">
      <h1 className="page-404-h1">404 Error page</h1>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <button onClick={() => navigate('/')} className="more-link">
        Home Page
      </button>
    </div>
  );
};
