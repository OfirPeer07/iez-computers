import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CyberNav.css';

const CyberNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState({});

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
      'TechnologyNews': { 
        title: 'Technology News',
        path: 'information-technology/technology-news'
      },
      'TroubleshootingGuides': { 
        title: 'Troubleshooting Guides',
        path: 'information-technology/troubleshooting-guides'
      }
    };

    const importAll = (r) => {
      try {
        const files = r.keys().map((fileName) => ({
          title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
          path: fileName.replace('./', '')
        }));
        console.log('Imported files:', files);
        return files;
      } catch (error) {
        console.warn('Error importing files:', error);
        return [];
      }
    };

    try {
      const cyberArticles = importAll(require.context('../../../../public/md/CyberArticles', false, /\.md$/));
      const cyberGuides = importAll(require.context('../../../../public/md/CyberGuides', false, /\.md$/));
      const techNews = importAll(require.context('../../../../public/md/TechnologyNews', false, /\.md$/));
      const troubleshooting = importAll(require.context('../../../../public/md/TroubleshootingGuides', false, /\.md$/));

      console.log('Loaded articles:', { cyberArticles, cyberGuides, techNews, troubleshooting });

      const articlesData = {
        CyberArticles: { title: folders.CyberArticles.title, path: folders.CyberArticles.path, files: cyberArticles },
        CyberGuides: { title: folders.CyberGuides.title, path: folders.CyberGuides.path, files: cyberGuides },
        TechnologyNews: { title: folders.TechnologyNews.title, path: folders.TechnologyNews.path, files: techNews },
        TroubleshootingGuides: { title: folders.TroubleshootingGuides.title, path: folders.TroubleshootingGuides.path, files: troubleshooting }
      };

      console.log('Setting articles state:', articlesData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Error loading markdown files:', error);
    }
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={`toggle-nav-btn ${isOpen ? 'open' : ''}`} 
        onClick={toggleNav}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
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