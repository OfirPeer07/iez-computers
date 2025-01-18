import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CyberBar.css';

function SideBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseEnter = (menu, hoverImg) => {
    clearTimer();
    setActiveMenu(menu);
    setHoverImage(hoverImg);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoverImage(null);
    }, 5000); // Set delay for 5 seconds
  };

  const handleMenuMouseEnter = () => {
    clearTimer();
  };

  const handleMenuMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoverImage(null);
    }, 5000); // Set delay for 5 seconds
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <div className="sidebar">
      <ul>
        {/* Section 1 - Hacking */}
        <li
          className="hacking-icon"
          onMouseEnter={() => handleMouseEnter('hacking', 'hacking')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/cyber/hacking" className="menu-icon">
            <img
              src={hoverImage === 'hackerLogo' ? '/images/hackerLogo.png' : '/images/hackerLogo.png'}
              alt="Hacking"
            />
          </Link>
          {activeMenu === 'hacking' && (
            <div
              className="dropdown-menu"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
              <Link to="/cyber/hacking/guides">מדריכי סייבר</Link>
              <Link to="/cyber/hacking/articles">מאמרי סייבר</Link>
              <Link to="/cyber/hacking/videos">סרטוני סייבר</Link>
            </div>
          )}
        </li>
        {/* Section 3 - Logo */}
        <li
          onMouseEnter={() => handleMouseEnter('logo', 'logo')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/" className="menu-icon">
            <img src="/images/logo.png" alt="logo-section" />
          </Link>
          {activeMenu === 'logo' && (
            <div
              className="dropdown-menu"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
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

export default SideBar;