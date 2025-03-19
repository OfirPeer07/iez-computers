import React from 'react';

const InfoTechToggleButton = ({ isOpen, isScrollingDown, toggleNav }) => (
  <button 
    className={`toggle-nav-btn ${isOpen ? 'open' : ''} ${isScrollingDown ? 'hidden' : ''}`} 
    onClick={toggleNav}
    aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
    aria-expanded={isOpen}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
);

export default InfoTechToggleButton;
