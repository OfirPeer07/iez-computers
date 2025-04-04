import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // הוספנו את useLocation כדי לבדוק את הנתיב הנוכחי
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji'; // ודא שהתקנת את החבילה הזו
import '../MarkdownDocs/Markdown-Global.css';
import RecommendedArticles from './RecommendedArticles';

const MarkdownDocs = () => {
    const { fileName } = useParams(); // מקבלים את שם הקובץ מה-URL
    const location = useLocation(); // מקבלים את הנתיב הנוכחי
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                const response = await fetch(`../../../../public/md/${fileName}`); // ודא שהקובץ קיים בתיקיית 'public/md'
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
        const hebrewRegex = /[\u0590-\u05FF]/; // ביטוי רגולרי לתוים בעברית
        return hebrewRegex.test(text) ? 'rtl' : 'ltr';
    };

    // זיהוי כיוון הטקסט על פי התוכן
    const direction = detectLanguageDirection(content);

    // רכיב פשוט לטיפול בלינקים
    const handleLinkRendering = ({ node, children, href, ...props }) => {
        // בדיקה אם הלינק מכיל תוכן בעברית
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

    // תנאי להציג את רכיב RecommendedArticles רק בנתיבים הרצויים
    const showRecommendedArticles = location.pathname.includes('/cyber/hacking/articles') || location.pathname.includes('/cyber/hacking/guides');

    return (
        <div className="markdown-docs-container">
            <div className="recommended-articles-section">
                {/* הצגת רכיב RecommendedArticles רק אם הנתיב נכון */}
                {showRecommendedArticles && <RecommendedArticles articles={recommendedArticles} />}
            </div>
            <div className="markdown-docs" dir={direction}>
                {/* תוכן ה-Markdown */}
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
