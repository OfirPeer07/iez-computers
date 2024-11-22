import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams, Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import ArticlesList from './ArticlesList';

// CSS imports order is important!
import './Markdown-Global.css';    // 1. Base styles
import './CyberPages.css';        // 2. Cyber specific layout

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

const CyberGuides = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fileName) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/md/CyberGuides/${fileName}`);
          if (!response.ok) throw new Error('Content not found');
          const text = await response.text();
          
          // Improved metadata stripping
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
    <div className="cyber-wrapper">
      <div className="cyber-page-layout">
        <SideNav />
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
            basePath="hacking/cyber-guides"
            defaultCategory="Cyber Guide"
          />
        )}
      </div>
    </div>
  );
};

export default CyberGuides;
