import axios from 'axios';

const token = localStorage.getItem('token');
const baseUrl = `${import.meta.env.VITE_API_URL}` as string;

// Create the base axios instance
const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  },
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response: any) => {
    const { data, status } = response || {};
    if (status === 200) {
      if (data?.token && data?.user) {
        updateToken(data.token);
      } else if (data?.logout) {
        updateToken(null);
      }
    }
    return response;
  },
  (error: { response?: any }) => {
    const { response } = error;
    return Promise.reject(error);
  }
);

export const updateToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export default axiosInstance;
