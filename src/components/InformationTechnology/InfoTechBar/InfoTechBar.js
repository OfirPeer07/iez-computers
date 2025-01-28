import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InfoTechBar.css';

function InfoTechBar() {
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active
  const [shiftComputer, setShiftHacking] = useState(false); // Control the computer icon shift
  const [hoverLogoTimer, setHoverLogoTimer] = useState(null); // Timer for hover delay
  const [closeMenuTimer, setCloseMenuTimer] = useState(null); // Timer for fast closing

  const handleMouseEnterLogo = () => {
    // Start the hover delay timer for the logo menu
    clearTimeout(closeMenuTimer); // Prevent premature closing
    const shiftTimer = setTimeout(() => {
      setShiftHacking(true); // Shift the computer icon
      const menuTimer = setTimeout(() => {
        setActiveMenu('logo'); // Open the logo menu with a delay
      }, 400); // Delay for opening the menu
      setHoverLogoTimer(menuTimer);
    }, 250); // Delay for logo shift
    setHoverLogoTimer(shiftTimer);
  };

  const handleMouseEnterComputer = () => {
    clearTimeout(closeMenuTimer); // Prevent premature closing
    setActiveMenu('computer'); // Open the computer menu immediately
  };

  const handleMouseLeave = () => {
    // Clear all opening timers
    clearTimeout(hoverLogoTimer);
    setHoverLogoTimer(null);

    // Close menu faster on leave
    const closeTimer = setTimeout(() => {
      setActiveMenu(null); // Close menus
      setShiftHacking(false); // Reset the computer icon position
    }, 100); // Close immediately with a small delay to prevent flicker
    setCloseMenuTimer(closeTimer);
  };

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      clearTimeout(hoverLogoTimer);
      clearTimeout(closeMenuTimer);
    };
  }, [hoverLogoTimer, closeMenuTimer]);

  return (
    <div className="sidebar">
      <ul>
        {/* Section 1 - Computer */}
        <li
          className={`computer ${shiftComputer ? 'shift' : ''}`} // No default "return" class
          onMouseEnter={handleMouseEnterComputer}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/information-technology/InfoTechDepartment" className="menu-icon">
            <img src="/images/computer.png" alt="computer-section" />
          </Link>
          {activeMenu === 'computer' && (
            <div className="dropdown-menu">
              <Link to="/information-technology/troubleshooting-guides">מדריכי פתרון תקלות</Link>
              <Link to="/information-technology/technology-news">חדשות טכנולוגיה</Link>
              <Link to="/information-technology/building-computers">הרכבות מחשבים</Link>
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

export default InfoTechBar;
