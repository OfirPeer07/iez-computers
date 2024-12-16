import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SimilarArticles.css';

const extractMetadata = (markdown) => {
  const metadata = {
    title: '',
    date: null,
    description: '',
    thumbnail: '',
    category: ''
  };

  const lines = markdown.split('\n');
  let inMetadata = false;

  if (lines[0]?.trim() === '---') {
    inMetadata = true;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        break;
      }
      const [key, ...valueParts] = lines[i].split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    }
  }

  return metadata;
};

const SimilarArticles = ({ currentSlug }) => {
  const [similarArticles, setSimilarArticles] = useState([]);

  useEffect(() => {
    const loadSimilarArticles = async () => {
      try {
        const context = require.context('/md/CyberArticles', false, /\.md$/);
        const articlePromises = context.keys().map(async (fileName) => {
          if (currentSlug && fileName.includes(currentSlug)) return null;
          
          const response = await fetch(`/md/CyberArticles/${fileName.replace('./', '')}`);
          const content = await response.text();
          const metadata = extractMetadata(content);
          
          return {
            slug: fileName.replace('./', '').replace('.md', ''),
            title: metadata.title || 'כתבה ללא כותרת',
            thumbnail: metadata.thumbnail || '/images/default-article-thumb.jpg',
            description: metadata.description || '',
            date: metadata.date || new Date().toISOString()
          };
        });

        let loadedArticles = (await Promise.all(articlePromises))
          .filter(Boolean)
          .sort(() => Math.random() - 0.5);

        loadedArticles = loadedArticles.slice(0, 2);
        
        setSimilarArticles(loadedArticles);
      } catch (error) {
        console.error('Error loading similar articles:', error);
      }
    };

    loadSimilarArticles();
  }, [currentSlug]);

  if (!similarArticles.length) return null;

  return (
    <aside className="similar-articles">
      <h3>כתבות נוספות שיעניינו אותך</h3>
      {similarArticles.map((article) => (
        <Link 
          to={`/cyber/hacking/articles/${article.slug}.md`} 
          key={article.slug}
          className="similar-article-card"
        >
          <div className="similar-article-thumb">
            <img 
              src={article.thumbnail} 
              alt="" 
              loading="lazy"
              onError={(e) => {
                e.target.src = '/images/default-article-thumb.jpg';
              }}
            />
          </div>
          <div className="similar-article-content">
            <h4>{article.title}</h4>
            <p>{article.description}</p>
          </div>
        </Link>
      ))}
    </aside>
  );
};

export default SimilarArticles;
