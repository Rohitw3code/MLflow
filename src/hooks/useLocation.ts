import { useEffect, useState } from 'react';

export function useLocation() {
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Get current location from URL
    const path = window.location.pathname;
    setLocation(path);

    // Listen for location changes
    const handleLocationChange = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return location;
}