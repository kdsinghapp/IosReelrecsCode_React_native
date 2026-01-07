// ReactNativeVideoCacheManager-WITH-PERMISSION.js
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { requestStoragePermission } from './requestStoragePermission';
const ReactNativeVideoCacheManager = {
  cacheSizeThreshold: 20 * 1024 * 1024, // 20MB
  intervalId: null,
  hasPermissions: false,

  // ✅ Initialize with permission check
  async initialize() {
    console.log('🔐 Initializing cache manager with permissions...');
    
    if (Platform.OS === 'android') {
      this.hasPermissions = await requestStoragePermission();
      console.log(`📱 Permissions granted: ${this.hasPermissions}`);
    } else {
      this.hasPermissions = true; // iOS doesn't need these permissions
    }

    if (this.hasPermissions) {
      this.startMonitoring();
    }
    
    return this.hasPermissions;
  },

  // ✅ Start monitoring only if permissions granted
  startMonitoring() {
    if (!this.hasPermissions) {
      console.log('❌ Cannot start monitoring: No permissions');
      return;
    }

    console.log('🎬 Starting cache monitor...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Immediate check
    this.simpleCacheCheck();
    
    // Regular monitoring
    this.intervalId = setInterval(() => {
      this.simpleCacheCheck();
    }, 15000);
  },

  // ✅ Stop monitoring
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Cache monitor stopped');
  },

  // ✅ Check only INTERNAL app directories (no permissions needed)
  async simpleCacheCheck() {
    if (!this.hasPermissions) {
      console.log('❌ No permissions for cache check');
      return { size: 0, files: [] };
    }

    try {
      console.log('\n=== 🔍 CACHE CHECK ===');
      
      let totalSize = 0;
      let videoFiles = [];

      // ONLY check internal app directories (no permissions needed)
      const internalLocations = this.getInternalAppDirectories();
      
      for (const location of internalLocations) {
        try {
          const result = await this.safeScanLocation(location);
          totalSize += result.size;
          videoFiles = videoFiles.concat(result.files);
        } catch (error) {
          console.log(`Skipping ${location}:`, error.message);
        }
      }

      console.log(`🎯 TOTAL CACHE: ${this.formatBytes(totalSize)}`);
      console.log(`📁 VIDEO FILES: ${videoFiles.length}`);
      
      if (videoFiles.length > 0) {
        videoFiles.slice(0, 3).forEach(file => {
          console.log(`   📄 ${file.name} - ${this.formatBytes(file.size)}`);
        });
      } else {
        console.log('   ℹ️ No video cache files found in internal storage');
      }

      // Cleanup if needed
      if (totalSize > this.cacheSizeThreshold && videoFiles.length > 0) {
        console.log(`🧹 CLEANUP TRIGGERED!`);
        await this.smartCleanup(videoFiles);
      }

      console.log('=== 🏁 CHECK COMPLETE ===\n');
      
      return { size: totalSize, files: videoFiles };

    } catch (error) {
      console.log('Cache check error:', error);
      return { size: 0, files: [] };
    }
  },

  // ✅ Get ONLY internal app directories (no permissions needed)
  getInternalAppDirectories() {
    const internalDirs = [
      RNFS.CacheDirectoryPath,      // /data/data/yourapp/cache
      RNFS.DocumentDirectoryPath,   // /data/data/yourapp/files  
      RNFS.TemporaryDirectoryPath,  // /data/data/yourapp/tmp
    ];

    // Filter valid paths
    return internalDirs.filter(path => path && typeof path === 'string');
  },

  // ✅ Safe location scanning
  async safeScanLocation(locationPath) {
    let totalSize = 0;
    let videoFiles = [];

    try {
      if (!locationPath || typeof locationPath !== 'string') {
        return { size: 0, files: [] };
      }

      const exists = await RNFS.exists(locationPath);
      if (!exists) {
        return { size: 0, files: [] };
      }

      const stats = await RNFS.stat(locationPath);
      
      if (stats.isDirectory()) {
        console.log(`📁 Scanning: ${locationPath}`);
        
        const files = await RNFS.readDir(locationPath);
        
        for (const file of files) {
          if (file.isFile() && this.isVideoRelatedFile(file.name)) {
            totalSize += file.size;
            videoFiles.push({
              path: file.path,
              name: file.name,
              size: file.size,
              mtime: file.mtime
            });
          }
        }
      }
    } catch (error) {
      console.log(`Scan error for ${locationPath}:`, error.message);
    }

    return { size: totalSize, files: videoFiles };
  },

  // ✅ Video file detection
  isVideoRelatedFile(filename) {
    if (!filename) return false;
    
    const name = filename.toLowerCase();
    
    const videoExtensions = ['.m3u8', '.ts', '.m4s', '.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const hasVideoExtension = videoExtensions.some(ext => name.endsWith(ext));
    
    const cacheKeywords = [
      'exo', 'player', 'video', 'media', 'stream', 'hls', 
      'segment', 'chunk', 'cache', 'temp', 'buff', 'download'
    ];
    const hasCacheKeyword = cacheKeywords.some(keyword => name.includes(keyword));
    
    return hasVideoExtension || hasCacheKeyword;
  },

  // ✅ Smart cleanup
  async smartCleanup(videoFiles) {
    if (!this.hasPermissions) {
      console.log('❌ No permissions for cleanup');
      return { deletedCount: 0, deletedSize: 0 };
    }

    try {
      console.log(`🧹 Smart cleanup starting... ${videoFiles.length} files`);
      
      videoFiles.sort((a, b) => a.mtime - b.mtime);
      
      const deleteCount = Math.ceil(videoFiles.length * 0.5);
      const filesToDelete = videoFiles.slice(0, deleteCount);
      
      let deletedSize = 0;
      let deletedCount = 0;
      
      for (const file of filesToDelete) {
        try {
          await RNFS.unlink(file.path);
          deletedSize += file.size;
          deletedCount++;
          console.log(`   🗑️ Deleted: ${file.name}`);
        } catch (error) {
          console.log(`   ❌ Failed: ${file.name}`);
        }
      }
      
      console.log(`✅ Cleanup completed: ${deletedCount} files, ${this.formatBytes(deletedSize)} freed`);
      
      return { deletedCount, deletedSize };
      
    } catch (error) {
      console.log('Cleanup error:', error);
      return { deletedCount: 0, deletedSize: 0 };
    }
  },

  // ✅ Format bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // ✅ Get cache info
  async getCacheInfo() {
    if (!this.hasPermissions) {
      return {
        size: 0,
        sizeFormatted: '0 Bytes',
        fileCount: 0,
        needsCleanup: false,
        hasPermissions: false
      };
    }

    try {
      const result = await this.simpleCacheCheck();
      return {
        size: result.size,
        sizeFormatted: this.formatBytes(result.size),
        fileCount: result.files.length,
        needsCleanup: result.size > this.cacheSizeThreshold,
        hasPermissions: true
      };
    } catch (error) {
      console.log('Get cache info error:', error);
      return {
        size: 0,
        sizeFormatted: '0 Bytes',
        fileCount: 0,
        needsCleanup: false,
        hasPermissions: this.hasPermissions
      };
    }
  },

  // ✅ Force cleanup
  async forceCleanup() {
    if (!this.hasPermissions) {
      console.log('❌ No permissions for force cleanup');
      return;
    }

    console.log('🔨 Force cleanup...');
    const result = await this.simpleCacheCheck();
    if (result.files.length > 0) {
      await this.smartCleanup(result.files);
    } else {
      console.log('ℹ️ No files to cleanup');
    }
    console.log('✅ Force cleanup completed');
  },

  // ✅ Create test cache
  async createTestCache() {
    if (!this.hasPermissions) {
      console.log('❌ No permissions to create test cache');
      return null;
    }

    try {
      console.log('🧪 Creating test cache...');
      
      const testDir = `${RNFS.CacheDirectoryPath}/video_test`;
      await RNFS.mkdir(testDir);
      
      const testFile = `${testDir}/test_video_${Date.now()}.ts`;
      const testContent = 'Test video cache content '.repeat(100);
      
      await RNFS.writeFile(testFile, testContent, 'utf8');
      
      const exists = await RNFS.exists(testFile);
      if (exists) {
        const stats = await RNFS.stat(testFile);
        console.log(`✅ Test file created: ${this.formatBytes(stats.size)}`);
        return testFile;
      }
      
      return null;
    } catch (error) {
      console.log('Test cache error:', error.message);
      return null;
    }
  },

  // ✅ Check permissions status
  getPermissionsStatus() {
    return this.hasPermissions;
  },

  // ✅ Re-request permissions
  async requestPermissionsAgain() {
    this.hasPermissions = await requestStoragePermission();
    return this.hasPermissions;
  }
};

export default ReactNativeVideoCacheManager;