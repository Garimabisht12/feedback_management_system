import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:5000/api/",
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
