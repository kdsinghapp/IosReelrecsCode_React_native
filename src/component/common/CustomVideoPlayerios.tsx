 
// import React, { useRef, useState, useEffect } from "react";
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   Dimensions,
//   TouchableWithoutFeedback,
// } from "react-native";
// import Video from "react-native-video";
// import SvgImage from "../../assets/svg/svgImage";

// const { height } = Dimensions.get("window");

// interface Props {
//   videoUrl: string;
//   muted?: boolean;
// }

// const CustomVideoPlayer: React.FC<Props> = ({ videoUrl, muted = false }) => {
//   const videoRef = useRef<any>(null);
//   const hideTimer = useRef<NodeJS.Timeout | null>(null);

//   const [paused, setPaused] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [progressWidth, setProgressWidth] = useState(0);

//   /* ================= AUTO HIDE CONTROLS ================= */
//   const startAutoHide = () => {
//     if (hideTimer.current) clearTimeout(hideTimer.current);

//     hideTimer.current = setTimeout(() => {
//       setShowControls(false);
//     }, 2000);
//   };

//   useEffect(() => {
//     startAutoHide();
//     return () => {
//       if (hideTimer.current) clearTimeout(hideTimer.current);
//     };
//   }, []);

//   /* ================= TIME FORMAT ================= */
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   /* ================= SEEK ================= */
//   const seekBy = (seconds: number) => {
//     const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
//     videoRef.current?.seek(newTime);
//     setCurrentTime(newTime);
//     startAutoHide();
//   };

//   const handleSeek = (e: any) => {
//     if (!duration) return;
//     const seekTime = (e.nativeEvent.locationX / progressWidth) * duration;
//     videoRef.current?.seek(seekTime);
//     setCurrentTime(seekTime);
//     startAutoHide();
//   };

//   return (
//     <TouchableWithoutFeedback
//       onPress={() => {
//         setShowControls(true);
//         startAutoHide();
//       }}
//     >
//       <View style={styles.container}>
//         {/* VIDEO */}
//         <Video
//           ref={videoRef}
//           source={{ uri: videoUrl }}
//           style={styles.video}
//           resizeMode="contain"
//           paused={paused}
//           muted={muted}
//           onProgress={(d) => setCurrentTime(d.currentTime)}
//           onLoad={(d) => setDuration(d.duration)}
//           progressUpdateInterval={250}
//         />

//         {/* CONTROLS */}
//         {showControls && (
//           <View style={styles.overlay}>
//             {/* CENTER CONTROLS */}
//             <View style={styles.centerControls}>
//               <TouchableOpacity onPress={() => seekBy(-10)}>
//                 <SvgImage.Timeplay />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   setPaused(!paused);
//                   startAutoHide();
//                 }}
//               >
//                 {paused ? <SvgImage.Play /> : <SvgImage.Pause />}
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => seekBy(10)}>
//                 <SvgImage.Second />
//               </TouchableOpacity>
//             </View>

//             {/* BOTTOM BAR */}
//             <View style={styles.bottomBar}>
//               <View
//                 style={styles.progressBar}
//                 onLayout={(e) =>
//                   setProgressWidth(e.nativeEvent.layout.width)
//                 }
//               >
//                 <TouchableWithoutFeedback onPress={handleSeek}>
//                   <View style={styles.progressBg}>
//                     <View
//                       style={[
//                         styles.progressFill,
//                         {
//                           width: duration
//                             ? `${(currentTime / duration) * 100}%`
//                             : "0%",
//                         },
//                       ]}
//                     />
//                   </View>
//                 </TouchableWithoutFeedback>
//               </View>
//             </View>

//             {/* TIME */}
//             <View style={styles.timeRow}>
//               <Text style={styles.time}>{formatTime(currentTime)}</Text>
//               <Text style={styles.time}>{formatTime(duration)}</Text>
//             </View>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default CustomVideoPlayer;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: {
//    },
//   video: {
//     height: height / 3.9,
//     width: "100%",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//      justifyContent: "space-between",
//    },
//   centerControls: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 20,
//   },
//   bottomBar: {
//     paddingHorizontal: 10,
//   },
//   progressBar: {
//     width: "100%",
//   },
//   progressBg: {
//     height: 4,
//     backgroundColor: "#888",
//     borderRadius: 2,
//   },
//   progressFill: {
//     height: 4,
//     backgroundColor: "#fff",
//     borderRadius: 2,
//   },
//   timeRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     paddingBottom: 8,
//   },
//   time: {
//     color: "#fff",
//     fontSize: 12,
//   },
// });
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import Video from "react-native-video";
import SvgImage from "../../assets/svg/svgImage";
import { useNavigation  ,useFocusEffect} from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

