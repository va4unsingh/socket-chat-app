import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7020/api/v1',
  withCredentials: true,
});

// Auth
export const login = (data: any) => api.post('/auth/signin', data);
export const signup = (data: any) => api.post('/auth/signup', data);
export const checkUserSession = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');

// User Profile
export const getUserProfile = (userId: string) => api.get(`/users/profile/${userId}`);
export const updateAccountDetails = (data: any) => api.patch('/auth/update-account', data);

export default api;
