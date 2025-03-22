import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArticlesList.css';

const ArticlesList = ({ folderName, basePath, defaultCategory }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const context = require.context('../../../../public/md', true, /\.md$/);
        const fileNames = context.keys()
          .filter(key => key.includes(`/${folderName}/`));
        
        if (!fileNames.length) {
          setError('No articles found');
          return;
        }

        const articlePromises = fileNames.map(async (fileName) => {
          const response = await fetch(`/md/${fileName.slice(2)}`);
          const content = await response.text();
          
          let metadata = {};
          const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
          
          if (metadataMatch) {
            const metadataContent = metadataMatch[1];
            metadata = metadataContent.split('\n').reduce((acc, line) => {
              const [key, ...values] = line.split(':');
              if (key && values.length) {
                acc[key.trim()] = values.join(':').trim();
              }
              return acc;
            }, {});
          }

          const fallbackTitle = fileName
            .split('/')
            .pop()
            .replace('.md', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

          return {
            slug: fileName.split('/').pop().replace('.md', ''),
            title: metadata.כותרת || fallbackTitle,
            date: metadata.תאריך || new Date().toISOString(),
            description: metadata.תיאור || '',
            thumbnail: metadata.תמונה ? `/${metadata.תמונה}` : '/images/default-article-thumb.jpg',
            category: metadata.קטגוריות ? metadata.קטגוריות.split(',')[0].trim() : defaultCategory,
            author: metadata.מחבר || ''
          };
        });

        const loadedArticles = await Promise.all(articlePromises);
        
        const sortedArticles = loadedArticles
          .filter(article => article.title)
          .sort((a, b) => {
            try {
              return new Date(b.date) - new Date(a.date);
            } catch (e) {
              return b.date.localeCompare(a.date);
            }
          });
        
        setArticles(sortedArticles);
        
      } catch (err) {
        console.error('Error loading articles:', err);
        setError(err.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [folderName, basePath, defaultCategory]);

  // Single loading skeleton
  if (loading) {
    return (
      <div className="articles-container">
        <div className="article-link article-skeleton">
          <div className="article-thumb skeleton"></div>
          <div className="article-content">
            <div className="article-meta skeleton"></div>
            <h2 className="skeleton"></h2>
            <p className="article-description skeleton"></p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>😕 {error}</h3>
        <p>Try refreshing the page or come back later.</p>
      </div>
    );
  }

  return (
    <div className={`articles-container ${isMobile ? 'mobile-view' : ''}`}>
      {articles.map((article, index) => (
        <Link 
          to={`/${basePath}/${article.slug}.md`} 
          key={article.slug || index}
          className="article-link"
          onClick={(e) => {
            if (isMobile) {
              const target = e.currentTarget;
              target.style.transform = 'scale(0.98)';
              setTimeout(() => {
                target.style.transform = '';
              }, 150);
            }
          }}
        >
          <article className="article-item">
            {article.category && (
              <span className="article-category">{article.category}</span>
            )}
            <div className="article-thumb">
              <img 
                src={article.thumbnail} 
                alt={article.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/default-article-thumb.jpg';
                }}
              />
            </div>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime={article.date}>
                  {article.date}
                </time>
              </div>
              <h2>{article.title}</h2>
              {article.description && <p className="article-description">{article.description}</p>}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default ArticlesList;