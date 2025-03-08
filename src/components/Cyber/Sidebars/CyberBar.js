import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CyberBar.css';

function CyberBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftHacking, setShiftHacking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const timersRef = useRef({ hoverLogo: null, hoverHacking: null, closeMenu: null });
  
  // מצב התחלתי של מגע
  const touchStartRef = useRef({ y: 0 });

  // בדיקה אם המכשיר הוא נייד באמצעות User Agent
  useEffect(() => {
    const checkMobile = () => {
      // בדיקת User Agent כדי לזהות מכשירים ניידים
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // רגקס לזיהוי מכשירים ניידים (טלפונים וטאבלטים)
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // קביעת המצב לפי בדיקת הרגקס
      const isMobileDevice = mobileRegex.test(userAgent);
      setIsMobile(isMobileDevice);
      
      // הוספה או הסרה של קלאס 'mobile-device' מאלמנט ה-body
      if (isMobileDevice) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    // בדיקה ראשונית
    checkMobile();
    
    // לא מוסיפים מאזין לשינוי גודל החלון כי אנחנו רוצים רק לבדוק את סוג המכשיר
  }, []);

  const handleMouseEnterLogo = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
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
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    if (activeMenu === 'logo') return;
    clearTimeout(timersRef.current.closeMenu);
    
    timersRef.current.hoverHacking = setTimeout(() => {
      setActiveMenu('hacking');
    }, 250);
  };

  const handleMouseLeave = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverHacking);
    
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftHacking(false);
    }, 200);
  };

  const handleClickOutside = (event) => {
    // אם לחצו על הרקע הכהה (overlay) או מחוץ לתפריט במובייל
    if (isMobile && 
        activeMenu && 
        menuRef.current && 
        !event.target.closest('.dropdown-menu') && 
        !event.target.closest('.menu-icon')) {
      closeMenuWithAnimation();
      return;
    }
    
    // טיפול רגיל בלחיצה מחוץ לתפריט במחשב
    if (!isMobile && menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
      setShiftHacking(false);
    }
  };

  // טיפול בלחיצה על אייקון במובייל
  const handleMobileIconClick = (menuType) => {
    if (!isMobile) return; // רק במובייל
    
    if (activeMenu === menuType) {
      // סגור את התפריט אם הוא כבר פתוח
      closeMenuWithAnimation();
    } else {
      // סגור תפריט קודם אם פתוח
      if (activeMenu) {
        closeMenuWithAnimation();
        // פתח את התפריט החדש אחרי שהתפריט הקודם נסגר
        setTimeout(() => {
          setActiveMenu(menuType);
          setIsClosing(false);
        }, 350);
      } else {
        // פתח את התפריט הנבחר
        setActiveMenu(menuType);
      }
      
      // וודא שהתפריט יוצג כראוי
      if (menuType === 'logo') {
        setShiftHacking(false);
      }
    }
  };

  // סגירת התפריט עם אנימציה
  const closeMenuWithAnimation = () => {
    if (!activeMenu) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setActiveMenu(null);
      setIsClosing(false);
    }, 300);
  };

  // טיפול בהחלקה למטה לסגירת התפריט
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
      clearTimeout(timersRef.current.hoverHacking);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, [isMobile]);

  // רנדור התפריט הנפתח במובייל
  const renderMobileMenu = () => {
    if (!isMobile || !activeMenu) return null;
    
    const isHackingMenu = activeMenu === 'hacking';
    
    // פונקציה לטיפול בלחיצה על קישור בתפריט
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
        
        {isHackingMenu ? (
          <>
            <Link to="/cyber/hacking/guides" onClick={handleMenuLinkClick}>מדריכי סייבר</Link>
            <Link to="/cyber/hacking/articles" onClick={handleMenuLinkClick}>מאמרי סייבר</Link>
            <Link to="/cyber/hacking/videos" onClick={handleMenuLinkClick}>סרטוני סייבר</Link>
          </>
        ) : (
          <>
            <Link to="/contact-us" onClick={handleMenuLinkClick}>צור קשר</Link>
            <Link to="/works-with" onClick={handleMenuLinkClick}>ספקים וחברות</Link>
            <Link to="/thanks" onClick={handleMenuLinkClick}>תודות</Link>
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
          className={`hacking ${shiftHacking ? 'shift' : ''} ${isMobile && activeMenu === 'hacking' ? 'active-mobile' : ''}`}
          onMouseEnter={!isMobile ? handleMouseEnterHacking : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onFocus={!isMobile ? handleMouseEnterHacking : undefined}
          onBlur={!isMobile ? handleMouseLeave : undefined}
        >
          <Link 
            to="/cyber/hacking" 
            className="menu-icon"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleMobileIconClick('hacking');
              }
            }}
          >
            <img src="/images/hacking.png" alt="hacking-section" />
          </Link>
          
          {activeMenu === 'hacking' && !isMobile && (
            <div className="dropdown-menu">
              <Link to="/cyber/hacking/guides" onClick={() => setActiveMenu(null)}>מדריכי סייבר</Link>
              <Link to="/cyber/hacking/articles" onClick={() => setActiveMenu(null)}>מאמרי סייבר</Link>
              <Link to="/cyber/hacking/videos" onClick={() => setActiveMenu(null)}>סרטוני סייבר</Link>
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
              <Link to="/contact-us" onClick={() => { setActiveMenu(null); setShiftHacking(false); }}>צור קשר</Link>
              <Link to="/works-with" onClick={() => { setActiveMenu(null); setShiftHacking(false); }}>ספקים וחברות</Link>
              <Link to="/thanks" onClick={() => { setActiveMenu(null); setShiftHacking(false); }}>תודות</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default CyberBar;
