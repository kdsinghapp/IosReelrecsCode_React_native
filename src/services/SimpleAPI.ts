/**
 * SimpleAPI - Direct API calls with guaranteed token inclusion
 * VERSION 3.0 - NO AXIOS, NO INTERCEPTORS, JUST FETCH
 */
import SimpleAuthService from './SimpleAuthService';
import { Alert } from 'react-native';

class SimpleAPI {
  private static readonly BASE_URL = 'http://reelrecs.us-east-1.elasticbeanstalk.com/v1';

  /**
   * Make API call with token
   */
  private static async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    // Get token - fail fast if not available
    const token = await SimpleAuthService.getTokenOrFail();

    // Build full URL
    const url = `${this.BASE_URL}${endpoint}`;

    // Build headers with token - IMPORTANT: Uses "Token" not "Bearer"!
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,  // FIXED: Token not Bearer!
      ...options.headers,
    };

    console.log('[DIAG] [SimpleAPI v3.0] Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token.substring(0, 20) + '...',
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[DIAG] [SimpleAPI v3.0] Response:', {
        status: response.status,
        ok: response.ok,
      });

      if (response.status === 401) {
        // Show exactly what we sent
        Alert.alert(
          '401 Debug Info',
          `Token sent: ${token.substring(0, 30)}...\nEndpoint: ${endpoint}`,
          [{ text: 'OK' }]
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[DIAG] [SimpleAPI v3.0] Request failed:', error);
      throw error;
    }
  }

  /**
   * Get rated movies
   */
  static async getRatedMovies(): Promise<any> {
    console.log('[DIAG] [SimpleAPI v3.0] Getting rated movies...');
    return this.makeRequest('/ranked-movies');  // FIXED: Correct endpoint!
  }

  /**
   * Get suggestion movies
   */
  static async getSuggestionMovies(page: number = 1): Promise<any> {
    console.log('[DIAG] [SimpleAPI v3.0] Getting suggestions...');
    return this.makeRequest(`/movies/ranking-suggestions?page=${page}`);
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<string> {
    console.log('[DIAG] [SimpleAPI v3.0] Logging in...');

    const response = await fetch(`${this.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const token = data.token || data.access_token || data.authToken;

    if (!token) {
      Alert.alert('Login Response', JSON.stringify(data, null, 2));
      throw new Error('No token in login response');
    }

    return token;
  }
}

export default SimpleAPI;