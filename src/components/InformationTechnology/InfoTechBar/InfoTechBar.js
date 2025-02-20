import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './InfoTechBar.css';

function InfoTechBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftComputer, setShiftComputer] = useState(false);
  const menuRef = useRef(null);
  const timersRef = useRef({ hoverLogo: null, hoverComputer: null, closeMenu: null });

  const handleMouseEnterLogo = () => {
    clearTimeout(timersRef.current.closeMenu);
    clearTimeout(timersRef.current.hoverComputer);
    timersRef.current.hoverLogo = setTimeout(() => {
      setShiftComputer(true);
      timersRef.current.hoverLogo = setTimeout(() => {
        setActiveMenu('logo');
      }, 400);
    }, 250);
  };

  const handleMouseEnterComputer = () => {
    if (activeMenu === 'logo') return; // Prevent opening if the user is moving from logo menu
    clearTimeout(timersRef.current.closeMenu);
    timersRef.current.hoverComputer = setTimeout(() => {
      setActiveMenu('computer');
    }, 250);
  };

  const handleMouseLeave = () => {
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverComputer);
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftComputer(false);
    }, 200);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
      setShiftComputer(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timersRef.current.hoverLogo);
      clearTimeout(timersRef.current.hoverComputer);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, []);

  return (
    <div className="sidebar" ref={menuRef}>
      <ul>
        <li
          className={`computer ${shiftComputer ? 'shift' : ''}`}
          onMouseEnter={handleMouseEnterComputer}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnterComputer}
          onBlur={handleMouseLeave}
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
        <li
          onMouseEnter={handleMouseEnterLogo}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnterLogo}
          onBlur={handleMouseLeave}
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
