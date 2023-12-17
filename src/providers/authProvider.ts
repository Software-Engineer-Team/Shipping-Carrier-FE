import { AuthBindings } from '@refinedev/core';

import { API_URL, ROLE_KEY, TOKEN_KEY, USER_ID_KEY } from '../constants';
import { AuthHelper } from '../utils';
import { axiosInstance } from './utilities';

const strapiAuthHelper = AuthHelper(API_URL + '/api');

export const authProvider: AuthBindings = {
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return {
        authenticated: true,
      };
    }

    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);

    return {
      authenticated: false,
      error: {
        message: 'Kiểm tra thất bại',
        name: 'Không tìm thất token',
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(token, {
      meta: {
        populate: ['role', 'carrier', 'addresses'],
      },
    });
    if (status === 200) {
      const { address, addresses, banks, carrier, email, id, phone_number, role, username } = data;
      localStorage.setItem(ROLE_KEY, role.type);
      localStorage.setItem(USER_ID_KEY, id.toString());
      return {
        address,
        addresses,
        banks,
        carrier,
        email,
        id,
        phone_number,
        role,
        username,
      };
    }

    return null;
  },
  getPermissions: async () => {
    return localStorage.get(ROLE_KEY);
  },
  login: async ({ email, password }) => {
    try {
      const { data, status } = await strapiAuthHelper.login(email, password);

      if (status === 200) {
        localStorage.setItem(TOKEN_KEY, data.jwt);
        localStorage.setItem(ROLE_KEY, data?.user?.role?.type);

        // set header axios instance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;

        return {
          redirectTo: '/dashboard',
          success: true,
        };
      }

      return {
        error: {
          message: 'Đăng nhập thất bại',
          name: 'Email hoặc mật khẩu không đúng',
        },
        success: false,
      };
    } catch (error: any) {
      return {
        error: {
          message: 'Đăng nhập thất bại',
          name: error?.response?.data?.error?.message || 'Email hoặc mật khẩu không đúng',
        },
        success: false,
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    return {
      redirectTo: '/login',
      success: true,
    };
  },
  onError: async error => {
    const status = error.statusCode;
    if (status === 418 || status === 401 || status === 403) {
      return {
        error: new Error(error),
        logout: true,
        redirectTo: '/login',
      };
    }
    return { error };
  },
};
