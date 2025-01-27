import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CyberBar.css';

function CyberBar() {
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active
  const [shiftHacking, setShiftHacking] = useState(false); // Control the hacking icon shift
  const [hoverLogoTimer, setHoverLogoTimer] = useState(null); // Timer for hover delay on logo
  const [menuDelayTimer, setMenuDelayTimer] = useState(null); // Timer for menu delay


  const handleMouseEnterLogo = () => {
    // Start the hover delay timer for the "logo"
    const shiftTimer = setTimeout(() => {
      setShiftHacking(true); // Shift the hacking icon after 250ms
      const menuTimer = setTimeout(() => {
        setActiveMenu('logo'); // Open the logo menu with delay
      }, 400); // Delay for opening the menu
      setMenuDelayTimer(menuTimer);
    }, 250); // Hover delay for the logo menu and hacking shift
    setHoverLogoTimer(shiftTimer); // Store the timer
  };

  const handleMouseEnterComputer = () => {
    setActiveMenu('hacking'); // Open the hacking menu immediately
  };

  const handleMouseLeave = () => {
    // Clear any pending hover delay for the logo
    clearTimeout(hoverLogoTimer);
    clearTimeout(menuDelayTimer);
    setHoverLogoTimer(null);
    setMenuDelayTimer(null);
    setActiveMenu(null); // Close all menus
    setShiftHacking(false); // Reset the hacking icon position
  };

  useEffect(() => {
    // Cleanup the hover delay timers on component unmount
    return () => {
      clearTimeout(hoverLogoTimer);
      clearTimeout(menuDelayTimer);
    };
  }, [hoverLogoTimer, menuDelayTimer]);

  return (
    <div className="sidebar">
      <ul>
        {/* Section 1 - Hacking */}
        <li
          className={`hacking ${shiftHacking ? 'shift' : ''}`} // No default "return" class
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

export default CyberBar;