import React, { useState, useEffect } from 'react';
import InfoTechToggleButton from './InfoTechToggleButton';
import InfoTechCategorySection from './InfoTechCategorySection';
import useInfoTechMarkdown from './useInfoTechMarkdown';
import './InfoTechNav.css';

const InfoTechNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const { articles, error } = useInfoTechMarkdown();

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
      <InfoTechToggleButton isOpen={isOpen} isScrollingDown={isScrollingDown} toggleNav={toggleNav} />
      <div className={`sidenav ${!isOpen ? 'closed' : ''}`}>
        {Object.entries(articles).map(([category, data]) => (
          <InfoTechCategorySection key={category} data={data} toggleNav={toggleNav} />
        ))}
      </div>
    </>
  );
};

export default InfoTechNav;
