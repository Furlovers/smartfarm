import axios from "axios";

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const userAPI = createAxiosInstance(
  "https://smartfarm-user-mss-899314332d02.herokuapp.com/users"
);

export const sensorAPI = createAxiosInstance(
  "https://smartfarm-sensor-mss-60ba36d99b7f.herokuapp.com/sensors"
);

export const readingAPI = createAxiosInstance(
  "https://smartfarm-reading-mss-ee062958e049.herokuapp.com/readings"
);

export const viewAPI = createAxiosInstance(
  "https://smartfarm-view-mss-753d9b4258f1.herokuapp.com/view"
);
