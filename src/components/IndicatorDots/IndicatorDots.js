import React from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({ activeSection, scrollToSection, introRef, servicesRef, photoCarouselRef }) => {
  return (
    <div className="indicator__list-wrap">
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'introduction' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(introRef, 'introduction')}
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
