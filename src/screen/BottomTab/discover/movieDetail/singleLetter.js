
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,

  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import imageIndex from '@assets/imageIndex';
import {
  ComparisonModal,
  CustomStatusBar,
  EpisodesModal,
  FeedbackModal,
  FriendthinkModal,
  HeaderCustom,
  MoreSheetModal,
  MovieInfoModal,
} from '@components';
import styles from './style';
import useMovie from './useMovie';
import ProgressBar from './ProgressBar';
import { Color } from '@theme/color';
import ScreenNameEnum from '@routes/screenName.enum';
import font from '@theme/font';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScoreIntroModal from '@components/modal/ScoreIntroModal/ScoreIntroModal';
import { useFocusEffect, useIsFocused, useRoute, useNavigation } from '@react-navigation/native';
import WatchNowModal from '@components/modal/WatchNowModal/WatchNowModal';
import { getEpisodes, getEpisodesBySeason, getMovieMetadata, recordTrailerInteraction } from '@redux/Api/movieApi';
import { getCommentsByMovie } from '@redux/Api/commentService';
import { getMatchingMovies } from '@redux/Api/ProfileApi';
import CompareModals from '../../ranking/rankingScreen/CompareModals';
import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
import { useBookmarks } from '@hooks/useBookmark';
import { useTrailerTracker } from '@hooks/useTrailerTracker';
import CustomText from '@components/common/CustomText';
import LinearGradient from 'react-native-linear-gradient';
import RankingWithInfo from '@components/ranking/RankingWithInfo';
import { RootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMute } from '@redux/feature/videoAudioSlice';
import MovieDetailsShimmer from './MovieDetailsShimmer';
import { getCachedMovie,  setCachedMovie } from '@redux/feature/movieCacheSlice/MovieCacheManager';
// import { clearVideoCache } from '@utils/VideoCacheManager/VideoCacheManager';
// import CommentModal from '@components/modal/comment/CommentModal';
const CommentModal = React.lazy(() =>
  import('../../../../component/modal/comment/CommentModal')
);

