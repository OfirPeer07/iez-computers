import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';

import './Markdown-Global.css';    // Base styles must come first
import './ITPages.css';           // IT specific styles second

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

// הוסף פונקציה חדשה
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

// החלף את הפונקציה הקיימת
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

const detectLanguageDirection = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'he' : 'en';
};

const TechnologyNews = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [showBox, setShowBox] = useState(true); // To control the visibility of the box

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                const response = await fetch(`/md/TechnologyNews/${fileName}`);
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error('Error fetching the Markdown file:', error);
            }
        };

        if (fileName) {
            fetchMarkdownFile();
        }
    }, [fileName]);

    return (
        <div className="it-container it-page-layout"> {/* הוספת class חדש */}
            {/* Add a wrapper div to contain the content and allow proper expansion */}
            <div className="content-wrapper">
                <SideNav /> {/* Render the SideNav for easy navigation */}

                {/* RTL Box Section */}
                {showBox && (
                    <div className="rtl-box">
                        <button className="close-btn" onClick={() => setShowBox(false)}>×</button>
                        <p>
                            צללו לעולם הטכנולוגיה עם מאמרינו המקיפים והמעניינים.
                        </p>
                        <p>
                            מחומרה ותוכנה ועד טרנדים עדכניים בעולם ההייטק, כאן תמצאו מידע מגוון ועשיר שיעשיר את הידע שלכם ויפתח בפניכם אופקים חדשים בעולם המחשבים המתפתח.
                        </p>
                    </div>
                )}

                {/* שינוי שם ה-class מ-it-markdown-content ל-markdown-content */}
                <div className="markdown-content" lang={detectLanguageDirection(content)}>
                    {!content && <p>Loading...</p>}
                    {content && (
                        <ReactMarkdown
                            children={content}
                            rehypePlugins={[rehypeRaw]}
                            remarkPlugins={[remarkGfm, remarkEmoji]}
                            components={{
                                h1: ({node, children, ...props}) => {
                                    const lang = detectLanguageDirection(String(children));
                                    return (
                                        <h1 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                            {children}
                                        </h1>
                                    );
                                },
                                h2: ({node, children, ...props}) => {
                                    const lang = detectLanguageDirection(String(children));
                                    return (
                                        <h2 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                            {children}
                                        </h2>
                                    );
                                },
                                h3: ({node, children, ...props}) => {
                                    const lang = detectLanguageDirection(String(children));
                                    return (
                                        <h3 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                            {children}
                                        </h3>
                                    );
                                },
                                // עדכון הטיפול בפסקאות
                                p: ({node, children, ...props}) => {
                                  const lang = detectLanguageDirection(String(children));
                                  return (
                                    <p {...props} lang={lang} className={`markdown-paragraph ${lang}`}>
                                      {children} 
                                    </p>
                                  );
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

export default TechnologyNews;