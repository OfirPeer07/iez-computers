import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HackingBar.css';


function HackingBar() {
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active
  const [shiftHacking, setShiftHacking] = useState(false); // Control the hacking icon shift
  const [hoverLogoTimer, setHoverLogoTimer] = useState(null); // Timer for hover delay
  const [closeMenuTimer, setCloseMenuTimer] = useState(null); // Timer for fast closing

  const handleMouseEnterLogo = () => {
    // Start the hover delay timer for the logo menu
    clearTimeout(closeMenuTimer); 
    const shiftTimer = setTimeout(() => {
      setShiftHacking(true); 
      const menuTimer = setTimeout(() => {
        setActiveMenu('logo'); 
      }, 400); 
      setHoverLogoTimer(menuTimer);
    }, 250); 
    setHoverLogoTimer(shiftTimer);
  };

  const handleMouseEnterComputer = () => {
    clearTimeout(closeMenuTimer); 
    setActiveMenu('hacking'); 
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverLogoTimer);
    setHoverLogoTimer(null);

    // Close menu faster on leave
    const closeTimer = setTimeout(() => {
      setActiveMenu(null); 
      setShiftHacking(false);
    }, 100);
    setCloseMenuTimer(closeTimer);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverLogoTimer);
      clearTimeout(closeMenuTimer);
    };
  }, [hoverLogoTimer, closeMenuTimer]);

  return (
    <div className="sidebar">
      <ul>
        {/* Section 1 - Hacking */}
        <li
          className={`hacking ${shiftHacking ? 'shift' : ''}`}
          onMouseEnter={handleMouseEnterComputer}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/cyber/hacking" className="menu-icon">
            <img src="/images/hacking.png" alt="hacking-section" />
          </Link>
          {activeMenu === 'hacking' && (
            <div className="dropdown-menu">
              <Link to="/cyber/hacking/guides">מדריכי סייבר</Link>
              <Link to="/cyber/hacking/articles">מאמרי סייבר</Link>
              <Link to="/cyber/hacking/videos">סרטוני סייבר</Link>
            </div>
          )}
        </li>
        {/* Section 2 - Logo */}
        <li
          onMouseEnter={handleMouseEnterLogo}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/" className="menu-icon">
            <img src="/images/logo.png" alt="logo-section" />
          </Link>
          {activeMenu === 'logo' && (
            <div className="dropdown-menu logo-menu">
              <Link to="/contact-us">צור קשר</Link>
              <Link to="/works-with">ספקים וחברות</Link>
              <Link to="/thanks">תודות</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default HackingBar;