type MovieDetailScreenParams = {
  backnavigate: string;
};
const MovieDetailScreen = () => {
  const navigation = useNavigation();
  const {
    // watchModal, setWatchModal,
    episVisible, setEpisVisible,
    MorelikeModal, setMorelikeModal,
    InfoModal, setInfoModal,
    thinkModal, setthinkModal
  } = useMovie();
  const route = useRoute();
  const { imdb_idData, token } = route.params;
  const { toggleBookmark: toggleBookmarkHook } = useBookmarks(token);
  const isModalClosed = useSelector((state: RootState) => state.modal.isModalClosed);

  // NEW
const [movieData, setMovieData] = useState([]); // will be [meta, ...]
const [currentIndex, setCurrentIndex] = useState(0); // index of visible item


  // const [hasCommentError, setHasCommentError] = useState(false);
  // const [loadingComments, setLoadingComments] = useState(false);
  console.log(imdb_idData, 'imdb_idData__sdfghj')
  // const [savedMovies, setSavedMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  // const [showIntro, setShowIntro] = useState(true);
  // const [save, setSave] = useState(false);
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const BOTTOM_TAB_HEIGHT = 70;
  const ITEM_HEIGHT = windowHeight - BOTTOM_TAB_HEIGHT - insets.bottom;
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [watchNow, setWatchNow] = useState(false);
  // const [paused, setPaused] = useState(false);
  // const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const [sessionList, setSessionList] = useState<{ id: number; session: string }[]>([]);
  const [reviews, setReviews] = useState([])
  const [progress, setProgress] = useState(0);
  // const [videoIndex, setVideoIndex] = useState(null);
  const posterOpacity = useRef(new Animated.Value(1)).current;
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const trailerTracker = useTrailerTracker(token);
  // const [videopUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentSeedId, setCurrentSeedId] = useState(imdb_idData);
  const [matchingQueue, setMatchingQueue] = useState([]);
  // const fetchedIdsRef = useRef(new Set());
  const isInitialLoad = useRef(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const isResettingRef = useRef(false);
  const saveBookMark_Ref = useRef(false)
  const [modalMovieId, setModalMovieId] = useState(null);
  // const [titleLines, setTitleLines] = useState(1);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const dispatch = useDispatch()
  const isMuted = useSelector((state: RootState) => state.videoAudio.isMuted);
  const [isShowMuteIcon, setIsShowMuteIcon] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // explain scroll refs   
  // near other useState declarations
  const [preloaded, setPreloaded] = useState({}); // {0: true, 2: true}
const [isLoadingNewMovie, setIsLoadingNewMovie] = useState(false);

  useEffect(() => {
    console.log("📌 Current Screen:", route.name);
  }, [route]);

  const scrollRef = useRef(null);

  const [wholeContentHeight, setWholeContentHeight] = useState(1);
  const [visibleContentHeight, setVisibleContentHeight] = useState(0);
  const [scrollIndicatorHeight, setScrollIndicatorHeight] = useState(0);
  const [scrollIndicatorPosition, setScrollIndicatorPosition] = useState(0);
  const has_rated_ref = useRef(false);
  const [commetText, setCommentText] = useState('')
  const [isFeedbackModal, setIsFeedbackModal] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(!!is_bookMark);

  const [isSeeking, setIsSeeking] = useState(false);
  // 1) content size change -> total content height
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setWholeContentHeight(contentHeight || 1);
  };

  // 2) layout -> visible area height
  const handleLayout = ({ nativeEvent: { layout: { height } } }) => {
    setVisibleContentHeight(height || 0);
  };

  // 3) calculate indicator height whenever sizes change
  useEffect(() => {
    if (wholeContentHeight > 0 && visibleContentHeight > 0) {
      const ratio = visibleContentHeight / wholeContentHeight;
      const clampedRatio = Math.min(1, ratio);
      const minIndicatorHeight = 20;
      const calcHeight = Math.max(
        visibleContentHeight * clampedRatio,
        Math.min(minIndicatorHeight, visibleContentHeight)
      );
      setScrollIndicatorHeight(calcHeight);
    }
  }, [wholeContentHeight, visibleContentHeight, currentIndex, movieData]);

  // 4) onScroll -> update indicator position
  const handleScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
    const scrollableHeight = Math.max(0, wholeContentHeight - visibleContentHeight);
    const indicatorScrollableHeight = Math.max(0, visibleContentHeight - scrollIndicatorHeight);
    const position =
      scrollableHeight > 0 ? (y / scrollableHeight) * indicatorScrollableHeight : 0;
    setScrollIndicatorPosition(position);
  };

  const [bookmarkMap, setBookmarkMap] = useState<{ [k: string]: boolean }>({});
  const bookmarkMapRef = useRef(bookmarkMap);

  useEffect(() => {
    bookmarkMapRef.current = bookmarkMap;
  }, [bookmarkMap]);

  useEffect(() => {
    if (movieData && movieData[1]) {
      const m = movieData[1];
      if (m?.imdb_id) {
        setBookmarkMap(prev => ({ ...prev, [m.imdb_id]: !!m.is_bookmarked }));
      }
    }
  }, [movieData]); // optional: tune dependency to only run on initial meta set


  // Navigation effect
  useFocusEffect(
    useCallback(() => {
      // setIsScreenFocused(true);
      setIsVideoPaused(false);

      return () => {
        setIsVideoPaused(true);
        trailerTracker.triggerInteractionIfAny();
        trailerTracker.resetTracker();
      };
    }, [])
  );

 

useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true);

    // ✅ Step 1: Check cache first
    let meta = getCachedMovie(imdb_idData);
    console.log('cache__data__from___', meta);

    // ✅ Step 2: If not found, call API and then cache it
    if (!meta) {
      meta = await getMovieMetadata(token, imdb_idData);
      console.log('moive__call from line 321 , imdb_idData__ ',imdb_idData)
      setCachedMovie(imdb_idData, meta); // store in cache
      console.log('📡 fetched_from_api:', imdb_idData);
    } else {
      console.log('⚡ loaded_from_cache:', imdb_idData);
    }

    // ✅ Step 3: Fetch matching movies (can also cache later if needed)
    const matching = await getMatchingMovies(token, imdb_idData);


// NEW
setMovieData([meta]);
setCurrentSeedId(imdb_idData);
setSelectedMovie(meta?.imdb_id);
setMatchingQueue(matching?.results || []);
    saveBookMark_Ref.current = meta?.is_bookmarked;


  };

  loadInitialData().catch((err) => console.error("❌ load error:", err))
    .finally(() => setLoading(false));
}, [imdb_idData, token]);



 

//   const fetchNextMovieFromQueue = async (prevImdb) => {
//     console.log('console__fetchNextMovieFromQueue__',prevImdb)
//   try {
//     let queue = [...matchingQueue];
//     console.log('fetchNextMovieFromQueue__matchingQuene',...matchingQueue)
//     // 🛑 agar queue already filled hai to naya API call mat karo
//     // if (queue.length) {
//     //   const matching = await getMatchingMovies(token, prevImdb);
//     //   queue = matching?.results || [];
//     // console.log('console__matching__queue -- line 332',matching?.results)

