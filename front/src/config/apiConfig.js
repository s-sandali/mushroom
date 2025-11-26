const DEPLOYED_API_BASE_URL = 'https://mushroom-hvyo.onrender.com';
const DEFAULT_LOCAL_PORT = process.env.REACT_APP_LOCAL_API_PORT || '8000';
const LOCAL_API_BASE_URL = `http://localhost:${DEFAULT_LOCAL_PORT}`;

const resolveBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  const isBrowser = typeof window !== 'undefined';
  const isLocalhost = isBrowser && window.location.hostname === 'localhost';

  return isLocalhost ? LOCAL_API_BASE_URL : DEPLOYED_API_BASE_URL;
};

export const API_BASE_URL = resolveBaseUrl();
export const buildApiUrl = (path = '') => `${API_BASE_URL}${path}`;
