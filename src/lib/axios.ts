import axios from 'axios';

const apiStr = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api/';
const baseURL = apiStr.endsWith('/') ? apiStr : `${apiStr}/`;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