//     // }

//     // if (!queue.length) return null;
//     // Random next movie select karo
//     const randomIndex = Math.floor(Math.random() * queue.length);
//     const nextMovie = queue[randomIndex];
//     queue.splice(randomIndex, 1);
//     setMatchingQueue(queue);
// console.log('setMatchingQueue__queue  -- line 338',queue)
//     // Metadata sirf selected movie ka lo
//     const meta = await getMovieMetadata(token, nextMovie?.imdb_id);
//     console.log('moive__call from line  404 , nextMovie?.imdb_id ',nextMovie?.imdb_id )    
//     saveBookMark_Ref.current = meta?.is_bookmarked;

//     // setSelectedMovie(meta.imdb_id);
//     // setMovieData([null, meta, null]);



//     // NEW
// setSelectedMovie(meta.imdb_id);
// setMovieData(prev => [...prev, meta]); // append new movie at end


// console.log('before__data__preloadNeighborsMeta','queue' ,queue ,  'meta__',meta)
//     // 🔥 Ab preloaded queue se neighbors ka meta lo, naya API call nahi
//     preloadNeighborsMeta(queue, meta);

//     return meta;
//   } catch (error) {
//     console.error("❌ Error fetching movie:", error);
//     return null;
//   }
// };


const fetchNextMovieFromQueue = async (prevImdb) => {
  try {
    let queue = [...matchingQueue];

    // If queue empty — fetch new batch
    if (queue.length === 0) {
      const matching = await getMatchingMovies(token, prevImdb);
      queue = matching?.results || [];
    }

    if (!queue.length) return null;

    const randomIndex = Math.floor(Math.random() * queue.length);
    const nextMovie = queue[randomIndex];
    queue.splice(randomIndex, 1);
    setMatchingQueue(queue);

    const meta = await getMovieMetadata(token, nextMovie?.imdb_id);
    saveBookMark_Ref.current = meta?.is_bookmarked;
    return meta;
  } catch (error) {
    console.error("❌ Error fetching movie:", error);
    return null;
  }
};

  const viewabilityConfig = useRef({
  viewAreaCoveragePercentThreshold: 50,
}).current;

