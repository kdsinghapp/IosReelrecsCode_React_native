import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { toggleMute } from '@redux/feature/videoAudioSlice';
import {
   EpisodesModal,
  MoreSheetModal,
  MovieInfoModal,
} from '@components';
import ScoreIntroModal from '@components/modal/ScoreIntroModal/ScoreIntroModal';
import WatchNowModal from '@components/modal/WatchNowModal/WatchNowModal';
import CompareModals from '../../ranking/rankingScreen/CompareModals';
import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
import { useBookmarks } from '@hooks/useBookmark';
import { useTrailerTracker } from '@hooks/useTrailerTracker';
import MovieDetailsShimmer from './MovieDetailsShimmer';
import ProgressBar from './ProgressBar';
import styles from './style';

// Custom hooks
import { useMovieDetailData } from './hooks/useMovieDetailData';
import { useModalManager } from './hooks/useModalManager';
import { useVideoPlayerState } from './hooks/useVideoPlayerState';
import { useEpisodesManager } from './hooks/useEpisodesManager';

// Components
import MovieHeader from './components/MovieHeader';
import VideoSection from './components/VideoSection';
import MovieInfoSection from './components/MovieInfoSection';
import ActionButtons from './components/ActionButtons';
import FooterNav from './components/FooterNav';

const CommentModal = React.lazy(() =>
  import('../../../../component/modal/comment/CommentModal')
);

const MovieDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { imdb_idData, token } = route.params;
  
  // Redux state
  const isModalClosed = useSelector((state: RootState) => state.modal.isModalClosed);
  const isMuted = useSelector((state: RootState) => state.videoAudio.isMuted);

  // Custom hooks
  const { toggleBookmark: toggleBookmarkHook } = useBookmarks(token);
  const trailerTracker = useTrailerTracker(token);
  const compareHook = useCompareComponent(token);
  
  const movieDetailData = useMovieDetailData(token, imdb_idData);
  const modalManager = useModalManager();
  const videoPlayer = useVideoPlayerState();
  const episodesManager = useEpisodesManager(token);

  // Local state
  const [currentIndex, setCurrentIndex] = useState(1);
  const [bookmarkMap, setBookmarkMap] = useState<{ [k: string]: boolean }>({});
  const [titleLines, setTitleLines] = useState(1);
  const [thinkModal, setthinkModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  
  const flatListRef = useRef(null);
  const bookmarkMapRef = useRef(bookmarkMap);
  const has_rated_ref = useRef(false);
  
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const BOTTOM_TAB_HEIGHT = 65;
  const ITEM_HEIGHT = windowHeight - BOTTOM_TAB_HEIGHT - insets.bottom - insets.top;

  // Update bookmark map ref
  useEffect(() => {
    bookmarkMapRef.current = bookmarkMap;
  }, [bookmarkMap]);

  // Update bookmark map when movie data changes
  useEffect(() => {
    if (movieDetailData.movieData && movieDetailData.movieData[1]) {
      const m = movieDetailData.movieData[1];
      if (m?.imdb_id) {
        setBookmarkMap(prev => ({ ...prev, [m.imdb_id]: !!m.is_bookmarked }));
      }
    }
  }, [movieDetailData.movieData]);

  // Handle bookmark toggle
  const handleToggleBookmark = useCallback(async (imdb_id: string) => {
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

  // Screen focus effect
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      videoPlayer.setIsVideoPaused(false);

      return () => {
        videoPlayer.setIsVideoPaused(true);
        trailerTracker.triggerInteractionIfAny();
        trailerTracker.resetTracker();
      };
    }, [])
  );

  // Reset progress when movie data changes
  useEffect(() => {
    videoPlayer.resetProgress();
  }, [movieDetailData.movieData]);

  // Handle scroll end for movie swipe
  const handleMomentumScrollEnd = async (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (newIndex !== currentIndex && !movieDetailData.isResettingRef.current) {
      if (newIndex === 0 || newIndex === 2) {
        movieDetailData.isResettingRef.current = true;
        const prevId = movieDetailData.movieData[1]?.imdb_id || movieDetailData.currentSeedId;

        movieDetailData.setMovieData([null, null, null]);
        videoPlayer.setProgress(0);
        
        let newMovie = await movieDetailData.fetchNextMovieFromQueue(prevId);
        if (newMovie) {
          movieDetailData.setMovieData([null, newMovie, null]);
          movieDetailData.setCurrentSeedId(newMovie.imdb_id);

          flatListRef.current?.scrollToIndex({ index: 1, animated: false });

          setTimeout(() => {
            setCurrentIndex(1);
            movieDetailData.isResettingRef.current = false;
          }, 200);
        } else {
          movieDetailData.isResettingRef.current = false;
        }
      }
    }
  };

  // Load episodes when modal opens
  useEffect(() => {
    const imdb_id = movieDetailData.movieData?.[currentIndex]?.imdb_id;
    if (modalManager.watchNow && imdb_id && !episodesManager.hasFetchedRef.current) {
      episodesManager.getEpisodesData(imdb_id);
      episodesManager.fetchAllSeasons(imdb_id);
      episodesManager.hasFetchedRef.current = true;
    }
  }, [modalManager.watchNow, currentIndex, movieDetailData.movieData]);

  // Update has_rated when movie changes
  useEffect(() => {
    if (movieDetailData.movieData[currentIndex]) {
      setReviews([]);
      const currentMovie = movieDetailData.movieData[currentIndex];
      has_rated_ref.current = currentMovie?.has_rated ?? false;
    }
  }, [currentIndex, movieDetailData.movieData]);

  // Handle modal closed event
  useEffect(() => {
    if (isModalClosed && movieDetailData.movieData[currentIndex]) {
      setthinkModal(false);
      has_rated_ref.current = true;
    }
  }, [isModalClosed, movieDetailData.movieData, currentIndex]);

  // Format runtime helper
  const formatRuntime = (runtime: number) => {
    if (!runtime || isNaN(runtime)) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Handle ranking press
  const handleRankingPress = (movie: any) => {
    compareHook.openFeedbackModal(movie);
  };

  // Show mute icon effect
  useEffect(() => {
    videoPlayer.handlerShowMuteImg();
  }, [currentIndex]);

  // Enhanced video progress tracking
  const enhancedVideoProgress = useCallback((data: any) => {
    videoPlayer.onVideoProgress(data);
    
    if (!videoPlayer.isVideoPaused && movieDetailData.movieData[currentIndex]) {
      trailerTracker.onProgress({
        currentTime: data.currentTime,
        imdb_id: movieDetailData.movieData[currentIndex].imdb_id,
        trailer_url: movieDetailData.movieData[currentIndex].trailer_url,
      });
    }
  }, [videoPlayer.isVideoPaused, currentIndex, movieDetailData.movieData]);

  // Render shimmer loading
  const renderShimmerEffect = () => {
    return <MovieDetailsShimmer ITEM_HEIGHT={ITEM_HEIGHT} navigation={navigation} />;
  };

  // Render movie detail item
  const renderMovieDetail = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      if (!item) {
        return renderShimmerEffect();
      }

      return (
        <View style={{ height: ITEM_HEIGHT, flexDirection: "column", paddingTop: 6 }}>
          <MovieHeader navigation={navigation} />

          <VideoSection
            item={item}
            isMuted={isMuted}
            paused={videoPlayer.paused}
            isVideoPaused={videoPlayer.isVideoPaused}
            currentIndex={currentIndex}
            index={index}
            isSeeking={videoPlayer.isSeeking}
            seekPosition={videoPlayer.seekPosition}
            isShowMuteIcon={videoPlayer.isShowMuteIcon}
            onVideoProgress={enhancedVideoProgress}
            onVideoLoad={videoPlayer.handleVideoLoad}
            videoRef={videoPlayer.videoRef}
            onToggleMute={() => dispatch(toggleMute())}
            onTogglePause={() => videoPlayer.setPaused(p => !p)}
            handlerShowMuteImg={videoPlayer.handlerShowMuteImg}
            isFeedbackModal={modalManager.isFeedbackModal}
          />

          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <MovieInfoSection
              item={item}
              formatRuntime={formatRuntime}
              onTitleLayout={(e) => {
                const lines = e.nativeEvent.lines.length;
                setTitleLines(lines);
              }}
              onCommentPress={() => setthinkModal(true)}
              onBookmarkPress={() => handleToggleBookmark(item.imdb_id)}
              isBookmarked={bookmarkMap[item.imdb_id] ?? item.is_bookmarked}
            />

            <View style={{
              justifyContent: 'space-between',
              paddingBottom: 10,
              flex: 1,
              maxHeight: windowHeight * 0.24,
            }}>
              <ActionButtons
                onWatchNowPress={() => modalManager.setWatchNow(true)}
                onRankNowPress={() => {
                  handleRankingPress({
                    imdb_id: item?.imdb_id,
                    title: item?.title,
                    release_year: item?.release_year,
                    cover_image_url: item?.cover_image_url || '',
                  });
                  modalManager.setIsFeedbackModal(true);
                }}
              />

              <FooterNav
                onEpisodesPress={() => modalManager.setWatchNow(true)}
                onMoreLikeThisPress={() => modalManager.openMoreModal(item?.imdb_id)}
              />

              <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
                <ProgressBar
                  progress={videoPlayer.progress}
                  onSeek={videoPlayer.handleSeek}
                  onSeekStart={() => videoPlayer.setIsSeeking(true)}
                  onSeekEnd={() => videoPlayer.setIsSeeking(false)}
                />
              </View>
            </View>
          </View>
        </View>
      );
    },
    [currentIndex, videoPlayer, isMuted, bookmarkMap, modalManager]
  );

  if (movieDetailData.loading && movieDetailData.isInitialLoad.current) {
    return renderShimmerEffect();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movieDetailData.movieData}
        keyExtractor={(item, index) => item?.imdb_id ? item.imdb_id : `placeholder-${index}`}
        renderItem={renderMovieDetail}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="normal"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
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
        extraData={bookmarkMap}
      />

      {/* Modals */}
      <ScoreIntroModal
        visible={modalManager.showFirstModal}
        onClose={() => {
          modalManager.setShowFirstModal(false);
          modalManager.setShowSecondModal(false);
        }}
        variant="first"
      />

      <ScoreIntroModal
        visible={modalManager.showSecondModal}
        onClose={() => {
          modalManager.setShowFirstModal(false);
          modalManager.setShowSecondModal(false);
        }}
        variant="second"
      />

      <MoreSheetModal
        visible={!!modalManager.modalMovieId}
        token={token}
        imdb_idData={modalManager.modalMovieId}
        onClose={() => modalManager.openMoreModal(null)}
      />

      <EpisodesModal
        visible={modalManager.watchNow}
        onClose={() => {
          modalManager.setWatchNow(false);
          episodesManager.resetEpisodes();
        }}
        episodes={episodesManager.episodes}
        EpisodesLoder={episodesManager.episodesLoader}
        selectedId={episodesManager.selectedEpisodeId}
        onSelect={(id) => {
          episodesManager.setSelectedEpisodeId(id);
          modalManager.setWatchNow(false);
          episodesManager.resetEpisodes();
        }}
        token={token}
        bagImges={movieDetailData.movieData[currentIndex]?.cover_image_url}
        imdb_id={movieDetailData.movieData[currentIndex]?.imdb_id}
        onFetchEpisodes={(seasonNumber) =>
          episodesManager.handleFetchSeasonEpisodes(
            movieDetailData.movieData[currentIndex]?.imdb_id,
            seasonNumber
          )
        }
        sessionList={episodesManager.sessionList}
      />

      <WatchNowModal
        visible={modalManager.watchNow}
        onClose={() => modalManager.setWatchNow(false)}
      />

      <MovieInfoModal
        visible={false}
        onClose={() => {}}
        title=""
        synopsis=""
        releaseDate=""
        genre=""
      />

      {thinkModal && (
        <CommentModal
          visible={thinkModal}
          onClose={() => setthinkModal(false)}
          reviews={reviews}
          heading="Reviews"
          token={token}
          imdb_id={movieDetailData.movieData[currentIndex]?.imdb_id || imdb_idData}
          rec_scoreComm={movieDetailData.movieData[currentIndex]?.rec_score || 0}
          showCommenRankingCheck={() => {}}
          has_rated_movie={has_rated_ref.current}
        />
      )}

      {modalManager.isFeedbackModal && (
        <CompareModals token={token} useCompareHook={compareHook} />
      )}
    </SafeAreaView>
  );
};

export default memo(MovieDetailScreen);
