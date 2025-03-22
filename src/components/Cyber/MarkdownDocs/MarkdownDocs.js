import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom'; 
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji'; 
import '../MarkdownDocs/Markdown-Global.css';
import RecommendedArticles from './RecommendedArticles';

function MarkdownDocs() {
    const { fileName } = useParams(); 
    const location = useLocation(); 
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                if (!fileName) {
                    return;
                }
                const response = await fetch(`../../../../public/md/${fileName}`); 
                if (!response.ok) {
                    throw new Error('Error fetching the Markdown file.');
                }
                const text = await response.text();
                setContent(text);
            } catch (error) {
                setError('Could not load the markdown file.');
                console.error('Error fetching the Markdown file:', error);
            } finally {
                setLoading(false);
            }
        };

        if (fileName) {
            fetchMarkdownFile();
        }
    }, [fileName]);

    const detectLanguageDirection = (text) => {
        const hebrewRegex = /[\u0590-\u05FF]/; 
        return hebrewRegex.test(text) ? 'rtl' : 'ltr';
    };

    const direction = detectLanguageDirection(content);

    // Simple component for handling links with Hebrew content
    const handleLinkRendering = ({ node, children, href, ...props }) => {
        // Check if link contains Hebrew content
        const containsHebrew = /[\u0590-\u05FF]/.test(children.toString());
        
        if (containsHebrew) {
            return (
                <a href={href} {...props} dir="rtl" lang="he">
                    {children}
                </a>
            );
        }
        
        return <a href={href} {...props}>{children}</a>;
    };

    const handleImageRendering = ({ node, ...props }) => {
        const imgStyle = isMobile ? { maxWidth: '100%', height: 'auto' } : {};
        return <img {...props} style={imgStyle} loading="lazy" />;
    };

    const handleHeadingRendering = ({ node, level, ...props }) => {
        const HeadingTag = `h${level}`;
        const headingStyle = isMobile ? { fontSize: `${1.8 - (level * 0.2)}rem` } : {};
        return <HeadingTag {...props} style={headingStyle} />;
    };

    const handleTableRendering = ({ node, ...props }) => {
        const tableStyle = isMobile ? { display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' } : {};
        return <table {...props} style={tableStyle} />;
    };

    // טיפול בפסקאות - גישה שמטפלת בסדר הנכון של תוכן
    const handleParagraphRendering = ({ node, children, ...props }) => {
        // בדיקה אם הפסקה מכילה עברית
        const paragraphText = children.toString();
        const containsHebrew = /[\u0590-\u05FF]/.test(paragraphText);
        
        // בדיקה אם הפסקה מכילה קישור
        const hasLink = React.Children.toArray(children).some(child => 
            child && typeof child === 'object' && child.type === 'a'
        );
        
        if (containsHebrew) {
            // פסקה בעברית
            return (
                <p 
                    {...props} 
                    dir="rtl" 
                    lang="he" 
                    style={{ 
                        textAlign: "right",
                        direction: "rtl",
                        marginBottom: hasLink ? "2em" : "inherit"
                    }}
                >
                    {children}
                </p>
            );
        }
        
        // פסקה באנגלית
        return (
            <p 
                {...props}
                style={{
                    marginBottom: hasLink ? "2em" : "inherit"
                }}
            >
                {children}
            </p>
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const recommendedArticles = [
        {
            title: "Cybersecurity Basics",
            summary: "Learn the fundamentals of staying safe online.",
            link: "/cyber/hacking/guides/cybersecurity-basics",
        },
        {
            title: "Advanced Hacking Techniques",
            summary: "Explore the latest methods used in ethical hacking.",
            link: "/cyber/hacking/articles/advanced-techniques",
        },
    ];

    const showRecommendedArticles = location.pathname.includes('/cyber/hacking/articles') || location.pathname.includes('/cyber/hacking/guides');

    return (
        <div className={`markdown-docs-container ${isMobile ? 'mobile-view' : ''}`}>
            <div className="recommended-articles-section">
                {showRecommendedArticles && <RecommendedArticles articles={recommendedArticles} />}
            </div>
            <div className="markdown-docs" dir={direction} ref={contentRef}>
                <ReactMarkdown
                    children={content}
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm, remarkEmoji]}
                    components={{
                        img: handleImageRendering,
                        h1: props => handleHeadingRendering({ ...props, level: 1 }),
                        h2: props => handleHeadingRendering({ ...props, level: 2 }),
                        h3: props => handleHeadingRendering({ ...props, level: 3 }),
                        h4: props => handleHeadingRendering({ ...props, level: 4 }),
                        h5: props => handleHeadingRendering({ ...props, level: 5 }),
                        h6: props => handleHeadingRendering({ ...props, level: 6 }),
                        table: handleTableRendering,
                        a: handleLinkRendering,
                        p: handleParagraphRendering
                    }}
                />
            </div>
        </div>
    );
}

export default MarkdownDocs;
