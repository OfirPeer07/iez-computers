import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';

// CSS imports order is important!
import './Markdown-Global.css';    // 1. Base styles
import './CyberPages.css';        // 2. Cyber specific layout
import './CyberArticles.css';     // 3. Article specific styles

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
  
  // אם זו כותרת באנגלית, להחזיר כמו שהיא
  if (isHeading && detectLanguageDirection(text) === 'en') {
    return text;
  }

  // רק לטקסט עברי או מעורב
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
  
  // טי��ול מיוחד בכותרות באנגלית
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

  // טיפול בטקסט רגיל
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

const CyberArticles = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdownFile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/md/CyberArticles/${fileName}`);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (error) {
        setError(error.message);
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdownFile();
  }, [fileName]);

  return (
    <div className="cyber-wrapper">
      <div className="cyber-page-layout">
        <SideNav />
        <div className="cyber-description-blocks">
          <Link to="/hacking/cyber-guides">
            <div className="description-box">
              <h3>Cyber Guides</h3>
              <p>Explore various guides and tutorials on cybersecurity topics to enhance your skills.</p>
            </div>
          </Link>
          <Link to="/hacking/cyber-articles">
            <div className="description-box">
              <h3>Cyber Articles</h3>
              <p>Read detailed articles on the latest cybersecurity threats, trends, and insights.</p>
            </div>
          </Link>
          <Link to="/information-technology-department/technology-news">
            <div className="description-box">
              <h3>Technology News</h3>
              <p>Stay updated with the newest advancements and news in technology and IT fields.</p>
            </div>
          </Link>
          <Link to="/information-technology-department/troubleshooting-guides">
            <div className="description-box">
              <h3>Troubleshooting Guides</h3>
              <p>Access guides to solve common technical issues and improve IT efficiency.</p>
            </div>
          </Link>
        </div>
        <div className="markdown-content" lang={detectLanguageDirection(content)}>
          {loading && <p>Loading...</p>}
          {error ? (
            <p className="error">{error}</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberArticles;
