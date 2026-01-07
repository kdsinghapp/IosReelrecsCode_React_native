/**
 * TokenService - Centralized token management with multiple fallbacks
 * Solves the 401 authentication issue by ensuring token is always available
 * VERSION: 2.0 - FIXED VERSION WITH IMMEDIATE TOKEN AVAILABILITY
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../redux/store';

class TokenService {
  private static token: string | null = null;
  private static isInitialized = false;
  private static readonly VERSION = '2.0-FIXED';

  /**
   * Initialize the service by loading token from storage
   */
  static async initialize(): Promise<void> {
    console.log(`[DIAG] [TokenService v${this.VERSION}] Initializing...`);

    if (this.isInitialized) {
      console.log(`[DIAG] [TokenService v${this.VERSION}] Already initialized`);
      return;
    }

    try {
      // Try to get token from AsyncStorage first (persisted across app restarts)
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        this.token = storedToken;
        console.log(`[DIAG] [TokenService v${this.VERSION}] Initialized with token from AsyncStorage`);
      } else {
        console.log(`[DIAG] [TokenService v${this.VERSION}] No stored token found during init`);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error(`[DIAG] [TokenService v${this.VERSION}] Initialization error:`, error);
      this.isInitialized = true; // Mark as initialized even on error
    }
  }

  /**
   * Set token in memory and storage
   */
  static async setToken(token: string): Promise<void> {
    console.log('[DIAG] [TokenService] Setting token:', token ? `${token.substring(0, 20)}...` : 'null');

    // Store in memory immediately
    this.token = token;

    // Store in AsyncStorage for persistence
    try {
      await AsyncStorage.setItem('authToken', token);
      console.log('[DIAG] [TokenService] Token saved to AsyncStorage');
    } catch (error) {
      console.error('[DIAG] [TokenService] Failed to save token to AsyncStorage:', error);
    }
  }

  /**
   * Get token with multiple fallbacks
   */
  static async getToken(): Promise<string | null> {
    // 1. Return memory token if available (fastest)
    if (this.token) {
      console.log('[DIAG] [TokenService] Token found in memory');
      return this.token;
    }

    // 2. Try Redux store (might have token from recent login)
    try {
      const state = store.getState();
      if (state?.auth?.token) {
        this.token = state.auth.token;
        console.log('[DIAG] [TokenService] Token found in Redux store');
        // Also save to AsyncStorage for next time
        await AsyncStorage.setItem('authToken', this.token);
        return this.token;
      }
    } catch (error) {
      console.error('[DIAG] [TokenService] Error reading from Redux:', error);
    }

    // 3. Final fallback to AsyncStorage
    try {
      const asyncToken = await AsyncStorage.getItem('authToken');
      if (asyncToken) {
        this.token = asyncToken;
        console.log('[DIAG] [TokenService] Token found in AsyncStorage (fallback)');
        return this.token;
      }
    } catch (error) {
      console.error('[DIAG] [TokenService] Error reading from AsyncStorage:', error);
    }

    console.warn('[DIAG] [TokenService] No token found in any source');
    return null;
  }

  /**
   * Get token synchronously (from memory only)
   */
  static getTokenSync(): string | null {
    return this.token;
  }

  /**
   * Clear token from all sources
   */
  static async clearToken(): Promise<void> {
    console.log('[DIAG] [TokenService] Clearing token');
    this.token = null;
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('[DIAG] [TokenService] Error clearing token from AsyncStorage:', error);
    }
  }

  /**
   * Wait for token to be available (with timeout)
   */
  static async waitForToken(maxAttempts = 50, delayMs = 100): Promise<string | null> {
    console.log('[DIAG] [TokenService] Waiting for token...');

    for (let i = 0; i < maxAttempts; i++) {
      const token = await this.getToken();
      if (token) {
        console.log(`[DIAG] [TokenService] Token found after ${i} attempts`);
        return token;
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.error('[DIAG] [TokenService] Token not found after maximum attempts');
    return null;
  }
}

export default TokenService;