const onViewableItemsChanged = useRef(({ viewableItems }) => {
  if (viewableItems && viewableItems.length > 0) {
    // pick the first fully/mostly visible item
    const visibleIndex = viewableItems[0].index;
    if (typeof visibleIndex === 'number') {
      setCurrentIndex(visibleIndex);
      setSelectedMovie(movieData[visibleIndex]?.imdb_id || null);
    }
  }
}).current;

  const preloadNeighborsMeta = async (queue, midMovie) => { 
    const prevItem = queue[0] || null;
    const nextItem = queue[1] || null;
    const [prevMeta, nextMeta] = await Promise.all([
      prevItem ? getMovieMetadata(token, prevItem.imdb_id) : Promise.resolve(null),
      nextItem ? getMovieMetadata(token, nextItem.imdb_id) : Promise.resolve(null),
          console.log('moive__call from line  prevItem  ',prevItem.imdb_id) ,   
          console.log('moive__call from line  nextItem  ',nextItem.imdb_id)    

    ]);
    setMovieData([prevMeta || null, midMovie || movieData[1], nextMeta || null]); // comment
  };



  


  const HiddenPreload = ({ uri, idx }) => {
    if (!uri) return null;
    return (
      <Video
        key={`preload-${idx}`}
        source={{ uri }}
        paused={true}       
        muted={true}
        repeat={false}
        style={{ width: 0, height: 0 }} // invisible
        bufferConfig={{
          minBufferMs: 2000,
          maxBufferMs: 8000,
          bufferForPlaybackMs: 1000,
          bufferForPlaybackAfterRebufferMs: 1500,
        }}
        onLoad={() => {
          // optional: mark preloaded
          setPreloaded(prev => ({ ...prev, [idx]: true }));
        }}
        onError={(e) => {
          console.log('preload error', idx, e);
          setPreloaded(prev => ({ ...prev, [idx]: false }));
        }}
        useExoPlayer={true}
        ignoreSilentSwitch="ignore"
              playInBackground={false}
              playWhenInactive={false}
              controls={false}
              disableFocus={true}
              hideShutterView
              shutterColor="transparent"
              progressUpdateInterval={250}
      />
    );
  };


 useEffect(() => {
    posterOpacity.setValue(1);
    setProgress(0)
  }, [movieData]);

  // more movie sheet
  const openMoreModal = () => {
    setModalMovieId(movieData[currentIndex]?.imdb_id);
    setMorelikeModal(true);
  };

  const onLoad = useCallback((data: any) => {
    setDuration(data.duration || 0);
    Animated.timing(posterOpacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const onVideoProgress = useCallback((data) => {
    if (duration > 0) {
      const progressValue = data.currentTime / duration;

      // Avoid continuous re-renders
      setProgress(prev => {
        if (Math.abs(prev - progressValue) < 0.01) {
          return prev; // change less than 1% → skip
        }
        return progressValue;
      });
    }

    if (!isVideoPaused && movieData[currentIndex]) {
      trailerTracker.onProgress({
        currentTime: data.currentTime,
        imdb_id: movieData[currentIndex].imdb_id,
        trailer_url: movieData[currentIndex].trailer_url,
      });
    }
  }, [isVideoPaused, duration, currentIndex]);


 const preloadHlsFirstSegment = async (m3u8Url, destPath) => {
    try {
      const playlist = await fetch(m3u8Url).then(r => r.text());
      const lines = playlist.split('\n').map(l => l.trim());
      const segLineIndex = lines.findIndex(l => l && !l.startsWith('#'));
      if (segLineIndex === -1) return false;
      let segUrl = lines[segLineIndex];
      // resolve relative path
      const base = m3u8Url.replace(/\/[^/]*$/, '/');
      if (!segUrl.startsWith('http')) segUrl = base + segUrl;
      await RNFS.downloadFile({ fromUrl: segUrl, toFile: destPath }).promise;
      return true;
    } catch (e) {
      console.warn('preloadHlsFirstSegment failed', e);
      return false;
    }
  };

// save movie
   const handleToggleBookmark = useCallback(async (imdb_id) => {
    const current = bookmarkMapRef.current[imdb_id] ?? false;

    // ✅ Instant visual update (optimistic)
    setBookmarkMap(prev => {
      const newMap = { ...prev, [imdb_id]: !current };
      bookmarkMapRef.current = newMap;
      return newMap;
    });

    // Background API call (doesn't block UI)
    try {
      const res = await toggleBookmarkHook(imdb_id);
      if (typeof res === 'boolean') {
        // ✅ Sync back result (only if changed)
        setBookmarkMap(prev => {
          if (prev[imdb_id] === res) return prev;
          const newMap = { ...prev, [imdb_id]: res };
          bookmarkMapRef.current = newMap;
          return newMap;
        });
      }
    } catch (err) {
      console.error('Bookmark toggle failed', err);
      // revert on failure
      setBookmarkMap(prev => {
        const newMap = { ...prev, [imdb_id]: current };
        bookmarkMapRef.current = newMap;
        return newMap;
      });
    }
  }, [toggleBookmarkHook]);

 

  // Example in the event handler when opening the modal:
  const openInfoModal = () => {
    const currentMovie = movieData[currentIndex];
    console.log(currentMovie.imdb_id, 'current___mocie_modoal_deta8ls')
    setSelectedMovie(currentMovie);
    setInfoModal(true);
  };
// all Session
  const fetchAllSeasons = async () => {
    const imdb_id = "tt0944947"
    try {
      const response = await getEpisodes(token, imdb_id);
      if (response && typeof response === 'object') {
        const seasonKeys = Object.keys(response);
        const dynamicList = seasonKeys.map((key) => ({
          id: parseInt(key),
          session: `Session ${key}`,
        }));
        setSessionList(dynamicList);
      }
    } catch (error) {
      console.log('❌ Error fetching seasons:', error);
    }
  };
// Eoisodes
  const handleFetchSeasonEpisodes = async (seasonNumber = 3) => {
    const imdb_id = "tt0944947"
    try {
      const response = await getEpisodesBySeason(token, imdb_id, seasonNumber);
      const seasonData = Object.values(response).flat();

      const formattedEpisodes = seasonData.map((ep, index) => ({
        id: index + 1,
        title: ep?.episode_name || `Episode ${index + 1}`,
        duration: ep?.runtime ? `${ep?.runtime} min` : "Unknown",
        image: ep?.image || imageIndex.moviesPoster,
      }));

      setEpisodes(formattedEpisodes);
    } catch (err) {
      console.log("❌ Error loading season:", err);
      setEpisodes([]);
    }
  };


 // Episodes data
  const getEpisodesdata = async () => {
    const imdb_id = "tt0944947";
    try {
      const response = await getEpisodes(token, imdb_id);
      let episodesData = [];

      if (response && typeof response === 'object' && !Array.isArray(response)) {
        const allSeasons = Object.values(response);
        episodesData = allSeasons.flat();
      } else if (Array.isArray(response)) {
        episodesData = response;
      }
      const formattedEpisodes = episodesData.map((ep, index) => ({
        id: index + 1,
        title: ep.episode_name || `Episode ${index + 1}`,
        duration: ep.runtime ? `${ep.runtime} min` : "Unknown",
        image: ep.image || imageIndex.moviesPoster,
      }));

      setEpisodes(formattedEpisodes);
    } catch (error) {
      console.log("❌ Error fetching episodes:", error);
      setEpisodes([]);
    }
  };


  const formatRuntime = (runtime) => {
    if (!runtime || isNaN(runtime)) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Compare modals
  const compareHook = useCompareComponent(token);

  const handleRankingPress = (movie) => {
    compareHook.openFeedbackModal(movie);
  };

  useEffect(() => {
    if (movieData[currentIndex]) {
      setReviews([])
      setCommentText('')
      const currentMovie = movieData[currentIndex];
      has_rated_ref.current = currentMovie?.has_rated ?? false;
     }
  }, [currentIndex, movieData]);


 



  const showCommenRankingCheck = () => {
    if (!movieData[currentIndex]?.has_rated && !has_rated_ref.current) {
      handleRankingPress({
        imdb_id: movieData[currentIndex]?.imdb_id,
        title: movieData[currentIndex]?.title,
        release_year: movieData[currentIndex]?.release_year,
        cover_image_url: movieData[currentIndex]?.cover_image_url,
      });
      setthinkModal(true)
     
      // has_rated_ref.current = true
    } else {
      // getComment(token, movieData[currentIndex]?.imdb_id, true);
    };
  };

  useEffect(() => {
    if (isModalClosed) {

       if (movieData[currentIndex] && route.name == ScreenNameEnum.MovieDetailScreen) {
         setthinkModal(false)
        has_rated_ref.current = true;
        //         setTimeout(() => {
        // console.log('check__comment__modal_on___isModalClosed')
        //         setthinkModal(true)
        //         }, 800);
      }
      // checkHasRated()
    }
  }, [isModalClosed]);

  const handlerShowMuteImg = useCallback(() => {
    // Purana timer clear karo
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Show immediately
    setIsShowMuteIcon(true);

    // Hide after 5 sec
    timerRef.current = setTimeout(() => {
      setIsShowMuteIcon(false);
    }, 5000);
  }, []);


  useEffect(() => {
    handlerShowMuteImg();

    // cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, handlerShowMuteImg]);


  const handleOpenCommentModal = () => {
    if (!movieData[currentIndex]?.has_rated && !has_rated_ref.current) {
      handleRankingPress({
        imdb_id: movieData[currentIndex]?.imdb_id,
        title: movieData[currentIndex]?.title,
        release_year: movieData[currentIndex]?.release_year,
        cover_image_url: movieData[currentIndex]?.cover_image_url,
      });
    }
    setthinkModal(true); // now modal opens only on user action
  };

  const renderShimmerEffect = () => {
    return (
      <MovieDetailsShimmer ITEM_HEIGHT={ITEM_HEIGHT} navigation={navigation} />

    );
  }
  // Render movie item
  const renderMovieDetail = useCallback(
    ({ item, index }) => {

 
         if (!item) {
        return renderShimmerEffect();
      }
      
       // saveBookMark_Ref.current = item?.is_bookmarked
      return (
        <View style={{ height: ITEM_HEIGHT, flexDirection: "column", }}>
          {/* header */}
          <CustomStatusBar />
          <HeaderCustom
            backIcon={imageIndex.backArrow}
            rightIcon={imageIndex.search}
            onRightPress={() => navigation.navigate(ScreenNameEnum.WoodsScreen, { type: 'movie' })}
            onBackPress={() => navigation.goBack()}
          />

          <TouchableOpacity style={{ marginTop: -4, paddingHorizontal: 10 }}
            onPress={handlerShowMuteImg}
          >
            {/* work */}
            {item?.trailer_url && (
              <Video
                source={{ uri: item?.trailer_url }}
                style={{ height: windowHeight / 3.9, width: '100%' }}
                resizeMode='stretch'
                repeat
                muted={isMuted}
                paused={isVideoPaused || index !== currentIndex || isSeeking}
                onProgress={onVideoProgress}
                onEnd={() => {
                  setProgress(1);
                  if (item?.imdb_id) {
                    trailerTracker.triggerInteractionIfAny();
                  }
                }}
                onLoad={onLoad}
                ref={videoRef}

           useExoPlayer={Platform.OS === 'android'}     

                bufferConfig={{
                  minBufferMs: 2000,
                  maxBufferMs: 5000,
                  bufferForPlaybackMs: 1000,
                  bufferForPlaybackAfterRebufferMs: 1000,
                }}
                ignoreSilentSwitch="ignore"
                playInBackground={false}
                playWhenInactive={false}
                automaticallyWaitsToMinimizeStalling={true} // iOS: auto buffer
                // Prevents the video from playing when the app is inactive or in the background
                controls={false}
                disableFocus={true}

                hideShutterView

                shutterColor="transparent"
              />
            )}

          
            <View style={{
              position: 'absolute',
              top: 0,
              left: 10,
              right: 10,
              height: windowHeight / 3.8,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              {isShowMuteIcon &&
                <TouchableOpacity
                  style={styles.tButton}
                  // onPress={() => setMuted(!muted)}
                  onPress={() => dispatch(toggleMute())}
                >
                  <Image
                    source={isMuted ? imageIndex.volumeOff : imageIndex.mute}
                    style={{ height: 22, width: 22, tintColor: Color.whiteText }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              }
              <Animated.Image
                source={{ uri: item.horizontal_poster_url }}
                resizeMode="cover"
                style={{
                  alignSelf: 'center',
                  opacity: posterOpacity,
                  height: windowHeight / 3.8,
                  width: '100%',
                }}
              />
            </View>
          </TouchableOpacity>

          {/* details  */}
          <View style={{ flex: 1, justifyContent: 'space-between' }}  >

            {/* Content */}
            <View style={[styles.infoContainer, {}]}>
              <CustomText
                size={24}
                color={Color.whiteText}
                style={styles.title}
                font={font.PoppinsBold}
                numberOfLines={2}
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines.length;
                  // setTitleLines(lines);
                }}

              >
                {item?.title}
              </CustomText>

              <View style={{ marginTop: 10 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 4, alignItems: 'center' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomText
                      size={12}
                      color={Color.lightGrayText}
                      style={styles.subInfo}
                      font={font.PoppinsRegular}
                    >
                      {item?.release_year}
                    </CustomText>

                    <CustomText
                      size={12}
                      color={Color.lightGrayText}
                      style={styles.subInfo}
                      font={font.PoppinsRegular}
                    >
                      {formatRuntime(item?.runtime)}
                    </CustomText>

                    <CustomText
                      size={12}
                      color={Color.lightGrayText}
                      style={styles.subInfo}
                      font={font.PoppinsRegular}
                    >
                      Subtitle
                    </CustomText>

                    {item?.genres && item.genres.length > 0 && (
                      <Text style={styles.genresText} allowFontScaling={false}>
                        {item.genres.join(' ')}
                      </Text>
                    )}
                  </View>
                </ScrollView>
              </View>

              <View style={[styles.scoreRow, {}]}>
                <TouchableOpacity style={styles.scoreBoxGreen} onPress={() => setShowFirstModal(true)}>
                  {/* <RankingCard ranked={item?.rec_score} /> */}
                  <View style={{ marginTop: 8, }} >
                    <RankingWithInfo
                      score={item?.rec_score}
                      title="Rec Score"
                      description="This score predicts how much you'll enjoy this movie/show, based on your ratings and our custom algorithm."
                    />
                  </View>
                  <CustomText
                    size={14}
                    color={Color.whiteText}
                    style={{ marginLeft: 6 }}
                    font={font.PoppinsMedium}
                  >
                    Rec Score
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scoreBoxGreen} onPress={() => setShowSecondModal(true)}>
                  {/* <RankingCard ranked={item?.friends_rec_score} /> */}
                  <View style={{ marginTop: 8, }} >

                    <RankingWithInfo
                      score={item?.friends_rec_score}
                      title="Friend Score"
                      description="This score shows the rating from your friend for this title."
                    />
                  </View>

                  <CustomText
                    size={14}
                    color={Color.whiteText}
                    style={{ marginLeft: 6 }}
                    font={font.PoppinsMedium}
                  >
                    Friend Score
                  </CustomText>
                </TouchableOpacity>


                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}
                    // onPress={showCommenRankingCheck}
                    onPress={() => setthinkModal(true)}
                  // onPress={handleOpenCommentModal}
                  >
                    <Image source={imageIndex.mess} style={{ height: 20, width: 20 }} resizeMode='contain' />
                    {item?.n_comments > 0 && (
                      <CustomText
                        size={14}
                        color={Color.lightGrayText}
                        style={{ marginLeft: 3 }}
                        font={font.PoppinsMedium}
                      >
                        {item?.n_comments}
                      </CustomText>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleToggleBookmark(item.imdb_id)}
                  >
                    <Image
                      source={(bookmarkMap[item.imdb_id] ?? item.is_bookmarked) ? imageIndex.save : imageIndex.saveMark}

                      style={styles.footerSaveIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {item && item?.description && item?.description.trim() !== "" ?
                (
                  <View style={{ flexDirection: 'row', height: windowHeight * 0.21, marginTop: 10 }}>
                    {/* Content Scroll */}
                    <ScrollView
                      ref={scrollRef}
                      style={{ height: windowHeight * 0.21, }}
                      onContentSizeChange={handleContentSizeChange}
                      onLayout={handleLayout}
                      onScroll={handleScroll}
                      scrollEventThrottle={16}
                      showsVerticalScrollIndicator={false} // default indicator hide
                      onTouchStart={() => setOuterScrollEnabled(false)}
                      onTouchEnd={() => setOuterScrollEnabled(true)}
                      onScrollBeginDrag={() => setOuterScrollEnabled(false)}
                      onMomentumScrollEnd={() => setOuterScrollEnabled(true)}
                    >
                      <Text style={styles.description}>
                        {item?.description || "No description available"}
                      </Text>
                    </ScrollView>

                    {/* Custom Scroll Indicator */}
                    <View style={{
                      width: 6,
                      marginLeft: 6,
                      backgroundColor: Color.darkGrey,
                      borderRadius: 2,
                      height: visibleContentHeight, 
                      overflow: 'hidden',
                    }}>
                      <Animated.View
                        style={{
                          width: 6,
                          height: scrollIndicatorHeight,
                          borderRadius: 2,
                          backgroundColor: Color.grey,
                          transform: [{ translateY: scrollIndicatorPosition }],
                        }}
                      />
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.9)']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.gradient}
                    />
                  </View>
                ) :
                <Text style={styles.description} >No Description</Text>}
            </View>
            {/* header end */}
            {/* Footer */}
            <View style={{
              justifyContent: 'space-between',
              paddingBottom: 10,
              flex: 1,
              maxHeight: windowHeight * 0.24,
              // backgroundColor: 'red'

            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.watchNowContainer}
                  onPress={() => setWatchNow(true)}
                >
                  <Image style={styles.watchNowImg} source={imageIndex.puased} resizeMode='contain' />

                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.watchNowContainer, { backgroundColor: Color.primary, width: Dimensions.get('window').width * 0.58, }]}
                  onPress={() => {
                    handleRankingPress({
                      imdb_id: item?.imdb_id,
                      title: item?.title,
                      release_year: item?.release_year,
                      cover_image_url: item?.cover_image_url || '',
                    });
                    setIsFeedbackModal(true)
                  }}
                >
                  <Image style={[styles.watchNowImg, { marginRight: 16, height: 20, width: 20 }]} source={imageIndex.ranking} resizeMode='contain' />
                  <CustomText
                    size={14}
                    color={Color.whiteText}
                    style={styles.watchNowText}
                    font={font.PoppinsBold}
                  >
                    Rank Now
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={styles.footerNav}>
                <TouchableOpacity
                  onPress={() => {
                    setEpisVisible(true);
                    getEpisodesdata();
                    fetchAllSeasons();
                  }}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                >
                  <Text style={styles.linkText} >Episodes</Text>
                  <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='cover' />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => setMorelikeModal(true)}
                  onPress={openMoreModal}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                >
                  <Text style={styles.linkText} >More like this</Text>
                  <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='contain' />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>

                <ProgressBar
                  progress={progress}
                  onSeek={(newProgress) => {
                    setIsSeeking(true);
                    setProgress(newProgress);
                    if (videoRef.current && duration > 0) {
                      videoRef.current.seek(newProgress * duration);
                    }
                    setTimeout(() => setIsSeeking(false), 100); // release after seek
                  }}
                />

              </View>
            </View>
          </View>

          {/* Footer end */}
        </View>
      );
    },
    [currentIndex, isVideoPaused, progress, duration, progress]

  );

  if (loading && isInitialLoad.current) {
    return renderShimmerEffect();
  };

  // comment comdal compomnent 

  return (
    <SafeAreaView style={styles.container}>


      {/* <FlatList
        ref={flatListRef}
        data={movieData}
        keyExtractor={(item, index) => item?.imdb_id ? item.imdb_id : `placeholder-${index}`}
        renderItem={renderMovieDetail}
        // pagingEnabled
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="normal"



        viewabilityConfig={viewabilityConfig}
  onViewableItemsChanged={onViewableItemsChanged}

        showsVerticalScrollIndicator={false}
        // onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        scrollEventThrottle={30}
        scrollEnabled={outerScrollEnabled}
        extraData={bookmarkMap}
          removeClippedSubviews={false}
  nestedScrollEnabled={true}




  ListFooterComponent={isLoadingNewMovie ? renderShimmerEffect : null}

      /> */}



<FlatList
  ref={flatListRef}
  data={movieData}
  keyExtractor={(item, index) => item?.imdb_id || index.toString()}
  renderItem={renderMovieDetail}
  pagingEnabled
  showsVerticalScrollIndicator={false}
  onEndReachedThreshold={0.5}
  onEndReached={async () => {
    if (isLoadingNewMovie || matchingQueue.length === 0) return;
    setIsLoadingNewMovie(true);

    const prevImdb = movieData[movieData.length - 1]?.imdb_id;
    const next = await fetchNextMovieFromQueue(prevImdb);

    if (next) {
      setMovieData(prev => [...prev, next]);
    }

    setIsLoadingNewMovie(false);
  }}
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
  decelerationRate="fast"
  snapToInterval={ITEM_HEIGHT}
  snapToAlignment="start"
/>


       {/* ===== Hidden preloads for neighbors (parent-level) ===== */}
            {/* {movieData[0] && (
              <HiddenPreload uri={movieData[0].trailer_url} idx={0} />
            )}
            {movieData[2] && (
              <HiddenPreload uri={movieData[2].trailer_url} idx={2} />
            )} */}
            {/* ======================================================= */}
      {showFirstModal &&
        <ScoreIntroModal
          visible={showFirstModal}
          onClose={() => setShowFirstModal(false)}
          variant="first"
        />
      }
      {showSecondModal &&
        <ScoreIntroModal
          visible={showSecondModal}
          onClose={() => setShowSecondModal(false)}
          variant="second"
        />
      }
      {MorelikeModal &&
        <MoreSheetModal
          visible={MorelikeModal}
          token={token}
          imdb_idData={modalMovieId}
          onClose={() => setMorelikeModal(false)}
        />
      }
      {episVisible &&
        <EpisodesModal
          visible={episVisible}
          onClose={() => setEpisVisible(false)}
          episodes={episodes}
          selectedId={selectedEpisodeId}
          onSelect={(id) => {
            setSelectedEpisodeId(id);
            setEpisVisible(false);
          }}
          token={token}
          imdb_id={"tt0944947"}
          onFetchEpisodes={handleFetchSeasonEpisodes}
          sessionList={sessionList}
        />
      }
      {watchNow &&

        <WatchNowModal visible={watchNow} onClose={() => setWatchNow(false)} />
      }

      {InfoModal &&
        <MovieInfoModal
          visible={InfoModal}
          onClose={() => setInfoModal(false)}
          title={selectedMovie?.title || "Movie Title"}
          synopsis={selectedMovie?.description || "Movie Description"}
          releaseDate={selectedMovie?.release_date || "Unknown"}
          genre={(selectedMovie?.genres || []).join(', ')}
        />
      }
      {thinkModal &&

        <CommentModal
          visible={thinkModal}
          onClose={() => {
            setthinkModal(false);
            if (movieData[currentIndex]?.imdb_id) {
               // getComment(token, movieData[currentIndex]?.imdb_id, false);
            }
          }}
          reviews={reviews}
          heading="Reviews"
          token={token}
          imdb_id={movieData[currentIndex]?.imdb_id || imdb_idData}
          rec_scoreComm={movieData[currentIndex]?.rec_score || 0}
          showCommenRankingCheck={() => showCommenRankingCheck()}
          has_rated_movie={has_rated_ref.current}
        />
      }


      {isFeedbackModal &&
        <CompareModals token={token} useCompareHook={compareHook} />

      }
    </SafeAreaView>
  );
};

export default memo(MovieDetailScreen);


