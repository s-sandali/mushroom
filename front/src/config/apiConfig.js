const DEPLOYED_API_BASE_URL = 'https://mushroom-hvyo.onrender.com';

const resolveBaseUrl = () =>
  process.env.REACT_APP_API_BASE_URL?.trim() || DEPLOYED_API_BASE_URL;

export const API_BASE_URL = resolveBaseUrl();
export const buildApiUrl = (path = '') => `${API_BASE_URL}${path}`;
