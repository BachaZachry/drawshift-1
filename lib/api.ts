import axios, { AxiosRequestConfig } from 'axios';
import { useGlobalStore } from './useGlobalStore';

let baseURL = process.env.NEXT_PUBLIC_BACKEND_HOST;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = useGlobalStore.getState().token;

  config.headers = config.headers ?? {};

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});
