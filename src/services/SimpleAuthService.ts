/**
 * SimpleAuthService - Direct, no-nonsense authentication
 * VERSION 3.0 - COMPLETE REDESIGN
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class SimpleAuthService {
  private static token: string | null = null;

  /**
   * Store token directly - no Redux, no complexity
   */
  static async storeToken(token: string): Promise<void> {
    console.log('[DIAG] [SimpleAuth v3.0] Storing token directly');
    this.token = token;

    // Store in AsyncStorage
    await AsyncStorage.setItem('authToken', token);

    // Also store with a backup key
    await AsyncStorage.setItem('backup_token', token);

    // Verify it was stored
    const verified = await AsyncStorage.getItem('authToken');
    console.log('[DIAG] [SimpleAuth v3.0] Token stored and verified:', verified ? 'YES' : 'NO');

    // DISABLED: Token storage alert
    // if (__DEV__) {
    //   Alert.alert('Token Stored', `Token saved: ${token.substring(0, 20)}...`);
    // }
  }

  /**
   * Get token directly - try memory first, then storage
   */
  static async getToken(): Promise<string | null> {
    // Memory first (fastest)
    if (this.token) {
      console.log('[DIAG] [SimpleAuth v3.0] Token from memory');
      return this.token;
    }

    // Try primary key
    let token = await AsyncStorage.getItem('authToken');
    if (token) {
      console.log('[DIAG] [SimpleAuth v3.0] Token from primary storage');
      this.token = token;
      return token;
    }

    // Try backup key
    token = await AsyncStorage.getItem('backup_token');
    if (token) {
      console.log('[DIAG] [SimpleAuth v3.0] Token from backup storage');
      this.token = token;
      return token;
    }

    console.log('[DIAG] [SimpleAuth v3.0] NO TOKEN FOUND ANYWHERE!');
    return null;
  }

  /**
   * Force get token - will alert if not found
   */
  static async getTokenOrFail(): Promise<string> {
    const token = await this.getToken();
    if (!token) {
      Alert.alert(
        'No Token!',
        'Token not found. Please login again.',
        [{ text: 'OK' }]
      );
      throw new Error('No token available');
    }
    return token;
  }

  /**
   * Clear all tokens
   */
  static async clearToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('backup_token');
    console.log('[DIAG] [SimpleAuth v3.0] All tokens cleared');
  }

  /**
   * Debug function to show current token status
   */
  static async debugTokenStatus(): Promise<void> {
    const memoryToken = this.token;
    const primaryToken = await AsyncStorage.getItem('authToken');
    const backupToken = await AsyncStorage.getItem('backup_token');

    const status = {
      hasMemoryToken: !!memoryToken,
      hasPrimaryToken: !!primaryToken,
      hasBackupToken: !!backupToken,
      memoryPreview: memoryToken ? `${memoryToken.substring(0, 20)}...` : 'none',
      primaryPreview: primaryToken ? `${primaryToken.substring(0, 20)}...` : 'none',
      backupPreview: backupToken ? `${backupToken.substring(0, 20)}...` : 'none',
    };

    console.log('[DIAG] [SimpleAuth v3.0] Token Status:', status);

    // DISABLED: Token status alert
    // if (__DEV__) {
    //   Alert.alert('Token Status', JSON.stringify(status, null, 2));
    // }
  }
}

export default SimpleAuthService;