import React, { useEffect, useState, useRef } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({ introRef, servicesRef, photoCarouselRef }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isMobile, setIsMobile] = useState(false);
  const indicatorRef = useRef(null);

  /* Checking if is Mobile or Tablet */
  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (ref, sectionName) => {
    if (ref.current) {
      const behavior = isMobile ? 'auto' : 'smooth';
      ref.current.scrollIntoView({ behavior, block: 'start' });
      setActiveSection(sectionName);
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { ref: introRef, name: 'introduction' },
      { ref: servicesRef, name: 'services' },
      { ref: photoCarouselRef, name: 'carousel' },
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
        threshold: isMobile ? 0.2 : 0.6, 
        rootMargin: isMobile ? '-10% 0px' : '0px' 
      }
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [introRef, servicesRef, photoCarouselRef, isMobile]);

  return (
    <div className={`indicator__list-wrap ${isMobile ? 'mobile-device' : ''}`} ref={indicatorRef}>
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'introduction' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(introRef, 'introduction')}
          aria-label="גלול לברוכים הבאים"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">ברוכים הבאים</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'services' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(servicesRef, 'services')}
          aria-label="גלול להאני מאמין שלי"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">האני מאמין שלי</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'carousel' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(photoCarouselRef, 'carousel')}
          aria-label="גלול להרכבת מחשבים"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הרכבת מחשבים</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;
