// services/api.js
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_SERVER_URI || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getUser: async (address) => {
    const response = await api.get(`/users/${address}`);
    return response.data;
  },

  updateUser: async (address, userData) => {
    const response = await api.put(`/users/${address}`, userData);
    return response.data;
  },
};

export const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  updatePayment: async (paymentId, paymentData) => {
    const response = await api.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  },

  getSellerPayments: async (address) => {
    const response = await api.get(`/payments/seller/${address}`);
    return response.data;
  },
};

export default {
  user: userService,
  payment: paymentService,
};
