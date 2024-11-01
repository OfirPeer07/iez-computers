import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import './MarkdownDocs.css';
import SideNav from '../SideNav/SideNav';

const CyberArticles = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`/md/CyberArticles/${fileName}`);
                if (!response.ok) {
                    throw new Error('File not found');
                }
                const text = await response.text();
                setContent(text);
            } catch (error) {
                setError('Error fetching the Markdown file.');
                console.error('Error fetching the Markdown file:', error);
            } finally {
                setLoading(false);
            }
        };

        if (fileName) {
            fetchMarkdownFile();
        }
    }, [fileName]);

    return (
        <div className="container">
            <SideNav /> {/* Render the SideNav for easy navigation */}
            <section className="article-content markdown-docs">
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
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

export default CyberArticles;
