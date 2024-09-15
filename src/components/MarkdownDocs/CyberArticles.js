import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useParams } from 'react-router-dom';
import './MarkdownDocs.css';

const CyberArticles = () => {
    const { fileName } = useParams();
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchMarkdownFile = async () => {
            try {
                const response = await fetch(`/md/CyberArticles/${fileName}`);
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
            <header className="article-header">
                <h1>Introduction to Cybersecurity</h1>
                <p>Exploring the world of hacking and cyber defense.</p>
            </header>

            <section className="article-content markdown-docs">
                <ReactMarkdown
                    children={content}
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm, remarkEmoji]}
                />
            </section>
        </div>
    );
};

export default CyberArticles;
