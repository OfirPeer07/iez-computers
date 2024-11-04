import React from 'react';
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="page-not-found-container">
      <div class="hacker"></div>
      <div className="text">
        <span className="flicker">We have a </span>
          <span className="blink error">Error</span>
          <span className="flicker _404">404</span> 
        <span className="flickerProblem"> Problem</span>
        
      </div>
    </div>
  );
};

export default PageNotFound;
