import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiOrigin = configuredApiUrl || (
  import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://acebraids-api.onrender.com'
);
const apiBaseUrl = `${apiOrigin.replace(/\/$/, '')}/api`;

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
