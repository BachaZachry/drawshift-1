import axios from 'axios';

let baseURL = 'http://localhost:8000/';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: getToken() ? `Token ${getToken()}` : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});
