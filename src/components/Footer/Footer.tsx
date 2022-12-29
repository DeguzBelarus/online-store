import React, { FC } from 'react';
import './Footer.scss';

export const Footer: FC = (): JSX.Element => {
  return (
    <footer>
      <div className="footer-authors">
        <a href="https://github.com/DeguzBelarus" className="footer-author-link">
          Anton Dektyarev
        </a>
        <p>&amp;</p>
        <a href="https://github.com/shalick" className="footer-author-link">
          Alick Shabanovich
        </a>
      </div>
      <div className="footer-logo-year">
        <a href="https://rs.school/js/">
          <div className="rsschool-footer-link"></div>
        </a>
        <p>2022</p>
      </div>
    </footer>
  );
};
