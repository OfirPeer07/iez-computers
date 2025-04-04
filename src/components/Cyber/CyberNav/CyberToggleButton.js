import React from 'react';
import './CyberToggleButton.css';

const CyberToggleButton = ({ isOpen, toggleNav }) => (
  <button 
    className={`cyber-nav-btn ${isOpen ? 'open' : ''}`} 
    onClick={toggleNav}
    aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
    aria-expanded={isOpen}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
);

export default CyberToggleButton;