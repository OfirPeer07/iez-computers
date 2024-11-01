import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css'; // Custom styles for Cyber design

const SideNav = () => {
  const [cyberArticles, setCyberArticles] = useState([]);
  const [cyberGuides, setCyberGuides] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [troubleshootingGuides, setTroubleshootingGuides] = useState([]);

  // Function to extract title from markdown content using regex
  const extractTitleFromContent = (content) => {
    const titleMatch = content.match(/^(#|##)\s*(.*)/);
    return titleMatch ? titleMatch[2] : null;
  };

  // Load markdown files from the public folder and extract titles
  const loadMarkdownFiles = useCallback(async (folder, setState) => {
    try {
      const fileNames = [
        'file1.md', // Replace these with actual filenames
        'file2.md',
        'file3.md'
      ];

      for (const file of fileNames) {
        const response = await fetch(`${process.env.PUBLIC_URL}/md/${folder}/${file}`);
        const content = await response.text();
        const title = extractTitleFromContent(content) || file.replace('.md', '');
        setState(prev => [...prev, { title, path: `${folder}/${file}` }]);
      }
    } catch (error) {
      console.error('Error fetching markdown files:', error);
    }
  }, []);

  useEffect(() => {
    loadMarkdownFiles('CyberArticles', setCyberArticles);
    loadMarkdownFiles('CyberGuides', setCyberGuides);
    loadMarkdownFiles('TechnologyNews', setTechNews);
    loadMarkdownFiles('TroubleshootingGuides', setTroubleshootingGuides);
  }, [loadMarkdownFiles]);

  return (
    <div className="sidenav">
      <h2>CyberArticles</h2>
      <ul>
        {cyberArticles.map((article, index) => (
          <li key={index}><Link to={`/${article.path}`}>{article.title}</Link></li>
        ))}
      </ul>

      <h2>CyberGuides</h2>
      <ul>
        {cyberGuides.map((guide, index) => (
          <li key={index}><Link to={`/${guide.path}`}>{guide.title}</Link></li>
        ))}
      </ul>

      <h2>TechnologyNews</h2>
      <ul>
        {techNews.map((news, index) => (
          <li key={index}><Link to={`/${news.path}`}>{news.title}</Link></li>
        ))}
      </ul>

      <h2>TroubleshootingGuides</h2>
      <ul>
        {troubleshootingGuides.map((guide, index) => (
          <li key={index}><Link to={`/${guide.path}`}>{guide.title}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
