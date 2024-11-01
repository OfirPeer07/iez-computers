import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import './MarkdownDocs.css';

const TroubleshootingGuides = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [showBox, setShowBox] = useState(true); // To control the visibility of the box

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                const response = await fetch(`/md/TroubleshootingGuides/${fileName}`);
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
        <div className="markdown-docs">
            {/* RTL Box Section */}
            {showBox && (
                <div className="rtl-box">
                    <button className="close-btn" onClick={() => setShowBox(false)}>×</button>
                    <p>
                        נתקלתם בבעיה? אל דאגה! במדור זה תמצאו מדריכים פשוטים וברורים לפתרון תקלות נפוצות במחשב.
                    </p>
                    <p>    
                        עם הסברים מפורטים צעד אחר צעד, נעזור לכם להתגבר על מכשולים טכניים ולהחזיר את המחשב שלכם לפעולה מהירה ויעילה.
                    </p>
                </div>
            )}

            <ReactMarkdown
                children={content}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm, remarkEmoji]}
            />
        </div>
    );
};

export default TroubleshootingGuides;
