import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
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
import imageIndex from '../../../../assets/imageIndex';
import {
  EpisodesModal,
  HeaderCustom,
  MoreSheetModal,
  MovieInfoModal,
} from '../../../../component';
import styles from './style';
import useMovie from './useMovie';
import ProgressBar from './ProgressBar';
import { Color } from '../../../../theme/color';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import font from '../../../../theme/font';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScoreIntroModal from '../../../../component/modal/ScoreIntroModal/ScoreIntroModal';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import WatchNowModal from '../../../../component/modal/WatchNowModal/WatchNowModal';
import { getEpisodes, getEpisodesBySeason, getMovieMetadata } from '../../../../redux/Api/movieApi';
import { getMatchingMovies } from '../../../../redux/Api/ProfileApi';
import CompareModals from '../../ranking/rankingScreen/CompareModals';
import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
import { useBookmarks } from '../../../../hook/useBookmark';
import { useTrailerTracker } from '../../../../hook/useTrailerTracker';
import CustomText from '../../../../component/common/CustomText';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMute } from '../../../../redux/feature/videoAudioSlice';
import MovieDetailsShimmer from './MovieDetailsShimmer';
import VideoPlayer from '../../../../utils/NewNativeView';

const CommentModal = React.lazy(() =>
  import('../../../../component/modal/comment/CommentModal')
);

