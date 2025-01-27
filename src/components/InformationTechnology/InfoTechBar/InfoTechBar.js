import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InfoTechBar.css';

function InfoTechBar() {
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active
  const [shiftComputer, setShiftComputer] = useState(false); // Control the computer icon shift
  const [hoverLogoTimer, setHoverLogoTimer] = useState(null); // Timer for hover delay on logo
  const [menuDelayTimer, setMenuDelayTimer] = useState(null); // Timer for menu delay

  const handleMouseEnterLogo = () => {
    // Start the hover delay timer for the "logo"
    const shiftTimer = setTimeout(() => {
      setShiftComputer(true); // Shift the computer icon after 250ms
      const menuTimer = setTimeout(() => {
        setActiveMenu('logo'); // Open the logo menu with delay
      }, 400); // Delay for opening the menu
      setMenuDelayTimer(menuTimer);
    }, 250); // Hover delay for the logo menu and computer shift
    setHoverLogoTimer(shiftTimer); // Store the timer
  };

  const handleMouseEnterComputer = () => {
    setActiveMenu('computer'); // Open the computer menu immediately
  };

  const handleMouseLeave = () => {
    // Clear any pending hover delay for the logo
    clearTimeout(hoverLogoTimer);
    clearTimeout(menuDelayTimer);
    setHoverLogoTimer(null);
    setMenuDelayTimer(null);
    setActiveMenu(null); // Close all menus
    setShiftComputer(false); // Reset the computer icon position
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
