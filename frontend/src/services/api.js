import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.55.101.157:5000',
});

export default api;