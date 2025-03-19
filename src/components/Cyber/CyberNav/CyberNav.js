import React, { useState, useEffect } from 'react';
import CyberCategorySection from './CyberCategorySection';
import CyberToggleButton from './CyberToggleButton';
import useCyberMarkdown from './useCyberMarkdown';
import './CyberNav.css';
import './CyberMobile.css';
import './CyberToggleButton.css';
import './CyberCategorySection.css';

const CyberNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const { articles, error } = useCyberMarkdown();

  const toggleNav = () => setIsOpen(!isOpen);

  const handleScroll = () => {
    setIsScrollingDown(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <CyberToggleButton isOpen={isOpen} isScrollingDown={isScrollingDown} toggleNav={toggleNav} />
      <div className={`sidenav ${!isOpen ? 'closed' : ''}`}>
        {Object.entries(articles).map(([category, data]) => (
          <CyberCategorySection key={category} data={data} toggleNav={toggleNav} />
        ))}
      </div>
    </>
  );
};

export default CyberNav;