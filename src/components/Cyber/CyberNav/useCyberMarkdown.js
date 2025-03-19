import { useState, useEffect } from 'react';

const useCyberMarkdown = () => {
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const folders = {
      'CyberArticles': { title: 'Cyber Articles', path: 'cyber/hacking/articles' },
      'CyberGuides': { title: 'Cyber Guides', path: 'cyber/hacking/guides' },
    };

    const importAll = (r) => {
      try {
        return r.keys().map((fileName) => ({
          title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
          path: fileName.replace('./', '')
        }));
      } catch (error) {
        setError('Error loading files');
        console.warn('Error importing files:', error);
        return [];
      }
    };

    try {
      const cyberArticles = importAll(require.context('../../../../public/md/CyberArticles', false, /\.md$/));
      const cyberGuides = importAll(require.context('../../../../public/md/CyberGuides', false, /\.md$/));

      setArticles({
        CyberArticles: { title: folders.CyberArticles.title, path: folders.CyberArticles.path, files: cyberArticles },
        CyberGuides: { title: folders.CyberGuides.title, path: folders.CyberGuides.path, files: cyberGuides },
      });
    } catch (error) {
      setError('Error loading articles');
      console.error('Error loading markdown files:', error);
    }
  }, []);

  return { articles, error };
};

export default useCyberMarkdown;