interface Props {
  videoUrl: string;
  muted?: boolean;
}

const CustomVideoPlayer: React.FC<Props> = ({ videoUrl, muted = false, paused = false ,  isModalOpen ,
 }) => {
  const videoRef = useRef<Video>(null);
  const hideTimer = useRef<any>(null);
 
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // ✅ Internal paused state for proper control
  const [isPaused, setIsPaused] = useState(paused);

  // useEffect(() => {
  //   setIsPaused(paused);
  // }, [paused]);

  /* ================= AUTO HIDE ================= */
  const startAutoHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    startAutoHide();
    return () => hideTimer.current && clearTimeout(hideTimer.current);
  }, []);

  /* ================= TIME FORMAT ================= */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
 

  /* ================= SEEK ================= */
  const seekBy = (sec: number) => {
    const newTime = Math.min(Math.max(currentTime + sec, 0), duration);
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
    startAutoHide();
  };

const handlePlayPause = () => {
  if (isModalOpen == true) {
    setIsPaused(true); // ⏸ force pause
    return;
  }

  setIsPaused(prev => !prev);
  startAutoHide();
};


// useEffect(() => {
//   if (!isModalOpen) {
//     setIsPaused(true);          // ⏸ lock
//     videoRef.current?.seek(0);  // optional reset
//   }
// }, [isModalOpen]);



  const onSeekPress = (e: any) => {
    if (!duration || !progressWidth) return;
    const x = e.nativeEvent.locationX;
    const seekTime = (x / progressWidth) * duration;
    videoRef.current?.seek(seekTime);
    setCurrentTime(seekTime);
  };
  console.log("11111",isModalOpen)
// useFocusEffect(
//   useCallback(() => {
//     if (isModalOpen == "true") {
//       setIsPaused(true);
//       videoRef.current?.seek(0);
//     }
//   }, [isModalOpen])
// );



// console.log("isPaused",isPaused)
   return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowControls(true);
        startAutoHide();
      }}
    >
      <View style={styles.container}>
        {/* VIDEO */}
        <Video
         ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="contain"
          paused={isPaused} // ✅ use internal state
          muted={muted}
          onProgress={(d) => setCurrentTime(d.currentTime)}
          onLoad={(d) => setDuration(d.duration)}
          progressUpdateInterval={250}

        />

        {/* OVERLAY */}
        {showControls && (
          <View style={styles.overlay}>
            {/* CENTER CONTROLS */}
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={() => seekBy(-5)}>
                <SvgImage.Timeplay />
              </TouchableOpacity>

              <TouchableOpacity
              onPress={handlePlayPause}
                style={styles.playBtn}
                // onPress={() => {
                //   // setPaused(!paused);
                  
                //   startAutoHide();
                // }}
              >
                {isPaused ? <SvgImage.Play /> : <SvgImage.Pause />}
                {/* {paused ? <SvgImage.Play /> : <SvgImage.Pause />} */}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => seekBy(15)}>
                <SvgImage.Second />
              </TouchableOpacity>
            </View>

            {/* BOTTOM BAR */}
            <View style={styles.bottomBar}>
              <View
                style={styles.progressWrapper}
                onLayout={(e) =>
                  setProgressWidth(e.nativeEvent.layout.width)
                }
              >
                <TouchableWithoutFeedback onPress={onSeekPress}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: duration
                            ? `${(currentTime / duration) * 100}%`
                            : "0%",
                        },
                      ]}
                    >
       <View style={{
          position: "absolute",
  right: -6,        // dot end pe rahe
  top: -5,
  width: 15,
  height: 15,
  borderRadius: 10,
  backgroundColor: "#fff",
       }} />

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>

            </View>
          </View>
        )}

              <View style={[styles.timeRow,{
                marginLeft:13
                }]}>
                <Text style={styles.timeText}>
                  <Text style={{
                    color:"white"
                  }}>
                  {formatTime(currentTime)}  
                  </Text>
                   <Text style={{
                    color:"gray"
                  }}>
                 {" "}  {formatTime(duration)}
                   </Text>
                </Text>
                 
              </View>
      </View>
      
    </TouchableWithoutFeedback>
  );
};

export default CustomVideoPlayer;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: height / 3.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
  },
  centerControls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
  },
  playBtn: {
    padding: 12,
  },
  bottomBar: {
    paddingHorizontal: 10,
    bottom:90
   },
  progressWrapper: {
    width: "100%",
  },
  progressBg: {
    height: 4.5,
    backgroundColor: "rgba(255,255,255,0.4)",
   },
  progressFill: {
    height: 4.5,
    backgroundColor: "#fff",
   },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },
});
