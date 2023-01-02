import React, { FC } from 'react';

import './Footer.scss';

export const Footer: FC = (): JSX.Element => {
  return (
    <footer>
      <div className="footer-authors">
        <a
          href="https://github.com/DeguzBelarus"
          target={'_blank'}
          className="footer-author-link"
          title="DeguzBelarus"
          rel="noreferrer"
        >
          Anton Dektyarev
        </a>
        <p>&amp;</p>
        <a
          href="https://github.com/shalick"
          target={'_blank'}
          className="footer-author-link"
          title="Shalick"
          rel="noreferrer"
        >
          Alick Shabanovich
        </a>
      </div>
      <div className="footer-logo-year">
        <a href="https://rs.school/js/" target={'_blank'} title="RS School" rel="noreferrer">
          <div className="rsschool-footer-link"></div>
        </a>
        <p>2022</p>
      </div>
    </footer>
  );
};
