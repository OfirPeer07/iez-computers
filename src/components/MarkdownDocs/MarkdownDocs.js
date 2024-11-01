import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import './MarkdownDocs.css';

const MarkdownDocs = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                const response = await fetch(`/md/${fileName}`);
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

    // Function to determine text direction based on content
    const detectLanguageDirection = (text) => {
        const hebrewRegex = /[\u0590-\u05FF]/; // Regex for Hebrew characters
        return hebrewRegex.test(text) ? 'rtl' : 'ltr';
    };

    // Determine the text direction based on content
    const direction = detectLanguageDirection(content);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="markdown-docs" dir={direction}>
            <ReactMarkdown
                children={content}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm, remarkEmoji]}
            />
        </div>
    );
};

export default MarkdownDocs;
