import { NativeModules, Platform } from 'react-native';
const { AndroidVideoCache, VideoCacheManager } = NativeModules;

// 📁 Get cache directory (Android only)
export async function getAndroidCacheDir() {
  if (Platform.OS !== 'android') return null;
  try {
    const dir = await AndroidVideoCache.getCacheDir();
    return dir; // absolute path string
  } catch (e) {
    console.warn('getCacheDir error', e);
    return null;
  }
}

// 🧹 Clean old cache (Android only)
export async function cleanAndroidCache() {
  if (Platform.OS !== 'android') return;
  try {
    const res = await AndroidVideoCache.cleanOldCache();
    console.log('Cache clean result:', res);
  } catch (e) {
    console.warn('cleanOldCache error', e);
  }
}
