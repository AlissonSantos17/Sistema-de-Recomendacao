import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || DEFAULT_API_URL,
  timeout: 10000
});
