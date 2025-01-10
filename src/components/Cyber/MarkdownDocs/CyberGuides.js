import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams, Link } from 'react-router-dom';
import CyberNav from '../CyberNav/CyberNav';
import ArticlesList from './ArticlesList';

// Import languages for syntax highlighting
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

// CSS imports
import './Markdown-Global.css';    // 1. Base styles
import './CyberPages.css';        // 2. Cyber specific layout

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

const extractMetadata = (markdown) => {
  const metadata = {
    title: '',
    date: null,
    description: '',
    thumbnail: ''
  };

  const lines = markdown.split('\n');
  let contentStart = 0;
  let inMetadata = false;

  // Extract metadata section
  if (lines[0]?.trim() === '---') {
    inMetadata = true;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        contentStart = i + 1;
        break;
      }
      const [key, ...valueParts] = lines[i].split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    }
  }

  return {
    ...metadata,
    content: lines.slice(contentStart).join('\n')
  };
};

const CyberGuides = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBox, setShowBox] = useState(true);

  useEffect(() => {
    if (fileName) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/md/CyberGuides/${fileName}`);
          if (!response.ok) throw new Error('Content not found');
          const text = await response.text();
          const { content: strippedContent } = extractMetadata(text);
          setContent(strippedContent);
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
    <div className="cyber-wrapper">
      {!fileName && showBox && (
        <div className="rtl-box">
          <button className="close-btn" onClick={() => setShowBox(false)}>×</button>
          <p>ברוכים הבאים למדריכי הסייבר שלנו! כאן תמצאו מידע מקיף על אבטחת מידע והגנת סייבר.</p>
          <p>המדריכים מכסים נושאים מגוונים, החל מיסודות האבטחה ועד לטכניקות מתקדמות.</p>
        </div>
      )}
      
      <div className="cyber-page-layout">
        <CyberNav />
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
                  code: ({node, inline, className, children, ...props}) => {
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
            folderName="CyberGuides"
            basePath="cyber/hacking/guides"
            defaultCategory="Cyber Guide"
          />
        )}
      </div>
    </div>
  );
};

export default CyberGuides;
