import axios from 'axios';

const instance = axios.create({
    baseURL: "https://bias-feedbackmanagementsystem-production-64b2.up.railway.app/api/"
});

export default instance;