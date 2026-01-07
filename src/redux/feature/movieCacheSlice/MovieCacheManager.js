// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import RNFS from 'react-native-fs';

// // const MAX_CACHE_SIZE = 15;
// // const movieCache = new Map();
// // const CACHE_KEY_PREFIX = 'movie_';

// // export const getCachedMovie = async (imdb_id) => {
// //   if (movieCache.has(imdb_id)) {
// //     const movie = movieCache.get(imdb_id);
// //     movieCache.delete(imdb_id);
// //     movieCache.set(imdb_id, movie);
// //     return movie;
// //   }

// //   const raw = await AsyncStorage.getItem(CACHE_KEY_PREFIX + imdb_id);
// //   if (raw) {
// //     const data = JSON.parse(raw);
// //     movieCache.set(imdb_id, data);
// //     return data;
// //   }

// //   return null;
// // };

// // export const setCachedMovie = async (imdb_id, data) => {
// //   if (!imdb_id || !data) return;

// //   if (movieCache.has(imdb_id)) {
// //     movieCache.delete(imdb_id);
// //   } else if (movieCache.size >= MAX_CACHE_SIZE) {
// //     const oldestKey = movieCache.keys().next().value;
// //     movieCache.delete(oldestKey);
// //   }

// //   movieCache.set(imdb_id, data);
// //   await AsyncStorage.setItem(CACHE_KEY_PREFIX + imdb_id, JSON.stringify(data));

// //   console.log(`🎬 Cached movie: ${imdb_id} | Total: ${movieCache.size}/${MAX_CACHE_SIZE}`);
// // };

// // // ✅ Download and cache video file
// // export const getCachedVideoPath = async (url) => {
// //   if (!url) return null;

// //   try {
// //     const filename = url.split('/').pop().split('?')[0]; // remove query params
// //     const localPath = `${RNFS.CachesDirectoryPath}/${filename}`;

// //     const exists = await RNFS.exists(localPath);
// //     if (exists) {
// //       console.log('📁 Video loaded from cache:', localPath);
// //       return 'file://' + localPath;
// //     }

// //     console.log('⬇️ Downloading video:', url);
// //     const download = await RNFS.downloadFile({
// //       fromUrl: url,
// //       toFile: localPath,
// //     }).promise;

// //     if (download.statusCode === 200) {
// //       console.log('✅ Video cached:', localPath);
// //       return 'file://' + localPath;
// //     } else {
// //       console.warn('⚠️ Failed to download video:', url);
// //       return url;
// //     }
// //   } catch (err) {
// //     console.error('❌ Error caching video:', err);
// //     return url;
// //   }
// // };





//   import RNFS from 'react-native-fs';
//   import AsyncStorage from '@react-native-async-storage/async-storage';

//   const MAX_CACHE_SIZE = 15;
//   const movieCache = new Map();
//   const CACHE_KEY_PREFIX = 'movie_';

//   export const getCachedMovie = async (imdb_id) => {
//     if (movieCache.has(imdb_id)) {
//       const movie = movieCache.get(imdb_id);
//       movieCache.delete(imdb_id);
//       movieCache.set(imdb_id, movie);
//       return movie;
//     }

//     const raw = await AsyncStorage.getItem(CACHE_KEY_PREFIX + imdb_id);
//     if (raw) {
//       const data = JSON.parse(raw);
//       movieCache.set(imdb_id, data);
//       return data;
//     }

//     return null;
//   };

//   export const setCachedMovie = async (imdb_id, data) => {
//     if (!imdb_id || !data) return;

//     if (movieCache.has(imdb_id)) {
//       movieCache.delete(imdb_id);
//     } else if (movieCache.size >= MAX_CACHE_SIZE) {
//       const oldestKey = movieCache.keys().next().value;
//       movieCache.delete(oldestKey);
//     }

//     movieCache.set(imdb_id, data);
//     await AsyncStorage.setItem(CACHE_KEY_PREFIX + imdb_id, JSON.stringify(data));
//     console.log(`🎬 Cached movie: ${imdb_id}`);
//   };

