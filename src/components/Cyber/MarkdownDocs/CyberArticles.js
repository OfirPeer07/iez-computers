import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import CyberNav from '../CyberNav/CyberNav';

// CSS imports order is important!
import './Markdown-Global.css';    // 1. Base styles
import './CyberPages.css';        // 2. Cyber specific layout


// Import languages for syntax highlighting
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);

const CodeBlock = ({ className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="code-block-container">
      <button 
        className={`copy-button ${isCopied ? 'copied' : ''}`}
        onClick={copyToClipboard}
      >
        {isCopied ? 'COPIED ✓' : 'COPY'}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#282c34',
          fontSize: '14px',
          lineHeight: '1.5',
          borderRadius: '8px'
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
};

const detectLanguageDirection = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'he' : 'en';
};

const splitTextAndWrap = (text, isHeading = false) => {
  if (typeof text !== 'string') return text;
  
  if (isHeading && detectLanguageDirection(text) === 'en') {
    return text;
  }

  const regex = /(\([^)]+\)|[a-zA-Z-]+(?:\s+[a-zA-Z-]+)*)/g;
  let lastIndex = 0;
  const parts = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(match[0]);
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, index) => {
    const isEnglish = /^[a-zA-Z-\s()]+$/.test(part);
    return isEnglish ? (
      <span
        key={index}
        style={{
          display: 'inline-block',
          direction: 'ltr',
          unicodeBidi: 'embed'
        }}
      >
        {part}
      </span>
    ) : part;
  });
};

const wrapWithLanguage = (children, parentLang, isHeading = false) => {
  if (typeof children !== 'string') return children;
  
  if (isHeading && parentLang === 'en') {
    return (
      <span style={{ 
        display: 'block',
        direction: 'ltr',
        textAlign: 'left',
        width: '100%'
      }}>
        {children}
      </span>
    );
  }

  return (
    <span style={{ 
      display: 'block',
      direction: parentLang === 'en' ? 'ltr' : 'rtl',
      textAlign: parentLang === 'en' ? 'left' : 'right'
    }}>
      {splitTextAndWrap(children, isHeading)}
    </span>
  );
};

const extractMetadata = (markdown) => {
  const metadata = {};
  let content = markdown;

  // Extract metadata section
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = frontmatterRegex.exec(markdown);
  
  if (match) {
    const frontmatter = match[1];
    content = markdown.replace(frontmatterRegex, '');
    
    // Parse the YAML frontmatter into an object
    frontmatter.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^"(.*)"$/, '$1');
        metadata[key] = value;
      }
    });
  }

  return {
    metadata,
    content
  };
};

