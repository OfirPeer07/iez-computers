import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import './MarkdownDocs.css';
import SideNav from '../SideNav/SideNav';

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

            <section className="technology-news-content markdown-docs">
                {!content && <p>Loading...</p>}
                {content && (
                    <ReactMarkdown
                        children={content}
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm, remarkEmoji]}
                    />
                )}
            </section>
        </div>
    );
};

export default TechnologyNews;
