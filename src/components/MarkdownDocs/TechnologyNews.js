import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './MarkdownDocs.css';

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
        <div className="container">
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

            <div className="markdown-content" lang={detectLanguageDirection(content)}>
                {!content && <p>Loading...</p>}
                {content && (
                    <ReactMarkdown
                        children={content}
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm, remarkEmoji]}
                        components={{
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
    );
};

const detectLanguageDirection = (text) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'he' : 'en';
};

export default TechnologyNews;