const ArticleMetadata = ({ metadata }) => {
  if (!metadata || Object.keys(metadata).length === 0) return null;
  
  return (
    <div className="article-metadata" dir="rtl">
      {metadata.כותרת && <h1 className="article-title">{metadata.כותרת}</h1>}
      <div className="article-meta-info">
        {metadata.תאריך && <span className="article-date">📅 {metadata.תאריך}</span>}
        {metadata.מחבר && <span className="article-author">✍️ {metadata.מחבר}</span>}
        {metadata.קטגוריות && (
          <div className="article-categories">
            🏷️ {metadata.קטגוריות.split(',').map(cat => cat.trim()).join(' | ')}
          </div>
        )}
      </div>
      <hr className="metadata-divider" />
    </div>
  );
};

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const context = require.context('../../../../public/md/CyberArticles', true, /\.md$/);
        const articlePromises = context.keys().map(async (fileName) => {
          const response = await fetch(`/md/CyberArticles/${fileName.replace('./', '')}`);
          const content = await response.text();
          const { metadata, content: articleContent } = extractMetadata(content);
          
          // Debug image paths
          console.log("Article metadata:", fileName, metadata);
          console.log("Image path:", metadata.תמונה ? `/${metadata.תמונה}` : '/images/default-article-thumb.jpg');
          
          return {
            slug: fileName.replace('./', '').replace('.md', ''),
            title: metadata.כותרת || fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
            date: metadata.תאריך || null,
            description: articleContent.split('\n')[0].replace(/[#*`]/g, '').slice(0, 150) + '...',
            thumbnail: metadata.תמונה ? `/${metadata.תמונה}` : '/images/default-article-thumb.jpg',
            category: metadata.קטגוריות || 'Cyber Security'
          };
        });

        const loadedArticles = await Promise.all(articlePromises);
        setArticles(loadedArticles.filter(article => article.title));
        setLoading(false);
      } catch (error) {
        console.error('Error loading articles:', error);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="articles-container">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="article-link">
            <div className="article-item">
              <div className="article-thumb article-skeleton"></div>
              <div className="article-content">
                <div className="article-meta article-skeleton" style={{width: '100px', height: '20px'}}></div>
                <p className="article-description article-skeleton" style={{height: '60px'}}></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="articles-container">
      {articles.map((article, index) => (
        <Link 
          to={`/cyber/hacking/articles/${article.slug}.md`} 
          key={index}
          className="article-link"
        >
          <article className="article-item">
            {article.category && (
              <span className="article-category">{article.category}</span>
            )}
            <div className="article-thumb">
              <img 
                src={article.thumbnail} 
                alt="" 
                loading="lazy" 
                onError={(e) => {
                  console.error("Image failed to load:", article.thumbnail);
                  e.target.src = '/images/default-article-thumb.jpg';
                }}
              />
            </div>
            <div className="article-content">
              <div className="article-meta">
                <time dateTime={article.date}>
                  {article.date && new Date(article.date).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h2>{article.title}</h2>
              <p className="article-description">{article.description}</p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

const CyberArticles = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBox, setShowBox] = useState(true);

  useEffect(() => {
    const fetchMarkdownFile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/md/CyberArticles/${fileName}`);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        const { content: parsedContent, metadata: parsedMetadata } = extractMetadata(text);
        setContent(parsedContent);
        setMetadata(parsedMetadata);
        setError(null);
      } catch (error) {
        setError(error.message);
        setContent('');
        setMetadata({});
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      fetchMarkdownFile();
    }
  }, [fileName]);

  return (
    <div className="cyber-wrapper">
      {!fileName && showBox && (
        <div className="rtl-box">
          <button className="close-btn" onClick={() => setShowBox(false)}>×</button>
          <p>ברוכים הבאים למאמרי הסייבר שלנו! כאן תמצאו מאמרים מעמיקים בנושאי אבטחת מידע.</p>
          <p>המאמרים מכסים מגוון רחב של נושאים, מחדשות אבטחה ועד לניתוחי מקרים ומחקרים.</p>
        </div>
      )}

      <div className="cyber-page-layout">
        <CyberNav />
        {fileName ? (
          <div className="markdown-content" lang={detectLanguageDirection(content)}>
            {loading && <p>Loading...</p>}
            {error ? (
              <p className="error">{error}</p>
            ) : (
              <>
                <ArticleMetadata metadata={metadata} />
                <ReactMarkdown
                  children={content}
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, children, ...props}) => {
                      const lang = detectLanguageDirection(String(children));
                      return <h1 {...props}>{wrapWithLanguage(children, lang, true)}</h1>;
                    },
                    h2: ({node, children, ...props}) => {
                      const lang = detectLanguageDirection(String(children));
                      return <h2 {...props}>{wrapWithLanguage(children, lang, true)}</h2>;
                    },
                    h3: ({node, children, ...props}) => {
                      const lang = detectLanguageDirection(String(children));
                      return <h3 {...props}>{wrapWithLanguage(children, lang, true)}</h3>;
                    },
                    p: ({node, children, ...props}) => {
                      const lang = detectLanguageDirection(String(children));
                      return <p {...props} lang={lang}>{wrapWithLanguage(children, lang, false)}</p>;
                    },
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock className={className} {...props}>
                          {children}
                        </CodeBlock>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                />
              </>
            )}
          </div>
        ) : (
          <ArticlesList 
          folderName="CyberArticles"
          basePath="cyber/hacking/articles"
          defaultCategory="Cyber Articles"
          />
        )}
      </div>
    </div>
  );
};

export default CyberArticles;