const MovieDetailScreen = () => {
  const navigation = useNavigation();
  const {
    episVisible, setEpisVisible,
    MorelikeModal, setMorelikeModal,
    InfoModal, setInfoModal,
    thinkModal, setthinkModal
  } = useMovie();
  const route = useRoute();
  const { imdb_idData, token } = route.params;
  const { toggleBookmark: toggleBookmarkHook } = useBookmarks(token);
  const isModalClosed = useSelector((state: RootState) => state.modal.isModalClosed);

  const [movieData, setMovieData] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const BOTTOM_TAB_HEIGHT = 70;
  const ITEM_HEIGHT = windowHeight - BOTTOM_TAB_HEIGHT - insets.bottom;
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [watchNow, setWatchNow] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const [sessionList, setSessionList] = useState<{ id: number; session: string }[]>([]);
  const [reviews, setReviews] = useState([])
  const [progress, setProgress] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const trailerTracker = useTrailerTracker(token);
  const [duration, setDuration] = useState(0);
  const [currentSeedId, setCurrentSeedId] = useState(imdb_idData);
  const [matchingQueue, setMatchingQueue] = useState([]);
  const isInitialLoad = useRef(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const isResettingRef = useRef(false);
  const saveBookMark_Ref = useRef(false)
  const [modalMovieId, setModalMovieId] = useState(null);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const dispatch = useDispatch()
  const isMuted = useSelector((state: RootState) => state.videoAudio.isMuted);
  const [isShowMuteIcon, setIsShowMuteIcon] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoadingNewMovie, setIsLoadingNewMovie] = useState(false);

  const scrollRef = useRef(null);

  const [wholeContentHeight, setWholeContentHeight] = useState(1);
  const [visibleContentHeight, setVisibleContentHeight] = useState(0);
  const [scrollIndicatorHeight, setScrollIndicatorHeight] = useState(0);
  const [scrollIndicatorPosition, setScrollIndicatorPosition] = useState(0);
  const has_rated_ref = useRef(false);
  const [commetText, setCommentText] = useState('')
  const [isFeedbackModal, setIsFeedbackModal] = useState(false);

  const [isSeeking, setIsSeeking] = useState(false);

  // Track video states for each item
  const [videoStates, setVideoStates] = useState({
    0: { progress: 0, duration: 0, posterVisible: true, paused: true },
    1: { progress: 0, duration: 0, posterVisible: true, paused: false },
    2: { progress: 0, duration: 0, posterVisible: true, paused: true }
  });

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setWholeContentHeight(contentHeight || 1);
  };

  const handleLayout = ({ nativeEvent: { layout: { height } } }) => {
    setVisibleContentHeight(height || 0);
  };

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

  // useEffect(() => {
  //   setVideoStates(prev => 
  //     prev.map((state, idx) => ({
  //       ...state,
  //       paused: idx !== currentIndex // Only play current
  //     }))
  //   );
  // }, [currentIndex]);




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
  }, [movieData]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      let meta = await getMovieMetadata(token, imdb_idData);
      const matching = await getMatchingMovies(token, imdb_idData);

      setMovieData([null, meta, null]);
      setCurrentSeedId(imdb_idData);
      saveBookMark_Ref.current = meta?.is_bookmarked;
      setSelectedMovie(meta?.imdb_id);
      setMatchingQueue(matching?.results || []);
    };

    loadInitialData().catch((err) => console.error("❌ load error:", err))
      .finally(() => setLoading(false));
  }, [imdb_idData, token]);

  useFocusEffect(
    useCallback(() => {
      setIsVideoPaused(false);
      return () => {
        setIsVideoPaused(true);
        trailerTracker.triggerInteractionIfAny();
        trailerTracker.resetTracker();
      };
    }, [])
  );

  const fetchNextMovieFromQueue = async (prevImdb) => {
    console.log('fetchNextMovieFromQueue__', prevImdb)
    try {
      let queue = [...matchingQueue];
      const randomIndex = Math.floor(Math.random() * queue.length);
      const nextMovie = queue[randomIndex];
      queue.splice(randomIndex, 1);
      setMatchingQueue(queue);

      const meta = await getMovieMetadata(token, nextMovie?.imdb_id);
      saveBookMark_Ref.current = meta?.is_bookmarked;
      setSelectedMovie(meta.imdb_id);

      return meta;
    } catch (error) {
      console.error("❌ Error fetching movie:", error);
      return null;
    }
  };

  const handleMomentumScrollEnd = async (event) => {
    if (isResettingRef.current) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (newIndex === currentIndex) return;

    // Immediately set currentIndex so render/Video paused logic reacts
    setCurrentIndex(newIndex);

    // Pause all videos while we handle loading
    setIsVideoPaused(true);
    setIsLoadingNewMovie(true);
    setAllPaused(true);

    // If user landed on neighbors (0 or 2) — fetch next movie and reset
    if (newIndex === 0 || newIndex === 2) {
      isResettingRef.current = true;
      const prevId = movieData[1]?.imdb_id || currentSeedId;

      // reset visual progress
      setProgress(0);
      setDuration(0);

      const newMovie = await fetchNextMovieFromQueue(prevId);
      if (newMovie) {
        // Reset video states completely for smooth remount
        setVideoStates({
          0: { progress: 0, duration: 0, posterVisible: true, paused: true },
          1: { progress: 0, duration: 0, posterVisible: true, paused: false }, // middle will play
          2: { progress: 0, duration: 0, posterVisible: true, paused: true }
        });

        setMovieData([null, newMovie, null]);
        setCurrentSeedId(newMovie.imdb_id);

        // jump back to middle (no animation)
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false
        });

        // small delay to allow FlatList to settle
        setTimeout(() => {
          setCurrentIndex(1);
          setIsVideoPaused(false);
          setIsLoadingNewMovie(false);
          isResettingRef.current = false;
        }, 120);
      } else {
        // failed to fetch -> restore states
        setIsVideoPaused(false);
        setIsLoadingNewMovie(false);
        setAllPaused(false);
        isResettingRef.current = false;
      }
    } else {
      // normal case: user scrolled to middle or any other index
      setIsVideoPaused(false);
      setIsLoadingNewMovie(false);
      // ensure only the newIndex plays
      setVideoStates(prev => ({
        0: { ...prev[0], paused: newIndex !== 0 },
        1: { ...prev[1], paused: newIndex !== 1 },
        2: { ...prev[2], paused: newIndex !== 2 },
      }));
    }
  };
  const setAllPaused = useCallback((val) => {
    setVideoStates(prev => ({
      0: { ...prev[0], paused: val },
      1: { ...prev[1], paused: val },
      2: { ...prev[2], paused: val }
    }));
  }, []);


  const preloadNeighborsMeta = async (queue, midMovie) => {
    const prevItem = queue[0] || null;
    const nextItem = queue[1] || null;
    const [prevMeta, nextMeta] = await Promise.all([
      prevItem ? getMovieMetadata(token, prevItem.imdb_id) : Promise.resolve(null),
      nextItem ? getMovieMetadata(token, nextItem.imdb_id) : Promise.resolve(null),
    ]);
    setMovieData([prevMeta || null, midMovie || movieData[1], nextMeta || null]);
  };

  // Update video state for specific index
  const updateVideoState = useCallback((index, updates) => {
    setVideoStates(prev => ({
      ...prev,
      [index]: { ...prev[index], ...updates }
    }));
  }, []);

  const openMoreModal = () => {
    setModalMovieId(movieData[currentIndex]?.imdb_id);
    setMorelikeModal(true);
  };

  const onVideoProgress = useCallback((data, index) => {
    if (!isSeeking && videoStates[index]?.duration > 0) {
      const progressValue = data.currentTime / videoStates[index].duration;

      setProgress(prev => {
        if (Math.abs(prev - progressValue) > 0.01) {
          return progressValue;
        }
        return prev;
      });

      updateVideoState(index, { progress: progressValue });

      if (!isVideoPaused && movieData[index]?.imdb_id) {
        trailerTracker.onProgress({
          currentTime: data.currentTime,
          imdb_id: movieData[index].imdb_id,
          trailer_url: movieData[index].trailer_url,
        });
      }
    }
  }, [isVideoPaused, isSeeking, videoStates]);

  const handleToggleBookmark = useCallback(async (imdb_id) => {
    const current = bookmarkMapRef.current[imdb_id] ?? false;

    setBookmarkMap(prev => {
      const newMap = { ...prev, [imdb_id]: !current };
      bookmarkMapRef.current = newMap;
      return newMap;
    });

    try {
      const res = await toggleBookmarkHook(imdb_id);
      if (typeof res === 'boolean') {
        setBookmarkMap(prev => {
          if (prev[imdb_id] === res) return prev;
          const newMap = { ...prev, [imdb_id]: res };
          bookmarkMapRef.current = newMap;
          return newMap;
        });
      }
    } catch (err) {
      console.error('Bookmark toggle failed', err);
      setBookmarkMap(prev => {
        const newMap = { ...prev, [imdb_id]: current };
        bookmarkMapRef.current = newMap;
        return newMap;
      });
    }
  }, [toggleBookmarkHook]);

  const openInfoModal = () => {
    const currentMovie = movieData[currentIndex];
    setSelectedMovie(currentMovie);
    setInfoModal(true);
  };

  // All Session, Episodes, and other functions remain the same...
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
    }
  };

  useEffect(() => {
    if (isModalClosed) {
      if (movieData[currentIndex] && route.name == ScreenNameEnum.MovieDetailScreen) {
        setthinkModal(false)
        has_rated_ref.current = true;
      }
    }
  }, [isModalClosed]);

  const handlerShowMuteImg = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsShowMuteIcon(true);
    timerRef.current = setTimeout(() => {
      setIsShowMuteIcon(false);
    }, 5000);
  }, []);

  useEffect(() => {
    handlerShowMuteImg();
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
    setthinkModal(true);
  };


  const renderShimmerEffect = () => {
    return (
      <MovieDetailsShimmer ITEM_HEIGHT={ITEM_HEIGHT} navigation={navigation} />
    );
  }

  // FIXED RENDER MOVIE DETAIL FUNCTION
  const renderMovieDetail = useCallback(
    ({ item, index }) => {
      if (!item) {
        return renderShimmerEffect();
      }

      const currentVideoState = videoStates[index] || { progress: 0, duration: 0, posterVisible: true };
      const seekPosition = currentVideoState.progress * (currentVideoState.duration || 0);

      return (
        <View style={{ height: ITEM_HEIGHT, flexDirection: "column", paddingTop: 6 }}>
          <HeaderCustom
            backIcon={imageIndex.backArrow}
            rightIcon={imageIndex.search}
            onRightPress={() => setIsVideoPaused(false)}
            onBackPress={() => navigation.goBack()}
          />

          <View style={{ marginTop: -4, paddingHorizontal: 10 }}>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 10,
                  left: 10,
                  height: '100%',
                  zIndex: 999
                }}
                onPress={handlerShowMuteImg}
              />

              {item?.trailer_url ? (
                <VideoPlayer
                  key={`video-${item.imdb_id}-${index}`} // Use index instead of currentIndex
                  source={{ uri: item.trailer_url }}
                  movieId={item.imdb_id}
                  posterUrl={item.horizontal_poster_url}
                  seekTo={isSeeking ? seekPosition : undefined}
                  style={{ height: windowHeight / 3.5, width: '100%' }}
                  muted={isMuted}
                  // paused={videoStates[index]?.paused}
                  paused={!!videoStates[index]?.paused || isVideoPaused || isLoadingNewMovie || index !== currentIndex}
                  // paused={isVideoPaused || index !== currentIndex} // Properly pause non-active videos
                  // onLoad={(data) => {
                  //   const durationValue = data?.duration || 0;
                  //   updateVideoState(index, { 
                  //     duration: durationValue,
                  //     posterVisible: false 
                  //   });
                  //   setDuration(durationValue);
                  // }}
                  onLoad={(data) => {
                    const durationValue = data?.duration || 0;
                    updateVideoState(index, { duration: durationValue, posterVisible: false });
                    // if this is the active index, unpause it
                    if (index === currentIndex) {
                      updateVideoState(index, { paused: false });
                      setIsVideoPaused(false);
                    }
                    setDuration(durationValue);
                  }}

                  onProgress={(data) => {
                    onVideoProgress(data, index);
                  }}
                  onEnd={() => {
                    updateVideoState(index, { progress: 1 });
                    setProgress(1);
                    if (item?.imdb_id) {
                      trailerTracker.triggerInteractionIfAny();
                    }
                  }}
                  onSeek={(position) => {
                    if (currentVideoState.duration > 0) {
                      const newProgress = position / currentVideoState.duration;
                      updateVideoState(index, { progress: newProgress });
                      setProgress(newProgress);
                    }
                  }}
                  playInBackground={false}
                  playWhenInactive={false}
                />
              ) : (
                <View style={{ height: windowHeight / 3.5, width: '100%' }}>
                  <Image
                    source={{ uri: item.horizontal_poster_url }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              )}

              {isShowMuteIcon && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    zIndex: 1000,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: 20,
                    padding: 8,
                  }}
                  onPress={() => {
                    dispatch(toggleMute());
                    handlerShowMuteImg();
                  }}
                >
                  <Image
                    source={isMuted ? imageIndex.volumeOff : imageIndex.mute}
                    style={{ height: 20, width: 20, tintColor: Color.whiteText }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Rest of your content remains the same */}
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={[styles.infoContainer, {}]}>
              <CustomText
                size={24}
                color={Color.whiteText}
                style={styles.title}
                font={font.PoppinsBold}
                numberOfLines={2}
              >
                {item?.title}
              </CustomText>

              {/* ... rest of your content code ... */}

              {item && item?.description && item?.description.trim() !== "" ? (
                <View style={{ flexDirection: 'row', height: windowHeight * 0.21, marginTop: 10 }}>
                  <ScrollView
                    ref={scrollRef}
                    style={{ height: windowHeight * 0.21 }}
                    onContentSizeChange={handleContentSizeChange}
                    onLayout={handleLayout}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    onTouchStart={() => setOuterScrollEnabled(false)}
                    onTouchEnd={() => setOuterScrollEnabled(true)}
                  >
                    <Text style={styles.description}>
                      {item?.description}
                    </Text>
                  </ScrollView>

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
              ) : (
                <Text style={styles.description}>No Description</Text>
              )}
            </View>

            {/* Footer Section */}
            <View style={{
              justifyContent: 'space-between',
              paddingBottom: 10,
              flex: 1,
              maxHeight: windowHeight * 0.24,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.watchNowContainer}
                  onPress={() => setWatchNow(true)}
                >
                  <Image style={styles.watchNowImg} source={imageIndex.puased} resizeMode='contain' />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.watchNowContainer, { backgroundColor: Color.primary, width: Dimensions.get('window').width * 0.58 }]}
                  onPress={() => {
                    handleRankingPress({
                      imdb_id: item?.imdb_id,
                      title: item?.title,
                      release_year: item?.release_year,
                      cover_image_url: item?.cover_image_url || '',
                    });
                    setIsFeedbackModal(true);
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
                  <Text style={styles.linkText}>Episodes</Text>
                  <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='cover' />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={openMoreModal}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                >
                  <Text style={styles.linkText}>More like this</Text>
                  <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='contain' />
                </TouchableOpacity>
              </View>

              {/* Progress Bar - Use current video state */}
              <View style={{ marginBottom: 30, paddingHorizontal: 16 }}>
                <ProgressBar
                  progress={currentVideoState.progress}
                  onSeek={(newProgress) => {
                    updateVideoState(index, { progress: newProgress });
                    setProgress(newProgress);
                  }}
                  onSeekStart={() => {
                    setIsSeeking(true);
                    setIsVideoPaused(true);
                  }}
                  onSeekEnd={() => {
                    setTimeout(() => {
                      setIsSeeking(false);
                      setIsVideoPaused(false);
                    }, 100);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    },
    [currentIndex, isVideoPaused, isMuted, isShowMuteIcon, bookmarkMap, isSeeking, videoStates]
  );

  if (loading && isInitialLoad.current) {
    return renderShimmerEffect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movieData}
        keyExtractor={(item, index) => item?.imdb_id ? item.imdb_id : `placeholder-${index}`}
        renderItem={renderMovieDetail}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="normal"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
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
        extraData={[bookmarkMap, videoStates, currentIndex]} // Add videoStates to trigger re-render
        removeClippedSubviews={false}
        nestedScrollEnabled={true}
      />


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
          // movieData[currentIndex]?.imdb_id
          imdb_id={movieData[currentIndex]?.imdb_id} // movieData[currentIndex]?.imdb_id
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
              console.log('commment__call_')
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

