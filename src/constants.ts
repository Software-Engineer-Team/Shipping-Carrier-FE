require('dotenv').config();
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';
export const TOKEN_KEY = 'strapi-jwt-token';
export const ROLE_KEY = 'role';
export const USER_ID_KEY = 'user_id';
