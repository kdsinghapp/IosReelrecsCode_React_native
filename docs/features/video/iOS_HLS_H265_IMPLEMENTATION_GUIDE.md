# iOS HLS H.265/HEVC Implementation Guide
## Complete Reference for Video Encoding and Playback on iOS

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [Apple's HLS Requirements for iOS](#apples-hls-requirements-for-ios)
3. [Video Encoding Standards](#video-encoding-standards)
4. [React Native Video Player Configuration](#react-native-video-player-configuration)
5. [Directory Structure and File Naming](#directory-structure-and-file-naming)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Testing and Validation](#testing-and-validation)

---

## Executive Summary

This document provides a complete reference for implementing HLS H.265/HEVC video playback on iOS devices. It combines Apple's official requirements, our successful encoding practices, and React Native video player configuration that enables smooth H.265 playback on iOS.

**Key Success Factors:**
1. Use fragmented MP4 (fMP4) format with `.m4s` segments - NOT `.ts` segments
2. Set `preferredForwardBufferDuration: 5` to allow init segment buffering
3. Use `hvc1` codec tag (not `hev1`) in the encoded video
4. Ensure S3 bucket files are publicly accessible with proper CORS configuration
5. Create proper HLS manifest structure with master and variant playlists

---

## Apple's HLS Requirements for iOS

### Core Requirements (from Apple HLS Tools Documentation)

1. **Fragmented MP4 Format (Critical for H.265)**
   - iOS does NOT support H.265/HEVC in MPEG-TS (.ts) containers
   - Must use fragmented MP4 with initialization segments
   - File structure: `init.mp4` + `segment001.m4s`, `segment002.m4s`, etc.

2. **HLS Playlist Structure**
   ```
   master.m3u8 (or tt[imdbId].m3u8)
   ├── 320p/stream_v0.m3u8
   │   ├── init_v0.mp4
   │   └── seg_v0_00001.m4s, seg_v0_00002.m4s...
   ├── 480p/stream_v1.m3u8
   │   ├── init_v1.mp4
   │   └── seg_v1_00001.m4s, seg_v1_00002.m4s...
   └── 720p/stream_v2.m3u8
       ├── init_v2.mp4
       └── seg_v2_00001.m4s, seg_v2_00002.m4s...
   ```

3. **Codec Declaration Requirements**
   - Master playlist must declare: `CODECS="hvc1.1.6.L63.90,mp4a.40.2"`
   - Use `hvc1` tag (NOT `hev1`) for iOS compatibility
   - Include both video and audio codec specifications

4. **HLS Version Requirements**
   - Minimum HLS version 7 for fMP4 support
   - Use `#EXT-X-VERSION:7` in playlists
   - Include `#EXT-X-MAP:URI="init.mp4"` for init segment

5. **Server Requirements**
   - HTTP/2 support recommended for low-latency streaming
   - Proper CORS headers for cross-origin playback
   - Content-Type: `application/vnd.apple.mpegurl` for playlists
   - Content-Type: `video/mp4` for segments

---

## Video Encoding Standards

### Working FFmpeg Configuration (PowerShell Script)

```powershell
# Critical encoding parameters for iOS H.265/HEVC compatibility
ffmpeg -hide_banner -y -i "$InPath" `
-filter_complex "[0:v]split=3[v0][v1][v2]..." `
# For each quality variant:
-c:v:0 libx265 -preset:v:0 medium -crf:v:0 23 `
-x265-params:v:0 "keyint=144:min-keyint=144:scenecut=0:open-gop=0:repeat-headers=1" `
-b:v:0 [bitrate] -maxrate:v:0 [maxrate] -bufsize:v:0 [bufsize] `
-pix_fmt:v:0 yuv420p `
-force_key_frames:v:0 "expr:gte(t,n_forced*6)" `
-tag:v:0 hvc1 `  # CRITICAL: Must use hvc1, not hev1
-c:a:0 aac -b:a:0 [audio_bitrate] -ac:a:0 2 -ar:a:0 48000 `
# HLS output configuration:
-f hls -hls_time 6 -hls_playlist_type vod `
-hls_flags independent_segments+program_date_time `
-hls_segment_type fmp4 `  # CRITICAL: Use fmp4, not mpegts
-hls_fmp4_init_filename "init_v%v.mp4" `
-hls_segment_filename "seg_v%v_%05d.m4s" `
-master_pl_name "master.m3u8" `
-var_stream_map "v:0,a:0,name:320p v:1,a:1,name:480p v:2,a:2,name:720p"
```

### Bitrate Configuration
| Quality | Resolution | Video Bitrate | Max Rate | Buffer Size | Audio |
|---------|------------|---------------|----------|-------------|-------|
| 320p    | 320x180    | 400k         | 600k     | 1200k       | 64k   |
| 480p    | 480x270    | 900k         | 1300k    | 2600k       | 96k   |
| 720p    | 720x404    | 2000k        | 3000k    | 6000k       | 128k  |

### Key Encoding Parameters Explained
- **keyint=144**: Keyframe every 6 seconds (24fps × 6s = 144 frames)
- **scenecut=0**: Disable scene change detection for consistent segments
- **open-gop=0**: Closed GOPs for clean segment boundaries
- **repeat-headers=1**: Include SPS/PPS in every keyframe
- **hvc1 tag**: Required for iOS H.265 decoder initialization
- **yuv420p**: 4:2:0 chroma subsampling (iOS requirement)

---

## React Native Video Player Configuration

### Critical iOS Properties for H.265

```javascript
// From FeedCard.tsx and MovieDetailScreen.tsx (WORKING CONFIGURATION)
<Video
  source={{ uri: trailer_url }}
  // iOS-specific H.265/HEVC configuration
  preferredForwardBufferDuration={5}  // CRITICAL: Must be > 0 for init segment
  maxBitRate={8000000}  // 8 Mbps - must exceed highest segment bitrate

  // Android buffer configuration
  bufferConfig={{
    minBufferMs: 3000,    // 3 seconds minimum buffer
    maxBufferMs: 10000,   // 10 seconds maximum buffer
    bufferForPlaybackMs: 1000,
    bufferForPlaybackAfterRebufferMs: 2000,
    maxHeapAllocationPercent: 0.8,
    minBackBufferMemoryReservePercent: 0.1,
    minBufferMemoryReservePercent: 0.1,
    backBufferDurationMs: 30000
  }}

  // Error handling for H.265-specific issues
  onError={(error) => {
    const errorCode = error?.error?.code;
    switch (errorCode) {
      case '-11850':
        // H.265 not supported in iOS Simulator
        console.log('HEVC not supported in Simulator');
        break;
      case '-12938':
        // HEVC decoder initialization failed
        Alert.alert('Video Error', 'HEVC decoder failed');
        break;
      case '-16840':
        // Format not supported (wrong codec tag)
        console.log('Check codec tag - must be hvc1');
        break;
    }
  }}
/>
```

### Why These Settings Matter

1. **preferredForwardBufferDuration: 5**
   - Allows iOS to buffer the init segment (contains HEVC decoder configuration)
   - Setting to 0 prevents init segment loading = black screen
   - 5 seconds provides enough time for init + first segments

2. **maxBitRate: 8000000**
   - Must exceed your highest segment bitrate (720p @ ~3-6 Mbps)
   - iOS rejects segments exceeding this limit
   - 8 Mbps provides headroom for bitrate spikes

3. **Buffer Configuration (Android)**
   - Android's ExoPlayer is more forgiving with H.265
   - Still requires proper buffering for smooth playback
   - Lower values = faster start, higher values = fewer rebuffers

---

## Directory Structure and File Naming

### S3 Bucket Structure
```
s3://your-bucket/
├── videos/
│   ├── tt0133093/          # Movie ID directory
│   │   ├── tt0133093.m3u8  # Master playlist (or master.m3u8)
│   │   ├── stream_v0.m3u8  # 320p variant playlist
│   │   ├── stream_v1.m3u8  # 480p variant playlist
│   │   ├── stream_v2.m3u8  # 720p variant playlist
│   │   ├── init_v0.mp4     # 320p init segment
│   │   ├── init_v1.mp4     # 480p init segment
│   │   ├── init_v2.mp4     # 720p init segment
│   │   ├── seg_v0_00001.m4s # 320p segments
│   │   ├── seg_v1_00001.m4s # 480p segments
│   │   └── seg_v2_00001.m4s # 720p segments
```

### Master Playlist Format
```m3u8
#EXTM3U
#EXT-X-VERSION:7
#EXT-X-STREAM-INF:BANDWIDTH=464000,RESOLUTION=320x180,CODECS="hvc1.1.6.L63.90,mp4a.40.2"
stream_v0.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=996000,RESOLUTION=480x270,CODECS="hvc1.1.6.L90.90,mp4a.40.2"
stream_v1.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2128000,RESOLUTION=720x404,CODECS="hvc1.1.6.L93.90,mp4a.40.2"
stream_v2.m3u8
```

### Variant Playlist Format
```m3u8
#EXTM3U
#EXT-X-VERSION:7
#EXT-X-TARGETDURATION:7
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="init_v0.mp4"
#EXTINF:6.000000,
seg_v0_00001.m4s
#EXTINF:6.000000,
seg_v0_00002.m4s
#EXT-X-ENDLIST
```

---

## Common Issues and Solutions

### Issue 1: Black Screen / Poster Only (Most Common)
**Symptoms:** Video shows poster but won't play, no audio
**Causes & Solutions:**
1. **S3 Permissions**: Files must be publicly readable
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::bucket-name/*"
     }]
   }
   ```

2. **Wrong Container Format**: Using `.ts` instead of `.m4s`
   - Solution: Re-encode with `-hls_segment_type fmp4`

3. **Missing Init Segment**: No `init.mp4` file
   - Solution: Ensure `-hls_fmp4_init_filename` is set

4. **preferredForwardBufferDuration = 0**
   - Solution: Set to 5 seconds minimum

### Issue 2: Decoder Initialization Failed (Error -12938)
**Cause:** Wrong codec tag or malformed init segment
**Solution:**
- Use `-tag:v hvc1` (not hev1) in FFmpeg
- Verify init segment with: `ffprobe -show_streams init.mp4`

### Issue 3: Segments Won't Load (Error -12642)
**Cause:** maxBitRate too low for segment bitrate
**Solution:** Set maxBitRate to 8000000 (8 Mbps)

### Issue 4: iOS Simulator Issues (Error -11850)
**Cause:** iOS Simulator doesn't support hardware H.265 decoding
**Solution:** Test on physical iOS device

---

## Testing and Validation

### 1. Validate HLS Stream
```bash
# Use Apple's mediastreamvalidator tool
mediastreamvalidator https://your-cdn.com/videos/tt0133093/tt0133093.m3u8
```

### 2. Check Codec Information
```bash
# Verify init segment has hvc1 codec
ffprobe -show_streams init_v0.mp4 | grep codec_tag_string
# Output should show: codec_tag_string=hvc1
```

### 3. Test Segment Accessibility
```bash
# Each segment should return 200 OK
curl -I https://your-cdn.com/videos/tt0133093/seg_v0_00001.m4s
```

### 4. React Native Debug Logs
```javascript
// Add to video component for debugging
onLoadStart={() => console.log('Loading HLS stream...')}
onLoad={(data) => console.log('Stream loaded:', data)}
onBuffer={({isBuffering}) => console.log('Buffering:', isBuffering)}
onError={(error) => console.log('Video error:', error)}
```

### 5. Physical Device Testing
- **Required**: Test on physical iOS device (iPhone/iPad)
- **iOS Version**: iOS 11+ for HEVC support
- **Network**: Test on both WiFi and cellular
- **Bitrate Adaptation**: Verify quality switches smoothly

---

## Quick Checklist for H.265 HLS on iOS

✅ **Encoding:**
- [ ] Using fMP4 segments (`.m4s` files)
- [ ] Init segments present (`init.mp4` files)
- [ ] Codec tag is `hvc1` (not `hev1`)
- [ ] Master playlist with CODECS declaration
- [ ] 6-second segments with consistent keyframes

✅ **Server/CDN:**
- [ ] Files publicly accessible
- [ ] CORS headers configured
- [ ] Content-Type headers correct
- [ ] HTTP/2 enabled (optional but recommended)

✅ **React Native:**
- [ ] preferredForwardBufferDuration >= 5
- [ ] maxBitRate >= highest segment bitrate
- [ ] Error handling for H.265 errors
- [ ] Buffer configuration for smooth playback

✅ **Testing:**
- [ ] Validated with mediastreamvalidator
- [ ] Tested on physical iOS device
- [ ] All quality variants playing
- [ ] Smooth bitrate switching

---

## Conclusion

Successful H.265/HEVC HLS playback on iOS requires careful attention to:
1. **Encoding format** (must be fMP4, not MPEG-TS)
2. **Codec configuration** (hvc1 tag is critical)
3. **React Native settings** (buffer duration and bitrate limits)
4. **File accessibility** (public S3 permissions)

Following this guide ensures reliable H.265 video playback across all iOS devices while maintaining efficient bandwidth usage through HEVC compression.

---

*Document Version: 1.0*
*Last Updated: November 2024*
*Based on: Apple HLS Tools documentation, FFmpeg H.265 encoding, React Native Video v6.17.0*