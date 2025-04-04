import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArticlesList.css';

const ArticlesList = ({ folderName, basePath, defaultCategory }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        
        // Try to use the PHP API first (works with files added directly to build folder)
        try {
          const apiResponse = await fetch(`/md-files.php?folder=${folderName}`);
          if (apiResponse.ok) {
            const data = await apiResponse.json();
            if (data.files && data.files.length > 0) {
              console.log(`Found ${data.files.length} MD files via PHP API for ${folderName}:`, data.files);
              await processApiFiles(data.files);
              return;
            }
          }
        } catch (apiError) {
          console.log('PHP API not available, trying webpack method:', apiError);
          loadArticlesFromWebpack();
          return;
        }
        
        // Fallback to webpack method if API fails
        loadArticlesFromWebpack();
        
      } catch (err) {
        console.error('Error loading articles:', err);
        // Fallback to webpack method if all else fails
        loadArticlesFromWebpack();
      }
    };
    
    // Process files from API endpoint
    const processApiFiles = async (files) => {
      try {
        const articlePromises = files.map(async (file) => {
          try {
            const mdResponse = await fetch(file.path);
            const content = await mdResponse.text();
            
            // Improved metadata extraction
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

            // Generate a fallback title if none exists in metadata
            const fallbackTitle = file.name
              .replace('.md', '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase());

            return {
              slug: file.name.replace('.md', ''),
              title: metadata.title || metadata.כותרת || fallbackTitle,
              date: metadata.date || metadata.תאריך || new Date().toISOString(),
              description: metadata.description || metadata.תיאור || '',
              thumbnail: metadata.thumbnail || metadata.תמונה ? `/${metadata.thumbnail || metadata.תמונה}` : '/images/default-article-thumb.jpg',
              category: metadata.category || metadata.קטגוריות ? metadata.category || metadata.קטגוריות.split(',')[0].trim() : defaultCategory,
              author: metadata.author || metadata.מחבר || ''
            };
          } catch (err) {
            console.error(`Error loading ${file.name}:`, err);
            return null;
          }
        });

        const loadedArticles = (await Promise.all(articlePromises)).filter(Boolean);
        
        // Sort articles by date (newest first)
        const sortedArticles = loadedArticles
          .filter(article => article.title)
          .sort((a, b) => {
            // Try to parse dates, fallback to string comparison
            try {
              return new Date(b.date) - new Date(a.date);
            } catch (e) {
              return b.date.localeCompare(a.date);
            }
          });
        
        setArticles(sortedArticles);
        setLoading(false);
      } catch (err) {
        console.error('Error processing API files:', err);
        loadArticlesFromWebpack();
      }
    };
    
    const loadArticlesFromWebpack = async () => {
      try {
        // Fallback to the old webpack require.context method
        const context = require.context('../../../../public/md', true, /\.md$/);
        const fileNames = context.keys()
          .filter(key => key.includes(`/${folderName}/`));
        
        if (!fileNames.length) {
          setError('No articles found');
          setLoading(false);
          return;
        }

        const articlePromises = fileNames.map(async (fileName) => {
          const response = await fetch(`/md/${fileName.slice(2)}`);
          const content = await response.text();
          
          // Improved metadata extraction
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

          // Generate a fallback title if none exists in metadata
          const fallbackTitle = fileName
            .split('/')
            .pop()
            .replace('.md', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

          return {
            slug: fileName.split('/').pop().replace('.md', ''),
            title: metadata.title || metadata.כותרת || fallbackTitle,
            date: metadata.date || metadata.תאריך || new Date().toISOString(),
            description: metadata.description || metadata.תיאור || '',
            thumbnail: metadata.thumbnail || metadata.תמונה ? `/${metadata.thumbnail || metadata.תמונה}` : '/images/default-article-thumb.jpg',
            category: metadata.category || metadata.קטגוריות ? metadata.category || metadata.קטגוריות.split(',')[0].trim() : defaultCategory,
            author: metadata.author || metadata.מחבר || ''
          };
        });

        const loadedArticles = await Promise.all(articlePromises);
        
        // Sort articles by date (newest first)
        const sortedArticles = loadedArticles
          .filter(article => article.title)
          .sort((a, b) => {
            // Try to parse dates, fallback to string comparison
            try {
              return new Date(b.date) - new Date(a.date);
            } catch (e) {
              return b.date.localeCompare(a.date);
            }
          });
        
        setArticles(sortedArticles);
        
      } catch (err) {
        console.error('Error loading articles from webpack context:', err);
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

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h3>{error}</h3>
        <p>Try refreshing the page or come back later.</p>
      </div>
    );
  }

  // Articles grid
  return (
    <div className={`articles-container ${isMobile ? 'mobile-view' : ''}`}>
      {articles.map((article, index) => (
        <Link 
          to={`/${basePath}/${article.slug}.md`} 
          key={article.slug || index}
          className="article-link"
          onClick={(e) => {
            // Add touch feedback for mobile
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