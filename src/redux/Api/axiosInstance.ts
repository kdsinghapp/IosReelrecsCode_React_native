import axios from 'axios';
import { getToken } from './GlobalToken';
import TokenService from '../../services/TokenService';

// TODO: Change to HTTPS for production - currently using HTTP for development
const axiosInstance = axios.create({
  baseURL: 'http://reelrecs.us-east-1.elasticbeanstalk.com/v1',
  timeout: 30000, // Increased from 10s for video operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token injection
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Skip auth header for login and public endpoints
      const isLoginEndpoint = config.url?.includes('/login');
      const isPublicEndpoint = config.url?.includes('/verify-email') ||
                               config.url?.includes('/confirm-email-code') ||
                               config.url?.includes('/reset-password');

      if (!isLoginEndpoint && !isPublicEndpoint) {
        // Use TokenService for reliable token retrieval
        const token = await TokenService.getToken();

        if (__DEV__) {
          console.log('[DIAG] [Axios Interceptor] Token check:', {
            url: config.url,
            tokenFound: !!token,
            tokenLength: token ? token.length : 0,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
          });
        }

        if (token && typeof token === 'string' && config.headers) {
          config.headers.Authorization = `Token ${token}`;  // FIXED: Token not Bearer!
          if (__DEV__) {
            // console.log('[DIAG] [Axios Interceptor] Added auth header with Token prefix');
          }
        } else if (__DEV__) {
          console.warn('[DIAG] [Axios Interceptor] No token available for protected endpoint:', config.url);
        }
      }
    } catch (error) {
      // Continue without token if store not ready
      if (__DEV__) {
        console.error('[DIAG] [Axios Interceptor] Error getting token:', error);
      }
    }

    // DEV-only debug logging
    if (__DEV__) {
      console.log('[DIAG] [Axios Request]', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        hasAuth: !!config.headers?.Authorization,
        authHeader: config.headers?.Authorization ? `${config.headers.Authorization.substring(0, 30)}...` : 'none'
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('[DIAG] [Axios Response Success]', {
        url: response.config?.url,
        status: response.status
      });
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.error('[DIAG] [Axios Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        hadAuthHeader: !!error.config?.headers?.Authorization
      });

      // If 401 and we had a token, log more details
      if (error.response?.status === 401 && error.config?.headers?.Authorization) {
        console.error('[DIAG] [Axios] 401 with token present - token might be invalid or expired');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export const BASE_IMAGE_URL = 'https://reelrecs.s3.us-east-1.amazonaws.com/static/users';
