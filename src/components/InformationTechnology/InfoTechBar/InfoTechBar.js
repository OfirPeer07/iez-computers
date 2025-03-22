import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './InfoTechBar.css';

function InfoTechBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftComputer, setShiftComputer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const timersRef = useRef({ hoverLogo: null, hoverComputer: null, closeMenu: null });
  const touchStartRef = useRef({ y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      const isMobileDevice = mobileRegex.test(userAgent);
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    checkMobile();
    
  }, []);

  const handleMouseEnterLogo = () => {
    if (isMobile) return;
    
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
    if (isMobile) return;
    
    if (activeMenu === 'logo') return; 
    clearTimeout(timersRef.current.closeMenu);
    
    timersRef.current.hoverComputer = setTimeout(() => {
      setActiveMenu('computer');
    }, 250);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverComputer);
    
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftComputer(false);
    }, 200);
  };

  const handleClickOutside = (event) => {
    if (isMobile && 
        activeMenu && 
        menuRef.current && 
        !event.target.closest('.dropdown-menu') && 
        !event.target.closest('.menu-icon')) {
      closeMenuWithAnimation();
      return;
    }
    
    if (!isMobile && menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
      setShiftComputer(false);
    }
  };

  const handleMobileIconClick = (menuType) => {
    if (!isMobile) return; 
    
    if (activeMenu === menuType) {
      closeMenuWithAnimation();
    } else {
      if (activeMenu) {
        closeMenuWithAnimation();
        setTimeout(() => {
          setActiveMenu(menuType);
          setIsClosing(false);
        }, 350);
      } else {
        setActiveMenu(menuType);
      }
      
      if (menuType === 'logo') {
        setShiftComputer(false);
      }
    }
  };

  const closeMenuWithAnimation = () => {
    if (!activeMenu) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setActiveMenu(null);
      setIsClosing(false);
    }, 300); 
  };

  const handleTouchStart = (e) => {
    touchStartRef.current.y = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!activeMenu) return;
    
    const touchY = e.touches[0].clientY;
    const startY = touchStartRef.current.y;
    const deltaY = touchY - startY;
    
    if (deltaY > 70) {
      closeMenuWithAnimation();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }
      
      clearTimeout(timersRef.current.hoverLogo);
      clearTimeout(timersRef.current.hoverComputer);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, [isMobile]);

  const renderMobileMenu = () => {
    if (!isMobile || !activeMenu) return null;
    
    const isComputerMenu = activeMenu === 'computer';
    
    const handleMenuLinkClick = () => {
      closeMenuWithAnimation();
    };
    
    return (
      <div 
        className={`mobile-dropdown-menu ${isClosing ? 'closing' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="swipe-indicator"></div>
        <button 
          className="close-menu-btn" 
          onClick={() => closeMenuWithAnimation()}
          aria-label="סגור תפריט"
        >
          ✕
        </button>
        
        {isComputerMenu ? (
          <>
            <Link to="/information-technology/troubleshooting-guides" onClick={handleMenuLinkClick}>מדריכי פתרון תקלות</Link>
            <Link to="/information-technology/technology-news" onClick={handleMenuLinkClick}>חדשות טכנולוגיה</Link>
            <Link to="/information-technology/building-computers" onClick={handleMenuLinkClick}>הרכבות מחשבים</Link>
          </>
        ) : (
          <>
            <Link to="/" onClick={handleMenuLinkClick}>דף ראשי</Link>
            <Link to="/information-technology/works-with" onClick={handleMenuLinkClick}>ספקים וחברות</Link>
            <Link to="/thanks" onClick={handleMenuLinkClick}>תודות</Link>
            <Link to="/contact-us" onClick={handleMenuLinkClick}>צור קשר</Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar" ref={menuRef}>
      {isMobile && activeMenu && (
        <div className="mobile-overlay" onClick={() => closeMenuWithAnimation()}></div>
      )}
      
      {renderMobileMenu()}
      
      <ul>
        <li
          className={`computer ${shiftComputer ? 'shift' : ''} ${isMobile && activeMenu === 'computer' ? 'active-mobile' : ''}`}
          onMouseEnter={!isMobile ? handleMouseEnterComputer : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onFocus={!isMobile ? handleMouseEnterComputer : undefined}
          onBlur={!isMobile ? handleMouseLeave : undefined}
        >
          <Link 
            to="/information-technology/InfoTechDepartment" 
            className="menu-icon"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleMobileIconClick('computer');
              }
            }}
          >
            <img src="/images/computer.png" alt="computer-section" />
          </Link>
          
          {activeMenu === 'computer' && !isMobile && (
            <div className="dropdown-menu">
              <Link to="/information-technology/troubleshooting-guides" onClick={() => setActiveMenu(null)}>מדריכי פתרון תקלות</Link>
              <Link to="/information-technology/technology-news" onClick={() => setActiveMenu(null)}>חדשות טכנולוגיה</Link>
              <Link to="/information-technology/building-computers" onClick={() => setActiveMenu(null)}>הרכבות מחשבים</Link>
            </div>
          )}
        </li>
        <li
          className={`${isMobile && activeMenu === 'logo' ? 'active-mobile' : ''}`}
          onMouseEnter={!isMobile ? handleMouseEnterLogo : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onFocus={!isMobile ? handleMouseEnterLogo : undefined}
          onBlur={!isMobile ? handleMouseLeave : undefined}
        >
          <Link 
            to="/" 
            className="menu-icon"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleMobileIconClick('logo');
              }
            }}
          >
            <img src="/images/logo.png" alt="logo-section" />
          </Link>
          
          {activeMenu === 'logo' && !isMobile && (
            <div className="dropdown-menu logo-menu">
              <Link to="/information-technology/works-with" onClick={(e) => e.stopPropagation()}>ספקים וחברות</Link>
              <Link to="/thanks" onClick={() => { setActiveMenu(null); setShiftComputer(false); }}>תודות</Link>
              <Link to="/contact-us" onClick={() => { setActiveMenu(null); setShiftComputer(false); }}>צור קשר</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default InfoTechBar;
