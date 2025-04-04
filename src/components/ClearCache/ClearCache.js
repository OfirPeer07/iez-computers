import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const clearClientCache = () => {
  localStorage.clear();
  sessionStorage.clear();

  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => reg.unregister());
    });
  }

  console.log('Client cache cleared on route change');
};

const CacheClearOnRouteChange = () => {
  const location = useLocation();

  useEffect(() => {
    clearClientCache();
  }, [location.pathname]);

  return null;
};

export default CacheClearOnRouteChange;
