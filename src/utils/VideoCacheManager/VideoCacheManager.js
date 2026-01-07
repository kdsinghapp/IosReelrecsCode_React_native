import { NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const { VideoCacheModule } = NativeModules;

// 🧮 Folder size calculate karne ke liye helper
const getFolderSize = async (folderPath) => {
  try {
    const files = await RNFS.readDir(folderPath);
    let total = 0;
    for (const file of files) {
      if (file.isFile()) {
        const stat = await RNFS.stat(file.path);
        total += Number(stat.size);
      } else if (file.isDirectory()) {
        total += await getFolderSize(file.path);
      }
    }
    return total;
  } catch (e) {
    console.log('⚠️ Error calculating folder size:', e);
    return 0;
  }
};

/**
 * 🧹 Master Controller — Clear Video Cache
 * 
 * @param {"all" | "limit"} mode - "all" = pura clear, "limit" = size-based (3MB rakhna)
 */
export const clearVideoCache = async (mode = "all") => {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
console.log('cacheDir___',cacheDir)
    // 🔍 Before clear size
    const before = await getFolderSize(cacheDir);
    console.log(`📦 Cache before: ${(before / (1024 * 1024)).toFixed(2)} MB`);

    // 🔧 Cache files fetch
    const files = await RNFS.readDir(cacheDir);
    const fileList = [];

    for (const file of files) {
      const stat = await RNFS.stat(file.path);
      fileList.push({
        path: file.path,
        size: Number(stat.size),
        mtime: stat.mtime ? new Date(stat.mtime).getTime() : 0,
      });
    }

    // 🗂️ Sort by last modified (newest first)
    fileList.sort((a, b) => b.mtime - a.mtime);

    if (mode === "all") {
      // 🔥 Delete all cache files
      for (const file of fileList) {
        await RNFS.unlink(file.path);
      }
      console.log("🧹 All cache files deleted!");
    } else if (mode === "limit") {
      // 📏 Keep only 3MB
      let keptSize = 0;
      console.log('cache__dataLoad__',fileList)
          console.log('data__Chefck___before__fetch__',keptSize / ((1024 * 1024)).toFixed(2)  , file.size )

      for (const file of fileList) {
        if (keptSize < 30 * 1024 * 1024) {
          keptSize += file.size;
          console.log('keptSize__daata__cacheeee',keptSize / ((1024 * 1024)).toFixed(2)  , file.size )
        } else {
          await RNFS.unlink(file.path);
          console.log(`🗑️ Deleted old file: ${file.path}`);
        }
      }
      console.log(`💾 Retained ${(keptSize / (1024 * 1024)).toFixed(2)} MB of latest cache`);
    }

    // 🧩 Clear Native Player cache
    if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
      await VideoCacheModule.clearCache();
      console.log(` ${Platform.OS} native player cache cleared`);
    }

    // 📉 After clear size
    const after = await getFolderSize(cacheDir);
    const diff = before - after;
    console.log(`📉 Cache after: ${(after / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`🎯 Cleared: ${(diff / (1024 * 1024)).toFixed(2)} MB`);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};



// workinh code 

// import { NativeModules, Platform } from 'react-native';
// import RNFS from 'react-native-fs';
 
// const { VideoCacheModule } = NativeModules;
 
// // Helper function: folder size calculate karne ke liye
//  const getFolderSize = async (folderPath) => {
//   try {
//     const files = await RNFS.readDir(folderPath);
//     let totalSize = 0;
//     for (const file of files) {
//       if (file.isFile()) {
//         const stat = await RNFS.stat(file.path);
//         totalSize += Number(stat.size);
//       } else if (file.isDirectory()) {
//         totalSize += await getFolderSize(file.path);
//       }
//     }
//     return totalSize;
//   } catch (error) {
//     console.log('Error calculating folder size:', error);
//     return 0;
//   }
// };
 
// export const clearVideoCache = async () => {
//   try {
//     const cacheDir = RNFS.CachesDirectoryPath;
 
//     // 📦 Clear hone se pehle ka size
//     const beforeSize = await getFolderSize(cacheDir);
//     console.log(`📊 Cache size before clearing: ${(beforeSize / (1024 * 1024)).toFixed(2)} MB`);
 
//     // 🧹 React Native cache delete kar rahe hain
//     const files = await RNFS.readDir(cacheDir);
//     for (const file of files) {
//       if (file.isFile() || file.isDirectory()) {
//         await RNFS.unlink(file.path);
//       }
//     }
//     console.log(' RN cache cleared.');
//     // 🧩 Native module ka cache clear
//     if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     };
//     // 🔁 Clear hone ke baad ka size
//     const afterSize = await getFolderSize(cacheDir);
//     console.log(`📉 Cache size after clearing: ${(afterSize / (1024 * 1024)).toFixed(2)} MB`);
 
//     // 🔎 Difference
//     const clearedSize = beforeSize - afterSize;
//     console.log(`🎯 Cleared: ${(clearedSize / (1024 * 1024)).toFixed(2)} MB`);
//     console.log('🎉 All video caches cleared successfully.');
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };


// import RNFS from 'react-native-fs';
 
// const { VideoCacheModule } = NativeModules;
 
// export const clearVideoCache = async () => {
//   try {
//     const cacheDir = RNFS.CachesDirectoryPath;
//     const files = await RNFS.readDir(cacheDir);
//     for (const file of files) {
//       if (file.isFile() || file.isDirectory()) {
//         await RNFS.unlink(file.path);
//       }
//     }
//     console.log('✅ RN cache cleared.');
 
//     if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     }
//     console.log('🎉 All video caches cleared successfully.');
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };
 

// import { NativeModules, Platform } from 'react-native';
// import RNFS from 'react-native-fs';
 
// const { VideoCacheModule } = NativeModules;
 
// // Helper function: folder size calculate karne ke liye
// const getFolderSize = async (folderPath) => {
//   try {
//     const files = await RNFS.readDir(folderPath);
//     let totalSize = 0;
//     for (const file of files) {
//       if (file.isFile()) {
//         const stat = await RNFS.stat(file.path);
//         totalSize += Number(stat.size);
//       } else if (file.isDirectory()) {
//         totalSize += await getFolderSize(file.path);
//       }
//     }
//     return totalSize;
//   } catch (error) {
//     console.log('Error calculating folder size:', error);
//     return 0;
//   }
// };
 
// export const clearVideoCache = async () => {
//   try {
//     const cacheDir = RNFS.CachesDirectoryPath;
 
//     // 📦 Clear hone se pehle ka size
//     const beforeSize = await getFolderSize(cacheDir);
//     console.log(`📊 Cache size before clearing: ${(beforeSize / (1024 * 1024)).toFixed(2)} MB`);
 
//     // 🧹 React Native cache delete kar rahe hain
//     const files = await RNFS.readDir(cacheDir);
//     for (const file of files) {
//       if (file.isFile() || file.isDirectory()) {
//         await RNFS.unlink(file.path);
//       }
//     }
//     console.log('✅ RN cache cleared.');
 
//     // 🧩 Native module ka cache clear
//     if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     }
 
//     // 🔁 Clear hone ke baad ka size
//     const afterSize = await getFolderSize(cacheDir);
//     console.log(`📉 Cache size after clearing: ${(afterSize / (1024 * 1024)).toFixed(2)} MB`);
 
//     // 🔎 Difference
//     const clearedSize = beforeSize - afterSize;
//     console.log(`🎯 Cleared: ${(clearedSize / (1024 * 1024)).toFixed(2)} MB`);
 
//     console.log('🎉 All video caches cleared successfully.');
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };
 
 
// import { NativeModules, Platform } from 'react-native';
// import RNFS from 'react-native-fs';
 
 
 
 
// const { VideoCacheModule } = NativeModules;
 
// export const clearVideoCache = async () => {
//   try {
//     const cacheDir = RNFS.CachesDirectoryPath;
//     const files = await RNFS.readDir(cacheDir);
//     for (const file of files) {
//       if (file.isFile() || file.isDirectory()) {
//         await RNFS.unlink(file.path);
//       }
//     }
//     console.log('✅ RN cache cleared.');
 
//     if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     }
//     console.log('🎉 All video caches cleared successfully.');
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };
 




// import { NativeModules, Platform } from 'react-native';
// import RNFS from 'react-native-fs';

// const { VideoCacheModule } = NativeModules;

// /** 🔁 Recursively calculate folder size */
// const getFolderSize = async (path) => {
//   let total = 0;
//   try {
//     const items = await RNFS.readDir(path);
//     for (const item of items) {
//       if (item.isFile()) {
//         const info = await RNFS.stat(item.path);
//         total += Number(info.size);
//       } else if (item.isDirectory()) {
//         total += await getFolderSize(item.path); // recursion
//       }
//     }
//   } catch (e) {
//     console.warn('Error reading folder:', e.message);
//   }
//   return total;
// };

// /** 🧮 Get total cache size (internal + external) */
// export const getCacheSize = async () => {
//   try {
//     const internalCache = await getFolderSize(RNFS.CachesDirectoryPath);
//     const externalCache = RNFS.ExternalCachesDirectoryPath
//       ? await getFolderSize(RNFS.ExternalCachesDirectoryPath)
//       : 0;

//     const totalSize = internalCache + externalCache;
//     const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

//     console.log(`🧹 Total Cache Size: ${sizeInMB} MB`);
//     return parseFloat(sizeInMB);
//   } catch (err) {
//     console.error('❌ Error reading cache size:', err);
//     return 0;
//   }
// };

// /** 🧽 Recursively delete folder content */
// const clearFolderRecursively = async (path) => {
//   try {
//     const items = await RNFS.readDir(path);
//     for (const item of items) {
//       try {
//         if (item.isFile()) {
//           await RNFS.unlink(item.path);
//         } else if (item.isDirectory()) {
//           await clearFolderRecursively(item.path);
//           await RNFS.unlink(item.path); // remove empty folder
//         }
//       } catch (e) {
//         console.warn('Skip delete error:', e.message);
//       }
//     }
//   } catch (err) {
//     console.warn('Error clearing folder:', err.message);
//   }
// };

// /** 🚿 Clear video + app cache safely */
// export const clearVideoCache = async () => {
//   try {
//     console.log('🧩 Checking cache size before cleanup...');
//     const beforeSize = await getCacheSize();

//     const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100 MB
//     const TARGET_FREE = 60 * 1024 * 1024;     // 60 MB

//     if (beforeSize * 1024 * 1024 <= MAX_CACHE_SIZE) {
//       console.log(`✅ Cache under limit (${beforeSize} MB). No cleanup needed.`);
//       return;
//     }

//     console.log('⚙️ Cache limit exceeded. Cleaning old files...');

//     // Clear internal & external cache folders
//     await clearFolderRecursively(RNFS.CachesDirectoryPath);
//     if (RNFS.ExternalCachesDirectoryPath) {
//       await clearFolderRecursively(RNFS.ExternalCachesDirectoryPath);
//     }

//     // Clear native video cache if supported
//     if (VideoCacheModule?.clearCache) {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     }

//     const afterSize = await getCacheSize();
//     const freed = beforeSize - afterSize;

//     console.log(`🎉 Cache cleanup done. Freed: ${freed.toFixed(2)} MB`);
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };
















// import { NativeModules, Platform } from 'react-native';
// import RNFS from 'react-native-fs';

// const { VideoCacheModule } = NativeModules;

// export const clearVideoCache = async () => {
//   try {
//     const cacheDir = RNFS.CachesDirectoryPath;
//     const files = await RNFS.readDir(cacheDir);
//     for (const file of files) {
//       if (file.isFile() || file.isDirectory()) {
//         await RNFS.unlink(file.path);
//       }
//     }
//     console.log('✅ RN cache cleared.');

//     if (VideoCacheModule && typeof VideoCacheModule.clearCache === 'function') {
//       await VideoCacheModule.clearCache();
//       console.log(`✅ ${Platform.OS} native player cache cleared.`);
//     }
//     console.log('🎉 All video caches cleared successfully.');
//   } catch (error) {
//     console.error('❌ Error clearing video cache:', error);
//   }
// };