import React, { useEffect, useState, useRef } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({resilienceTestersRef, theGreenHoodRef }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isMobile, setIsMobile] = useState(false);
  const indicatorRef = useRef(null);

  // בדיקה אם המכשיר הוא מובייל או טאבלט
  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };
    
    // בדיקה ראשונית
    checkMobile();
    
    // הוספת מאזין לשינוי גודל החלון
    window.addEventListener('resize', checkMobile);
    
    // ניקוי
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (ref, sectionName) => {
    if (ref.current) {
      // התאמת ההתנהגות למובייל - גלילה מהירה יותר
      const behavior = isMobile ? 'auto' : 'smooth';
      ref.current.scrollIntoView({ behavior, block: 'start' });
      setActiveSection(sectionName);
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { ref: resilienceTestersRef, name: 'resilienceTesters' },
      { ref: theGreenHoodRef, name: 'theGreenHood' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sectionRefs.find((s) => s.ref.current === entry.target);
            if (section) setActiveSection(section.name);
          }
        });
      },
      { 
        threshold: isMobile ? 0.2 : 0.6, // סף נמוך יותר למובייל וטאבלט
        rootMargin: isMobile ? '-10% 0px' : '0px' // מרווח שונה למובייל וטאבלט
      }
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [resilienceTestersRef, theGreenHoodRef, isMobile]);

  return (
    <div className={`indicator__list-wrap ${isMobile ? 'mobile-device' : ''}`} ref={indicatorRef}>
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'resilienceTesters' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(resilienceTestersRef, 'resilienceTesters')}
          aria-label="גלול לבודק חוסן"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">בודק חוסן</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'theGreenHood' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(theGreenHoodRef, 'theGreenHood')}
          aria-label="גלול להברדס הירוק"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הברדס הירוק</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;
