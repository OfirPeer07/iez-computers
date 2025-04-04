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
import './MetadataStyles.css';

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

// Function to parse YAML frontmatter
const parseYamlFrontmatter = (text) => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = frontmatterRegex.exec(text);
  
  if (!match) return { content: text, metadata: {} };
  
  const frontmatter = match[1];
  const content = text.replace(frontmatterRegex, '');
  
  // Parse the YAML frontmatter into an object
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^"(.*)"$/, '$1');
      metadata[key] = value;
    }
  });
  
  return { content, metadata };
};

// Component to display metadata
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

const TechnologyNews = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);  // Changed to false by default
    const [showBox, setShowBox] = useState(true);

    useEffect(() => {
        if (fileName) {
            const fetchContent = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/md/TechnologyNews/${fileName}`);
                    if (!response.ok) throw new Error('Content not found');
                    const text = await response.text();
                    
                    // Parse metadata instead of stripping it
                    const { content: parsedContent, metadata: parsedMetadata } = parseYamlFrontmatter(text);
                    setContent(parsedContent);
                    setMetadata(parsedMetadata);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    setContent('');
                    setMetadata({});
                } finally {
                    setLoading(false);
                }
            };

            fetchContent();
        }
    }, [fileName]);

    return (
        <div className="it-container">
            {!fileName && showBox && (
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

            <div className="content-wrapper">
                <InfoTechNav />
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
                            </>
                        )}
                    </div>
                ) : (
                    <ArticlesList 
                        folderName="TechnologyNews"
                        basePath="information-technology/technology-news"
                        defaultCategory="Tech News"
                    />
                )}
            </div>
        </div>
    );
};

export default TechnologyNews;