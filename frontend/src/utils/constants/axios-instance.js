import axios from 'axios';

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const userAPI = createAxiosInstance('http://localhost:3000/users');

export const sensorAPI = createAxiosInstance('http://localhost:3001/sensors');

export const readingAPI = createAxiosInstance('http://localhost:3002/readings');

