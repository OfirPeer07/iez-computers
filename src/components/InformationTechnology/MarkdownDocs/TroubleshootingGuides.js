import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import InfoTechNav from '../InfoTechNav/InfoTechNav';
import ArticlesList from './ArticlesList';
import './ITPages.css';

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

const splitTextAndWrap = (text) => {
  if (typeof text !== 'string') return text;
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
  return (
    <span style={{ 
      display: 'block',
      direction: parentLang === 'en' ? 'ltr' : 'rtl',
      textAlign: parentLang === 'en' ? 'left' : 'right',
      width: '100%'
    }}>
      {splitTextAndWrap(children, isHeading)}
    </span>
  );
};

const detectLanguageDirection = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  return /[\u0590-\u05FF]/.test(text) ? 'he' : 'en';
};

const TroubleshootingGuides = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);  
    const [showBox, setShowBox] = useState(true);  // Add this line

    useEffect(() => {
        if (fileName) {
            const fetchContent = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/md/TroubleshootingGuides/${fileName}`);
                    if (!response.ok) throw new Error('Content not found');
                    const text = await response.text();
                    
                    // Add metadata stripping
                    const contentWithoutMeta = text.replace(/^---[\s\S]*?---\s*\n*/m, '');
                    setContent(contentWithoutMeta);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    setContent('');
                } finally {
                    setLoading(false);
                }
            };

            fetchContent();
        }
    }, [fileName]);

    return (
        <div className="it-container it-page-layout">
            {!fileName && showBox && (
                <div className="rtl-box">
                    <button className="close-btn" onClick={() => setShowBox(false)}>×</button>
                    <p>נתקלתם בבעיה? אל דאגה! במדור זה תמצאו מדריכים פשוטים וברורים לפתרון תקלות נפוצות במחשב.</p>
                    <p>עם הסברים מפורטים צעד אחר צעד, נעזור לכם להתגבר על מכשולים טכניים ולהחזיר את המחשב שלכם לפעולה מהירה ויעילה.</p>
                </div>
            )}

            <div className="content-wrapper">
                <InfoTechNav />
                {fileName ? (
                    <div className="markdown-content">
                        {loading && <p>Loading...</p>}
                        {error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <ReactMarkdown
                                children={content}
                                rehypePlugins={[rehypeRaw]}
                                remarkPlugins={[remarkGfm, remarkEmoji]}
                                components={{
                                    h1: ({node, children, ...props}) => {
                                      const lang = detectLanguageDirection(String(children));
                                      return <h1 {...props} dir={lang === 'en' ? 'ltr' : 'rtl'}>{wrapWithLanguage(children, lang, true)}</h1>;
                                    },
                                    h2: ({node, children, ...props}) => {
                                      const lang = detectLanguageDirection(String(children));
                                      return <h2 {...props} dir={lang === 'en' ? 'ltr' : 'rtl'}>{wrapWithLanguage(children, lang, true)}</h2>;
                                    },
                                    h3: ({node, children, ...props}) => {
                                      const lang = detectLanguageDirection(String(children));
                                      return <h3 {...props} dir={lang === 'en' ? 'ltr' : 'rtl'}>{wrapWithLanguage(children, lang, true)}</h3>;
                                    },
                                    p: ({node, children, ...props}) => {
                                      const lang = detectLanguageDirection(String(children));
                                      return <p {...props} dir={lang === 'en' ? 'ltr' : 'rtl'}>{wrapWithLanguage(children, lang)}</p>;
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
                ) : (
                    <ArticlesList 
                        folderName="TroubleshootingGuides"
                        basePath="information-technology/troubleshooting-guides"
                        defaultCategory="Troubleshooting"
                    />
                )}
            </div>
        </div>
    );
};

export default TroubleshootingGuides;