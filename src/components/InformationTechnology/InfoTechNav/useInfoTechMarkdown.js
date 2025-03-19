import { useState, useEffect } from 'react';

const useInfoTechMarkdown = () => {
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const folders = {
      'TechnologyNews': { title: 'Technology News', path: 'information-technology/technology-news' },
      'TroubleshootingGuides': { title: 'Troubleshooting Guides', path: 'information-technology/troubleshooting-guides' },
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
      const techNews = importAll(require.context('../../../../public/md/TechnologyNews', false, /\.md$/));
      const troubleshooting = importAll(require.context('../../../../public/md/TroubleshootingGuides', false, /\.md$/));

      setArticles({
        TechnologyNews: { title: folders.TechnologyNews.title, path: folders.TechnologyNews.path, files: techNews },
        TroubleshootingGuides: { title: folders.TroubleshootingGuides.title, path: folders.TroubleshootingGuides.path, files: troubleshooting },
      });
    } catch (error) {
      setError('Error loading articles');
      console.error('Error loading markdown files:', error);
    }
  }, []);

  return { articles, error };
};

export default useInfoTechMarkdown;
