import { HttpError } from '@refinedev/core';
import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const customError: HttpError = {
      errors: error.response?.data?.error?.details,
      message: error.response?.data?.error?.message,
      statusCode: error.response?.data?.error?.status,
    };

    return Promise.reject(customError);
  },
);
