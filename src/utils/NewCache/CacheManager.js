// import { CacheManager } from './CacheManager';

// // Initialize and monitor cache
// const cacheManager = new CacheManager();

// // Check and clean cache if needed
// await cacheManager.monitorCache();

// // Get current cache size
// const size = await cacheManager.getTotalCacheSize();
// console.log('Cache size:', (size / (1024 * 1024)).toFixed(2), 'MB');

// // Manual cleanup
// await cacheManager.clearOldCache();







import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { readDir, stat, unlink, readDirAssets, exists, mkdir, DocumentDirectoryPath, CachesDirectoryPath } from 'react-native-fs';

class CacheManager {
  constructor() {
    this.cacheLimit = 100 * 1024 * 1024; // 20MB in bytes
    this.clearPercentage = 0.5; // 50%
  }

  // Get total cache size
  async getTotalCacheSize() {
    try {
      const cachePath = CachesDirectoryPath;
      const documentPath = DocumentDirectoryPath;
      
      const cacheSize = await this.getFolderSize(cachePath);
      const documentCacheSize = await this.getFolderSize(documentPath);
      
      const totalSize = cacheSize + documentCacheSize;
      console.log('Total Cache Size:', (totalSize / (1024 * 1024)).toFixed(2), 'MB');
      
      return totalSize;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  // Calculate folder size recursively
  async getFolderSize(folderPath) {
    try {
      if (!(await exists(folderPath))) {
        return 0;
      }

      const items = await readDir(folderPath);
      let totalSize = 0;

      for (const item of items) {
        if (item.isDirectory()) {
          totalSize += await this.getFolderSize(item.path);
        } else {
          const fileStats = await stat(item.path);
          totalSize += fileStats.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating folder size:', error);
      return 0;
    }
  }

  // Get all files with their stats
  async getAllFilesWithStats(folderPath, fileList = []) {
    try {
      if (!(await exists(folderPath))) {
        return fileList;
      }

      const items = await readDir(folderPath);

      for (const item of items) {
        if (item.isDirectory()) {
          await this.getAllFilesWithStats(item.path, fileList);
        } else {
          try {
            const fileStat = await stat(item.path);
            fileList.push({
              path: item.path,
              size: fileStat.size,
              mtime: fileStat.mtime || new Date(0) // Last modified time
            });
          } catch (error) {
            console.warn('Error getting file stats:', error);
          }
        }
      }

      return fileList;
    } catch (error) {
      console.error('Error getting files with stats:', error);
      return fileList;
    }
  }

  // Clear old cache files
  async clearOldCache() {
    try {
      console.log('Starting cache cleanup...');
      
      const cachePath = CachesDirectoryPath;
      const documentPath = DocumentDirectoryPath;
      
      // Get all files from both cache and document directories
      const cacheFiles = await this.getAllFilesWithStats(cachePath);
      const documentFiles = await this.getAllFilesWithStats(documentPath);
      
      const allFiles = [...cacheFiles, ...documentFiles];
      
      if (allFiles.length === 0) {
        console.log('No files found to clear');
        return;
      }

      // Sort files by modification time (oldest first)
      allFiles.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());
      
      // Calculate how many files to remove (50%)
      const filesToRemove = Math.ceil(allFiles.length * this.clearPercentage);
      
      console.log(`Total files: ${allFiles.length}, Removing: ${filesToRemove} files`);
      
      let removedCount = 0;
      let removedSize = 0;

      // Remove oldest files
      for (let i = 0; i < filesToRemove && i < allFiles.length; i++) {
        try {
          await unlink(allFiles[i].path);
          removedCount++;
          removedSize += allFiles[i].size;
        } catch (error) {
          console.warn('Error removing file:', allFiles[i].path, error);
        }
      }

      console.log(`Cache cleanup completed: Removed ${removedCount} files, ${(removedSize / (1024 * 1024)).toFixed(2)} MB`);
      
      return {
        removedCount,
        removedSize,
        remainingFiles: allFiles.length - removedCount
      };
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Monitor and manage cache
  async monitorCache() {
    try {
      const currentSize = await this.getTotalCacheSize();
      const currentSizeMB = currentSize / (1024 * 1024);
      
      console.log(`Current cache size___daata: ${currentSizeMB.toFixed(2)} MB`);
      
      if (currentSize >= this.cacheLimit) {
        console.log(`Cache limit exceeded (${currentSizeMB.toFixed(2)} MB >= 100 MB). Cleaning up...`);
        
        const result = await this.clearOldCache();
        
        const newSize = await this.getTotalCacheSize();
        const newSizeMB = newSize / (1024 * 1024);
        
        console.log(`Cache cleanup completed. New size: ${newSizeMB.toFixed(2)} MB`);
        
        return {
          cleaned: true,
          oldSize: currentSizeMB,
          newSize: newSizeMB,
          details: result
        };
      } else {
        console.log(`Cache size (${currentSizeMB.toFixed(2)} MB) is within limits`);
        return {
          cleaned: false,
          currentSize: currentSizeMB
        };
      }
    } catch (error) {
      console.error('Error monitoring cache:', error);
      throw error;
    }
  }

  // Force clear all cache
  async clearAllCache() {
    try {
      const cachePath = CachesDirectoryPath;
      const documentPath = DocumentDirectoryPath;
      console.log('calll__data__')
      await this.clearFolder(cachePath);
      await this.clearFolder(documentPath);
      
      console.log('All cache cleared successfully');
    } catch (error) {
      console.error('Error clearing all cache:', error);
      throw error;
    }
  }

  // Clear specific folder
  async clearFolder(folderPath) {
    try {
      if (!(await exists(folderPath))) {
        return;
      }

      const items = await readDir(folderPath);

      for (const item of items) {
        if (item.isDirectory()) {
          await this.clearFolder(item.path);
          // Optionally remove the empty directory
          await unlink(item.path);
        } else {
          try {
            await unlink(item.path);
          } catch (error) {
            console.warn('Error removing file:', item.path, error);
          }
        }
      }
    } catch (error) {
      console.error('Error clearing folder:', error);
      throw error;
    }
  }
}

// React Component to use the Cache Manager
const CacheManagerComponent = () => {
  const [cacheInfo, setCacheInfo] = useState({
    size: 0,
    status: 'Checking...',
    lastCleanup: null
  });

  const cacheManager = new CacheManager();

  useEffect(() => {
    initializeCacheMonitoring();
  }, []);

  const initializeCacheMonitoring = async () => {
    try {
      // Initial cache check
      await checkCache();
      
      // Monitor cache every 5 minutes
      const interval = setInterval(checkCache, 5 * 100 * 1000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error initializing cache monitoring:', error);
    }
  };

  const checkCache = async () => {
    try {
      const result = await cacheManager.monitorCache();
      
      setCacheInfo({
        size: result.cleaned ? result.newSize : result.currentSize,
        status: result.cleaned ? 'Cleaned' : 'Within Limits',
        lastCleanup: result.cleaned ? new Date() : cacheInfo.lastCleanup
      });

      if (result.cleaned) {
        Alert.alert(
          'Cache Cleaned',
          `Cache was automatically cleaned. Removed ${result.details.removedCount} files.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking cache:', error);
      setCacheInfo(prev => ({
        ...prev,
        status: 'Error'
      }));
    }
  };

  const manualCleanup = async () => {
    try {
      const result = await cacheManager.clearOldCache();
      const newSize = await cacheManager.getTotalCacheSize();
      
      setCacheInfo({
        size: newSize / (1024 * 1024),
        status: 'Manually Cleaned',
        lastCleanup: new Date()
      });

      Alert.alert(
        'Cache Cleaned',
        `Removed ${result.removedCount} files. Freed ${(result.removedSize / (1024 * 1024)).toFixed(2)} MB`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to clean cache');
      console.error('Manual cleanup error:', error);
    }
  };

  const clearAllCache = async () => {
    try {
      await cacheManager.clearAllCache();
      const newSize = await cacheManager.getTotalCacheSize();
      
      setCacheInfo({
        size: newSize / (1024 * 1024),
        status: 'All Cleared',
        lastCleanup: new Date()
      });

      Alert.alert('Success', 'All cache cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear all cache');
      console.error('Clear all cache error:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Cache Manager
      </Text>
      
      <Text>Current Size: {cacheInfo.size.toFixed(2)} MB</Text>
      <Text>Status: {cacheInfo.status}</Text>
      <Text>
        Last Cleanup: {cacheInfo.lastCleanup ? cacheInfo.lastCleanup.toLocaleTimeString() : 'Never'}
      </Text>

      <View style={{ marginTop: 20, gap: 10 }}>
        <Button title="Check Cache Now" onPress={checkCache} />
        <Button title="Manual Cleanup (50%)" onPress={manualCleanup} />
        <Button title="Clear All Cache" onPress={clearAllCache} color="red" />
      </View>
    </View>
  );
};

// Simple Button component (you can replace with your own)
const Button = ({ title, onPress, color = '#007AFF' }) => (
  <View
    style={{
      backgroundColor: color,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
  </View>
);

export default CacheManager;
export { CacheManager };