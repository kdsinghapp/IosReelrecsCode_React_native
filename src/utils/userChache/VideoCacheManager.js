import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const CACHE_DIR = `${RNFS.CachesDirectoryPath}/video_cache`;
const MAX_CACHE_SIZE_MB = 100;
const CLEAR_PERCENTAGE = 0.5; // 50%

const VideoCacheManager = {
  /**
   * Initialize cache folder
   */
  async init() {
    const exists = await RNFS.exists(CACHE_DIR);
    if (!exists) {
      await RNFS.mkdir(CACHE_DIR);
      console.log('✅ Cache directory created:', CACHE_DIR);
    }
  },

  /**
   * Generate file name from URL
   */
  getFileNameFromUrl(url) {
    const name = url.split('/').pop().split('?')[0];
    const safeName = name.replace(/[^a-zA-Z0-9.]/g, '_');
    return `${CACHE_DIR}/${safeName}`;
  },

  /**
   * Check if cached file exists
   */
  async isCached(url) {
    const filePath = this.getFileNameFromUrl(url);
    return await RNFS.exists(filePath);
  },

  /**
   * Get cached file path or download and cache it
   */
  async getPlayableUrl(url, onProgress) {
    await this.init();
    const filePath = this.getFileNameFromUrl(url);

    const exists = await RNFS.exists(filePath);
    if (exists) {
      console.log('🎬 Using cached video:', filePath);
      return `file://${filePath}`;
    }

    console.log('⬇️ Downloading video to cache...');
    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true,
      discretionary: true,
      progressDivider: 5,
      progress: (res) => {
        if (onProgress) {
          const progressPercent = Math.round(
            (res.bytesWritten / res.contentLength) * 100
          );
          onProgress(progressPercent);
        }
      },
    });

    const result = await download.promise;
    if (result.statusCode === 200) {
      console.log('✅ Video cached successfully:', filePath);
      await this.enforceCacheLimit();
      return `file://${filePath}`;
    } else {
      console.log('❌ Download failed, fallback to remote:', url);
      return url; // fallback to direct stream
    }
  },

  /**
   * Enforce cache size limit
   */
  async enforceCacheLimit() {
    const files = await RNFS.readDir(CACHE_DIR);
    let totalSize = 0;

    const fileData = await Promise.all(
      files.map(async (file) => {
        const stats = await RNFS.stat(file.path);
        totalSize += Number(stats.size);
        return { path: file.path, size: stats.size, mtime: stats.mtime };
      })
    );

    const totalSizeMB = totalSize / (1024 * 1024);
    console.log(`📦 Current cache size: ${totalSizeMB.toFixed(2)} MB`);

    if (totalSizeMB > MAX_CACHE_SIZE_MB) {
      console.log('⚠️ Cache limit exceeded — clearing old files...');
      fileData.sort((a, b) => new Date(a.mtime) - new Date(b.mtime)); // oldest first
      const toDeleteCount = Math.ceil(fileData.length * CLEAR_PERCENTAGE);

      for (let i = 0; i < toDeleteCount; i++) {
        try {
          await RNFS.unlink(fileData[i].path);
          console.log('🗑️ Deleted old cache file:', fileData[i].path);
        } catch (e) {
          console.log('⚠️ Error deleting file:', e.message);
        }
      }
    }
  },

  /**
   * Manually clear all cache
   */
  async clearAllCache() {
    try {
      await RNFS.unlink(CACHE_DIR);
      console.log('🧹 Cleared all video cache');
      await RNFS.mkdir(CACHE_DIR);
    } catch (e) {
      console.log('⚠️ Error clearing cache:', e.message);
    }
  },
};

export default VideoCacheManager;




// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { getCacheDir, cleanOldCache } from './src/utils/videoCacheHelper';

// const App = () => {
//   useEffect(() => {
//     const setupCache = async () => {
//       const dir = await getCacheDir();
//       console.log('Cache dir path:', dir);
//       await cleanOldCache();
//     };
//     setupCache();
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>ReelRecs Video Cache Test</Text>
//     </View>
//   );
// };

// export default App;