//   // ✅ VIDEO CACHE FUNCTION
//   export const getCachedVideoPath = async (url) => {
//     if (!url) return null;

//     try {
//       // create unique filename from video URL
//       const filename = url.split('/').pop().split('?')[0];
//       const localPath = `${RNFS.CachesDirectoryPath}/${filename}`;

//       // check if already exists
//       const exists = await RNFS.exists(localPath);
//       if (exists) {
//         console.log('📁 Using cached video:', localPath);
//         return 'file://' + localPath;
//       }

//       // otherwise download it once
//       console.log('⬇️ Downloading video:', url);
//       const result = await RNFS.downloadFile({
//         fromUrl: url,
//         toFile: localPath,
//       }).promise;

//       if (result.statusCode === 200) {
//         console.log('✅ Cached video at:', localPath);
//         return 'file://' + localPath;
//       } else {
//         console.warn('⚠️ Failed to download video:', url);
//         return url;
//       }
//     } catch (err) {
//       console.error('❌ Video caching error:', err);
//       return url;
//     }
//   };





// // // Simple in-memory LRU Cache (Max 15 movies)
// // const MAX_CACHE_SIZE = 15;
// // const movieCache = new Map(); // key = imdb_id, value = movie object

// // export const getCachedMovie = (imdb_id) => {
// //   if (movieCache.has(imdb_id)) {
// //     const movie = movieCache.get(imdb_id);
// //     movieCache.delete(imdb_id);
// //     movieCache.set(imdb_id, movie); // refresh LRU position
// //     return movie;
// //   }
// //   return null;
// // };

// // export const setCachedMovie = (imdb_id, data) => {
// //   if (!imdb_id || !data) return;

// //   if (movieCache.has(imdb_id)) {
// //     movieCache.delete(imdb_id);
// //   } else if (movieCache.size >= MAX_CACHE_SIZE) {
// //     const oldestKey = movieCache.keys().next().value;
// //     movieCache.delete(oldestKey); // evict LRU
// //   }

// //   movieCache.set(imdb_id, data);

// //   // ✅ Console current cache size and IDs
// //   console.log(
// //     `🎬 Movie added to cache: ${imdb_id} | Total cached: ${movieCache.size}/${MAX_CACHE_SIZE}`
// //   );

// //   // Optional: print all cached movie IDs (for debugging)
// //   console.log("🧠 Cached movie IDs:", Array.from(movieCache.keys()));
// // };

// // export const clearMovieCache = () => {
// //   movieCache.clear();
// //   console.log("🧹 Movie cache cleared.");
// // };

// // export const getCacheSize = () => movieCache.size;

// Simple in-memory LRU Cache (Max 15 movies)
const MAX_CACHE_SIZE = 15;
const movieCache = new Map(); // key = imdb_id, value = movie object

export const getCachedMovie = (imdb_id) => {
  if (movieCache.has(imdb_id)) {
    const movie = movieCache.get(imdb_id);
    movieCache.delete(imdb_id);
    movieCache.set(imdb_id, movie); // refresh LRU position
    return movie;
  }
  return null;
};

export const setCachedMovie = (imdb_id, data) => {
  if (!imdb_id || !data) return;

  if (movieCache.has(imdb_id)) {
    movieCache.delete(imdb_id);
  } else if (movieCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = movieCache.keys().next().value;
    movieCache.delete(oldestKey); // evict LRU
  }

  movieCache.set(imdb_id, data);

  // ✅ Console current cache size and IDs
  console.log(
    `🎬 Movie added to cache: ${imdb_id} | Total cached: ${movieCache.size}/${MAX_CACHE_SIZE}`
  );

  // Optional: print all cached movie IDs (for debugging)
  console.log("🧠 Cached movie IDs:", Array.from(movieCache.keys()));
};

export const clearMovieCache = () => {
  movieCache.clear();
  console.log("🧹 Movie cache cleared.");
};

export const getCacheSize = () => movieCache.size;