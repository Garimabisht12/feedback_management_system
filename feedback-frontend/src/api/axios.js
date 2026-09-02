import axios from 'axios';

const instance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('studentToken') || localStorage.getItem('adminToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
