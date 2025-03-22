import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import '../MarkdownDocs/Markdown-Global.css';
import RecommendedArticles from './RecommendedArticles';

const MarkdownDocs = () => {
    const { fileName } = useParams(); 
    const location = useLocation();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
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

    // פונקציה לזיהוי כיוון הטקסט
    const detectLanguageDirection = (text) => {
        const hebrewRegex = /[\u0590-\u05FF]/; 
        return hebrewRegex.test(text) ? 'rtl' : 'ltr';
    };

    const direction = detectLanguageDirection(content);

    const handleLinkRendering = ({ node, children, href, ...props }) => {
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

    const handleParagraphRendering = ({ node, children, ...props }) => {
        const paragraphText = children.toString();
        const containsHebrew = /[\u0590-\u05FF]/.test(paragraphText);
        const hasLink = React.Children.toArray(children).some(child => 
            child && typeof child === 'object' && child.type === 'a'
        );
        
        if (containsHebrew) {
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
        <div className="markdown-docs-container">
            <div className="recommended-articles-section">
                {showRecommendedArticles && <RecommendedArticles articles={recommendedArticles} />}
            </div>
            <div className="markdown-docs" dir={direction}>
                <ReactMarkdown
                    children={content}
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm, remarkEmoji]}
                    components={{
                        a: handleLinkRendering,
                        p: handleParagraphRendering
                    }}
                />
            </div>
        </div>
    );
};

export default MarkdownDocs;
