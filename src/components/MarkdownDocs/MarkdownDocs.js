import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // הוספנו את useLocation כדי לבדוק את הנתיב הנוכחי
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji'; // ודא שהתקנת את החבילה הזו
import '../../styles/Markdown-Global.css';
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
                const response = await fetch(`/md/${fileName}`); // ודא שהקובץ קיים בתיקיית 'public/md'
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
            link: "/hacking/cyber-guides/cybersecurity-basics",
        },
        {
            title: "Advanced Hacking Techniques",
            summary: "Explore the latest methods used in ethical hacking.",
            link: "/hacking/cyber-articles/advanced-techniques",
        },
        {
            title: "IT Troubleshooting Guide",
            summary: "Solve common IT problems efficiently.",
            link: "/information-technology-department/troubleshooting-guides",
        },
    ];

    // תנאי להציג את רכיב RecommendedArticles רק בנתיבים הרצויים
    const showRecommendedArticles = location.pathname.includes('/hacking/cyber-articles') || location.pathname.includes('/hacking/cyber-guides');

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
                />
            </div>
        </div>
    );
};

export default MarkdownDocs;
