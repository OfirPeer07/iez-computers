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
    clearTimeout(timersRef.current.hoverComputer);
    
    timersRef.current.hoverLogo = setTimeout(() => {
      setShiftComputer(true);
      timersRef.current.hoverLogo = setTimeout(() => {
        setActiveMenu('logo');
      }, 400);
    }, 250);
  };

  const handleMouseEnterComputer = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    if (activeMenu === 'logo') return; // Prevent opening if the user is moving from logo menu
    clearTimeout(timersRef.current.closeMenu);
    
    timersRef.current.hoverComputer = setTimeout(() => {
      setActiveMenu('computer');
    }, 250);
  };

  const handleMouseLeave = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverComputer);
    
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftComputer(false);
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
      setShiftComputer(false);
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
        // אם פותחים את תפריט הלוגו, וודא שהמחשב לא מוזז
        setShiftComputer(false);
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
    }, 300); // זמן האנימציה
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
    
    // אם המשתמש החליק למטה מספיק, סגור את התפריט
    if (deltaY > 70) {
      closeMenuWithAnimation();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    // הוסף מאזינים לאירועי מגע במובייל
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      // הסר מאזינים לאירועי מגע
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }
      
      clearTimeout(timersRef.current.hoverLogo);
      clearTimeout(timersRef.current.hoverComputer);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, [isMobile]);

  // רנדור התפריט הנפתח במובייל
  const renderMobileMenu = () => {
    if (!isMobile || !activeMenu) return null;
    
    const isComputerMenu = activeMenu === 'computer';
    
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
        
        {isComputerMenu ? (
          // תוכן תפריט המחשב
          <>
            <Link to="/information-technology/troubleshooting-guides" onClick={handleMenuLinkClick}>מדריכי פתרון תקלות</Link>
            <Link to="/information-technology/technology-news" onClick={handleMenuLinkClick}>חדשות טכנולוגיה</Link>
            <Link to="/information-technology/building-computers" onClick={handleMenuLinkClick}>הרכבות מחשבים</Link>
          </>
        ) : (
          // תוכן תפריט הלוגו
          <>
            <Link to="/contact-us" onClick={handleMenuLinkClick}>צור קשר</Link>
            <Link to="/works-with" onClick={handleMenuLinkClick}>ספקים וחברות</Link>
            <Link to="/information-technology/thanks" onClick={handleMenuLinkClick}>תודות</Link>
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
      
      {/* תפריט מובייל משותף */}
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
          
          {/* תפריט המחשב במחשב (לא במובייל) */}
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
          
          {/* תפריט הלוגו במחשב (לא במובייל) */}
          {activeMenu === 'logo' && !isMobile && (
            <div className="dropdown-menu logo-menu">
              <Link to="/contact-us" onClick={() => { setActiveMenu(null); setShiftComputer(false); }}>צור קשר</Link>
              <Link to="/information-technology/works-with" onClick={() => { setActiveMenu(null); setShiftComputer(false); }}>ספקים וחברות</Link>
              <Link to="/thanks" onClick={() => { setActiveMenu(null); setShiftComputer(false); }}>תודות</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default InfoTechBar;
