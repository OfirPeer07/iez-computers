import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CyberNav.css';

const CyberNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false); // למעקב אחרי כיוון הגלילה

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

    // פונקציה חדשה שמשתמשת ב-API במקום ב-require.context
    const fetchFilesFromAPI = async (folderName) => {
      try {
        // ננסה להשתמש ב-API PHP תחילה
        const apiResponse = await fetch(`/md-files.php?folder=${folderName}`);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.files && data.files.length > 0) {
            console.log(`Found ${data.files.length} MD files via PHP API for NAV (${folderName}):`, data.files);
            return data.files.map(file => ({
              title: file.name.replace('.md', '').replace(/-/g, ' '),
              path: file.name
            }));
          }
        }
        // אם ה-API נכשל, ננסה את השיטה הישנה
        return fallbackToWebpack(folderName);
      } catch (error) {
        console.log('PHP API not available for NAV, trying webpack method:', error);
        return fallbackToWebpack(folderName);
      }
    };

    // פונקציית גיבוי שמשתמשת בשיטה הישנה
    const fallbackToWebpack = (folderName) => {
      try {
        if (folderName === 'CyberArticles') {
          return importAll(require.context('../../../../public/md/CyberArticles', false, /\.md$/));
        } else if (folderName === 'CyberGuides') {
          return importAll(require.context('../../../../public/md/CyberGuides', false, /\.md$/));
        }
        return [];
      } catch (error) {
        console.error(`Error in webpack fallback for ${folderName}:`, error);
        return [];
      }
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

    // פונקציה שמאחדת את כל המידע
    const loadAllFiles = async () => {
      try {
        const cyberArticles = await fetchFilesFromAPI('CyberArticles');
        const cyberGuides = await fetchFilesFromAPI('CyberGuides');

        const articlesData = {
          CyberArticles: { title: folders.CyberArticles.title, path: folders.CyberArticles.path, files: cyberArticles },
          CyberGuides: { title: folders.CyberGuides.title, path: folders.CyberGuides.path, files: cyberGuides },
        };

        setArticles(articlesData);
      } catch (error) {
        setError('Error loading articles');
        console.error('Error loading markdown files:', error);
      }
    };

    loadAllFiles();
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      setIsScrollingDown(true); // אם הגלילה למטה
    } else {
      setIsScrollingDown(false); // אם הגלילה למעלה
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <button 
        className={`toggle-nav-btn ${isOpen ? 'open' : ''} ${isScrollingDown ? 'hidden' : ''}`} 
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
                  <Link to={`/${data.path}/${file.path}`} onClick={toggleNav}>
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
