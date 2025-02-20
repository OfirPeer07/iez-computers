import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CyberBar.css';

function CyberBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftHacking, setShiftHacking] = useState(false);
  const menuRef = useRef(null);
  const timersRef = useRef({ hoverLogo: null, hoverHacking: null, closeMenu: null });

  const handleMouseEnterLogo = () => {
    clearTimeout(timersRef.current.closeMenu);
    clearTimeout(timersRef.current.hoverHacking);
    timersRef.current.hoverLogo = setTimeout(() => {
      setShiftHacking(true);
      timersRef.current.hoverLogo = setTimeout(() => {
        setActiveMenu('logo');
      }, 400);
    }, 250);
  };

  const handleMouseEnterHacking = () => {
    if (activeMenu === 'logo') return;
    clearTimeout(timersRef.current.closeMenu);
    timersRef.current.hoverHacking = setTimeout(() => {
      setActiveMenu('hacking');
    }, 250);
  };

  const handleMouseLeave = () => {
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverHacking);
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftHacking(false);
    }, 200);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
      setShiftHacking(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timersRef.current.hoverLogo);
      clearTimeout(timersRef.current.hoverHacking);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, []);

  return (
    <div className="sidebar" ref={menuRef}>
      <ul>
        <li
          className={`hacking ${shiftHacking ? 'shift' : ''}`}
          onMouseEnter={handleMouseEnterHacking}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnterHacking}
          onBlur={handleMouseLeave}
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
        <li
          onMouseEnter={handleMouseEnterLogo}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnterHacking}
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

export default CyberBar;
