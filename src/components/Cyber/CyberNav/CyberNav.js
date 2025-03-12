import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CyberNav.css';

const CyberNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const folders = {
      'CyberArticles': { 
        title: 'Cyber Articles',
        path: 'cyber/hacking/articles'
      },
      'CyberGuides': { 
        title: 'Cyber Guides',
        path: 'cyber/hacking/guides'
      },
    };

    const importAll = (r) => {
      try {
        const files = r.keys().map((fileName) => ({
          title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
          path: fileName.replace('./', '')
        }));
        return files;
      } catch (error) {
        setError('Error loading files');
        console.warn('Error importing files:', error);
        return [];
      }
    };

    try {
      const cyberArticles = importAll(require.context('../../../../public/md/CyberArticles', false, /\.md$/));
      const cyberGuides = importAll(require.context('../../../../public/md/CyberGuides', false, /\.md$/));

      const articlesData = {
        CyberArticles: { title: folders.CyberArticles.title, path: folders.CyberArticles.path, files: cyberArticles },
        CyberGuides: { title: folders.CyberGuides.title, path: folders.CyberGuides.path, files: cyberGuides },
      };

      setArticles(articlesData);
    } catch (error) {
      setError('Error loading articles');
      console.error('Error loading markdown files:', error);
    }
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <button 
        className={`toggle-nav-btn ${isOpen ? 'open' : ''}`} 
        onClick={toggleNav}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`sidenav ${!isOpen ? 'closed' : ''}`}>
        {Object.entries(articles).map(([category, data]) => (
          <div key={category} className="category-section">
            <h2>{data.title}</h2>
            <ul>
              {data.files && data.files.map((file, index) => (
                <li key={index}>
                  <Link to={`/${data.path}/${file.path}`}>
                    {file.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default CyberNav;
