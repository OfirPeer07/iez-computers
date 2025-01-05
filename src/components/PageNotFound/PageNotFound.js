import React from 'react';
import './PageNotFound.css';
import backgroundImage from './Background.jpg';
import hackerImage from './Hacker.png';

const PageNotFound = () => {
  return (
    <div className="page-not-found-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hackerPNF" style={{ backgroundImage: `url(${hackerImage})` }}></div>
      <div className="text">
        <span className="flicker">We have a </span>
        <span className="flicker _404">404 </span>
        <span className="blink error">Error</span>
        <span className="flickerProblem"> Problem</span>
      </div>
    </div>
  );
};

export default PageNotFound;