import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams, Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './MarkdownDocs.css';
import './CyberPages.css';

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

const splitTextAndWrap = (text, isHeading = false) => {
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
      <span key={index} lang="en" className="en-text">
        {part}
      </span>
    ) : part;
  });
};

const wrapWithLanguage = (children, lang, isHeading = false) => {
  if (typeof children !== 'string') return children;
  return (
    <span className={`text-wrapper ${lang} ${isHeading ? 'heading' : ''}`}>
      {splitTextAndWrap(children, isHeading)}
    </span>
  );
};

const detectLanguageDirection = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'he' : 'en';
};

const CyberGuides = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/md/CyberGuides/${fileName}`);
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

        if (fileName) {
            fetchMarkdownFile();
        }
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
                            remarkPlugins={[remarkGfm, remarkEmoji]}
                            components={{
                                h1: ({node, children, ...props}) => {
                                  const lang = detectLanguageDirection(String(children));
                                  return (
                                    <h1 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                      {wrapWithLanguage(children, lang, true)}
                                    </h1>
                                  );
                                },
                                h2: ({node, children, ...props}) => {
                                  const lang = detectLanguageDirection(String(children));
                                  return (
                                    <h2 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                      {wrapWithLanguage(children, lang, true)}
                                    </h2>
                                  );
                                },
                                h3: ({node, children, ...props}) => {
                                  const lang = detectLanguageDirection(String(children));
                                  return (
                                    <h3 {...props} lang={lang} className={`markdown-heading ${lang}`}>
                                      {wrapWithLanguage(children, lang, true)}
                                    </h3>
                                  );
                                },
                                p: ({node, children, ...props}) => {
                                  const lang = detectLanguageDirection(String(children));
                                  return (
                                    <p {...props} lang={lang} className={lang}>
                                      {wrapWithLanguage(children, lang)}
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

export default CyberGuides;
