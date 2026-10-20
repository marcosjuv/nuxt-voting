import axios from 'axios';

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    provide: { axios: api },
  };
});