import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Tạo kiểu mới kế thừa InternalAxiosRequestConfig để thêm thuộc tính `_retry`
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  error: string;
}

// Tạo instance axios
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Quan trọng để gửi cookie HTTP-Only
});

// Function refreshToken
export const refreshToken = async (): Promise<string | false> => {
  try {
    // Gọi API để làm mới access_token
    const response = await API.post('/refresh-token');
    return response.data.access_token; // Trả về token mới
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
};

// Interceptor xử lý lỗi
API.interceptors.response.use(
  response => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig; 
    console.log(error.response?.data?.error)
    if (originalRequest && error.response?.status === 401 && error.response?.data?.error === 'invalid_refresh_token' && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
