import RNFS from 'react-native-fs';

// ✅ Where to store cached videos (cross-platform)
const CACHE_DIR = `${RNFS.CachesDirectoryPath}/videoCache`;

// ✅ Max cached videos allowed
const MAX_CACHE_FILES = 10;

/**
 * Ensure cache folder exists
 */
export const ensureCacheDir = async () => {
  const exists = await RNFS.exists(CACHE_DIR);
  if (!exists) {
    await RNFS.mkdir(CACHE_DIR);
    console.log('📁 Created cache folder:', CACHE_DIR);
  }
  return CACHE_DIR;
};

/**
 * Get cache size in MB
 */
export const getCacheSize = async () => {
  try {
    await ensureCacheDir();
    const files = await RNFS.readDir(CACHE_DIR);

    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
    }

    const mb = (totalSize / (1024 * 1024)).toFixed(2);
    console.log('💾 Cache Size:', mb, 'MB');
    return mb;
  } catch (err) {
    console.log('❌ Error getting cache size:', err);
  }
};

/**
 * Clear all cache
 */
export const clearCache = async () => {
  try {
    await RNFS.unlink(CACHE_DIR);
    await RNFS.mkdir(CACHE_DIR);
    console.log('🧹 All video cache cleared!');
  } catch (err) {
    console.log('❌ Error clearing cache:', err);
  }
};

/**
 * Maintain cache — keep only latest N videos
 */
export const autoMaintainCache = async () => {
  try {
    await ensureCacheDir();
    const files = await RNFS.readDir(CACHE_DIR);

    if (files.length > MAX_CACHE_FILES) {
      const sorted = files.sort((a, b) => b.mtime - a.mtime); // newest first
      const toDelete = sorted.slice(MAX_CACHE_FILES);
      for (const file of toDelete) {
        await RNFS.unlink(file.path);
      }
      console.log(`♻️ Deleted ${toDelete.length} old cache files`);
    } else {
      console.log('✅ Cache within limit:', files.length, 'files');
    }
  } catch (err) {
    console.log('❌ Error maintaining cache:', err);
  }
};

/**
 * Get cached video path or download if missing
 */
export const getCachedVideo = async (url) => {
  try {
    await ensureCacheDir();
    const fileName = url.split('/').pop()?.split('?')[0] || `video_${Date.now()}.mp4`;
    const filePath = `${CACHE_DIR}/${fileName}`;

    const exists = await RNFS.exists(filePath);
    if (exists) {
      console.log('📦 Loaded from cache:', filePath);
      return filePath;
    }

    console.log('⬇️ Downloading video:', url);
    await RNFS.downloadFile({ fromUrl: url, toFile: filePath }).promise;

    // Maintain cache after saving
    await autoMaintainCache();

    return filePath;
  } catch (err) {
    console.log('❌ Error caching video:', err);
    return url; // fallback to online URL
  }
};



// // videoCacheHelper.js
// import { NativeModules, Platform } from 'react-native';

// const { AndroidVideoCache } = NativeModules;

// export const getCacheDir = async () => {
//   try {
//     const dir = await AndroidVideoCache.getCacheDir();
//     console.log('📂 Cache directory:', dir);
//     return dir;
//   } catch (e) {
//     console.error('❌ Error fetching cache dir:', e);
//   }
// };

// export const getCacheSize = async () => {
//   try {
//     const size = await AndroidVideoCache.getCacheSize();
//     const sizeInMB = (size / (1024 * 1024)).toFixed(2);
//     console.log(`💾 Cache size: ${sizeInMB} MB`);
//     return sizeInMB;
//   } catch (e) {
//     console.error('❌ Error getting cache size:', e);
//   }
// };

// export const clearCache = async () => {
//   try {
//     const res = await AndroidVideoCache.cleanOldCache();
//     console.log('🧹', res);
//     return res;
//   } catch (e) {
//     console.error('❌ Error clearing cache:', e);
//   }
// };





// import { NativeModules, Platform } from 'react-native';
// const { AndroidVideoCache } = NativeModules;

// export async function getCacheDir() {
//   if (Platform.OS !== 'android' || !AndroidVideoCache?.getCacheDir) return null;
//   return await AndroidVideoCache.getCacheDir();
// }

// export async function getCacheSize() {
//   if (Platform.OS !== 'android' || !AndroidVideoCache?.getCacheSize) return '0';
//   const size = await AndroidVideoCache.getCacheSize();
//   console.log('📦 Current Cache Size:', size, 'MB');
//   return size;
// }

// export async function cleanOldCache() {
//   if (Platform.OS !== 'android' || !AndroidVideoCache?.cleanOldCache) return;
//   console.log('cleanOldCache___ANDROID')
//   const res = await AndroidVideoCache.cleanOldCache();
//   console.log('🧹', res);
// }

// export async function autoCleanIfNeeded() {
//   if (Platform.OS !== 'android' || !AndroidVideoCache?.autoCleanIfNeeded) return;
//   const msg = await AndroidVideoCache.autoCleanIfNeeded();
//   console.log(msg);
// }


// import { NativeModules, Platform } from 'react-native';
// const { AndroidVideoCache } = NativeModules;

// export async function getProxyUrl(originalUrl) {
//   if (Platform.OS !== 'android') return originalUrl;
//   try {
//     const proxyUrl = await AndroidVideoCache.getProxyUrl(originalUrl);
//     return proxyUrl;
//   } catch (e) {
//     console.warn('getProxyUrl error:', e);
//     return originalUrl;
//   }
// }

// export async function cleanOldCache() {
//   if (Platform.OS !== 'android') return;
//   try {
//     const msg = await AndroidVideoCache.cleanOldCache();
//     console.log('🧹', msg);
//   } catch (e) {
//     console.warn('cleanOldCache error', e);
//   }
// }



// // import { NativeModules, Platform } from 'react-native';
// // const { AndroidVideoCache } = NativeModules;

// // export async function getProxyUrl(originalUrl) {
// //   if (Platform.OS !== 'android') return originalUrl;
// //   try {
// //     const proxyUrl = await AndroidVideoCache.getProxyUrl(originalUrl);
// //     return proxyUrl;
// //   } catch (e) {
// //     console.warn('getProxyUrl error:', e);
// //     return originalUrl;
// //   }
// // }

// // export async function cleanOldCache() {
// //   if (Platform.OS !== 'android') return;
// //   try {
// //     const msg = await AndroidVideoCache.cleanOldCache();
// //     console.log('🧹', msg);
// //   } catch (e) {
// //     console.warn('cleanOldCache error', e);
// //   }
// // }
