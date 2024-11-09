import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [articles, setArticles] = useState({});

  useEffect(() => {
    const folders = {
      'CyberArticles': { 
        title: 'Cyber Articles',
        path: 'hacking/cyber-articles'
      },
      'CyberGuides': { 
        title: 'Cyber Guides',
        path: 'hacking/cyber-guides'
      },
      'TechnologyNews': { 
        title: 'Technology News',
        path: 'information-technology-department/technology-news'
      },
      'TroubleshootingGuides': { 
        title: 'Troubleshooting Guides',
        path: 'information-technology-department/troubleshooting-guides'
      }
    };

    const importAll = (r) => {
      return r.keys().map((fileName) => ({
        title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
        path: fileName.replace('./', '')
      }));
    };

    try {
      const cyberArticles = importAll(require.context('../../../public/md/CyberArticles', false, /\.md$/));
      const cyberGuides = importAll(require.context('../../../public/md/CyberGuides', false, /\.md$/));
      const techNews = importAll(require.context('../../../public/md/TechnologyNews', false, /\.md$/));
      const troubleshooting = importAll(require.context('../../../public/md/TroubleshootingGuides', false, /\.md$/));

      setArticles({
        CyberArticles: { title: folders.CyberArticles.title, path: folders.CyberArticles.path, files: cyberArticles },
        CyberGuides: { title: folders.CyberGuides.title, path: folders.CyberGuides.path, files: cyberGuides },
        TechnologyNews: { title: folders.TechnologyNews.title, path: folders.TechnologyNews.path, files: techNews },
        TroubleshootingGuides: { title: folders.TroubleshootingGuides.title, path: folders.TroubleshootingGuides.path, files: troubleshooting }
      });
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
              {data.files.map((file, index) => (
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

export default SideNav;
