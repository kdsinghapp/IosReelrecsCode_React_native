import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CustomStatusBar } from '../../../../component';
import imageIndex from '../../../../assets/imageIndex';
import styles from './style';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import useHome from './useHome';
import { Color } from '../../../../theme/color';
import Notification from './Notification/Notification';
import HorizontalMovieList from '../../../../component/common/HorizontalMovieList/HorizontalMovieList';
import { getRecentActiveUsers } from '../../../../redux/Api/ProfileApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import useUserFeed from '../../../../component/card/feedCard/useUserFeed';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import isEqual from 'lodash.isequal';
import CompareModals from '../../ranking/rankingScreen/CompareModals';
import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
import { homeDiscoverApi } from '../../../../redux/Api/movieApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedCardShimmer from '../../../../component/card/feedCard/FeedCardShimmer';
import AvatarShimmer from '../../../../component/ShimmerCom/AvatarShimmer';
import MemoFeedCardHome from '../../../../component/card/feedCard/MemoFeedCardHome';

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const autoPlayEnabled = useSelector(
    (state: RootState) => state.auth.userGetData?.autoplay_trailer ?? true
  );
  const isMuted = false;
  const { navigation, setIsVisible } = useHome();
  const { feedData, fetchFeed, loadingFeed, hasMore } = useUserFeed(token);
  const [notificationModal, setNotificationModal] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [recommendData, setRecommendData] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [userloading, setUserLoading] = useState(true);
  
  // scroll states
  const [hasScrolled, setHasScrolled] = useState(false);
  const [playIndex, setPlayIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  
  // API URLs
  const trendingUrl = '/trending?country=US';
  const recommendUrl = '/recommend-movies?sort_by=rec_score';
  const bookmarksUrl = '/bookmarks?country=US';
  
  const isFocused = useIsFocused();
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingBookmark, setLoadingBookmark] = useState(true);
  const restoredRef = useRef(false);
  const lastPlayedIndexRef = useRef<number | null>(null);
  
  // API fetch flags to prevent multiple calls
  const hasFetchedRecsRef = useRef(false);
  const hasFetchedTrendingRef = useRef(false);
  const hasFetchedBookmarksRef = useRef(false);
  
  const combinedData = useMemo(() => {
    return [
      { type: 'profileStatus' },
      { type: 'header' },
      ...feedData.map(item => ({ ...item, type: 'feed' })),
    ];
  }, [feedData]);

  const compareHook = useCompareComponent(token);
  
  // refs for scroll management
  const playIndexRef = useRef<number | null>(null);
  const currentVisibleIndexRef = useRef<number>(0);
  const isFocusedRef = useRef<boolean>(false);
  
  // sync refs when states change
  useEffect(() => {
    playIndexRef.current = playIndex;
  }, [playIndex]);
  
  useEffect(() => {
    currentVisibleIndexRef.current = currentVisibleIndex;
  }, [currentVisibleIndex]);
  
  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 90,
    minimumViewTime: 250
  });

  // Stable onViewableItemsChanged handler
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (!isFocusedRef.current) return;

    if (!viewableItems || viewableItems.length === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (playIndexRef.current !== null) {
        setPlayIndex(null);
        playIndexRef.current = null;
      }
      return;
    }

    const headerOrProfileVisible = viewableItems.some(
      v => v?.item?.type === 'header' || v?.item?.type === 'profileStatus'
    );
    
    if (headerOrProfileVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (playIndexRef.current !== null) {
        setPlayIndex(null);
        playIndexRef.current = null;
      }
      lastPlayedIndexRef.current = null;
      return;
    }

    const firstVisible = viewableItems[0];
    const index = firstVisible?.index ?? 0;

    const isFeedCardVisible = viewableItems.some(
      item => item?.item?.movie && item?.item?.user
    );
    
    if (!isFeedCardVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (playIndexRef.current !== null) {
        setPlayIndex(null);
        playIndexRef.current = null;
        lastPlayedIndexRef.current = 0;
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      const target = index - 1;
      if (playIndexRef.current !== target) {
        currentVisibleIndexRef.current = index;
        setCurrentVisibleIndex(index);
        playIndexRef.current = target;
        setPlayIndex(target);
        lastPlayedIndexRef.current = target;
      }
      timeoutRef.current = null;
    }, 800);
  }).current;

  const fetchRecentUsers = useCallback(async () => {
          setUserLoading(true);

    try {
      const users = await getRecentActiveUsers(token);
                setUserLoading(false);

      setRecentUsers(users.data?.results || []);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setUserLoading(false);
    }
  }, [token]);

  const fetchTrendingData = async () => {
    if (hasFetchedTrendingRef.current) return;
    
    try {
      hasFetchedTrendingRef.current = true;
      const res = await homeDiscoverApi(token, trendingUrl);
      if (res?.results) {
        setTrendingData(res.results);
      }
    } catch (error) {
      console.error("Trending data error:", error);
      hasFetchedTrendingRef.current = false; // Reset on error to retry
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchRecommendData = async () => {
    if (hasFetchedRecsRef.current) return;
    
    try {
      hasFetchedRecsRef.current = true;
      setLoadingRecs(true);
      const res = await homeDiscoverApi(token, recommendUrl);
      
      if (res?.results) {
        setRecommendData(res.results);
      } else {
        // Handle empty response
        setRecommendData([]);
      }
    } catch (error) {
      console.error("Recommend data error:", error);
      hasFetchedRecsRef.current = false; // Reset on error
      setRecommendData([]); // Set empty array on error
    } finally {
      setLoadingRecs(false);
    }
  };

  const fetchBookmarkData = async () => {
    if (hasFetchedBookmarksRef.current) return;
    
    try {
      hasFetchedBookmarksRef.current = true;
      const res = await homeDiscoverApi(token, bookmarksUrl);
      if (res?.results) {
        setBookmarkData(res.results);
      }
    } catch (error) {
      console.error("Bookmark data error:", error);
      hasFetchedBookmarksRef.current = false; // Reset on error
    } finally {
      setLoadingBookmark(false);
    }
  };

  // Initialize all data fetches
  useEffect(() => {
    const initDataFetches = async () => {
      if (!token) return;
      
      try {
        // Run all fetches in parallel
        await Promise.allSettled([
          fetchTrendingData(),
          fetchRecommendData(),
          fetchBookmarkData(),
          fetchRecentUsers()
        ]);
      } catch (error) {
        console.error("Initial data fetch error:", error);
      }
    };

    initDataFetches();
    
    // Cleanup function
    return () => {
      hasFetchedRecsRef.current = false;
      hasFetchedTrendingRef.current = false;
      hasFetchedBookmarksRef.current = false;
    };
  }, [token]);

  // Feed data fetch
  useEffect(() => {
    if (token && !loadingFeed) {
      fetchFeed("home");
    }
  }, [token]);

  // Focus effect for restoring index
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreIndex = async () => {
        try {
          const savedIndex = await AsyncStorage.getItem('homeIndex');
          if (savedIndex !== null && isActive && !restoredRef.current) {
            const index = parseInt(savedIndex, 10);
            setCurrentVisibleIndex(index + 1);
            setPlayIndex(index);
            restoredRef.current = true;
          }
        } catch (err) {
          console.error('Error restoring homeIndex:', err);
        }
      };

      restoreIndex();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Save index
  useEffect(() => {
    const saveIndex = async () => {
      let indexForVideo = currentVisibleIndex - 1;
      try {
        await AsyncStorage.setItem('homeIndex', indexForVideo.toString());
      } catch (err) {
        console.error('Error saving homeIndex:', err);
      }
    };

    if (currentVisibleIndex !== null) {
      saveIndex();
    }
  }, [currentVisibleIndex]);

  const [feedReached, setFeedReached] = useState(false);

  const renderFooter = useCallback(() => {
    if (loadingFeed && combinedData.length <= 50) {
      return <FeedCardShimmer />;
    }

    if (loadingFeed && combinedData.length > 50) {
      return (
        <View style={{ paddingVertical: 20, marginBottom: 90 }}>
          <Text style={{ textAlign: "center", color: "gray" }}>
            Loading more content... please wait
          </Text>
          <ActivityIndicator
            size="small"
            color={Color.primary}
            style={{ marginTop: 8 }}
          />
        </View>
      );
    }

    if (!hasMore && combinedData.length > 0) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <Text style={{ textAlign: "center", color: "gray" }}>
            {/* No more data available */}
          </Text>
        </View>
      );
    }

    return <FeedCardShimmer />;
  }, [loadingFeed, hasMore, combinedData.length]);

  const RecentUsersList = React.memo(
    ({ users, navigation }) => {
      return (
        <FlatList
          data={users}
          horizontal
          keyExtractor={(item) => item?.username}
          contentContainerStyle={styles.avatarList}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={7}
          maxToRenderPerBatch={6}
          renderItem={({ item }) => {
            const avatarUri = `${BASE_IMAGE_URL}${item?.avatar}`;
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.OtherProfile, { item })
                }
                style={{ alignItems: 'center', marginRight: 12 }}
              >
                <Image
                  source={{ uri: avatarUri }}
                  style={{ height: 60, width: 60, borderRadius: 60 }}
                />
              </TouchableOpacity>
            );
          }}
        />
      );
    },
    (prev, next) => isEqual(prev.users, next.users)
  );

  const HomeHeader = React.memo(({
    trendingData,
    recommendData,
    bookmarkData,
    loadingTrending,
    loadingBookmark,
    loadingRecs,
    setFeedReached,
  }: any) => {
    return (
      <View style={{ marginHorizontal: 14, marginLeft: 5 }}>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Color.textGray,
            marginBottom: 8,
            marginLeft: 5,
          }}
        />

        <View style={{ paddingLeft: 10, paddingRight: 4 }}>
          <HorizontalMovieList
            title="Trending"
            data={trendingData}
            navigateTo={ScreenNameEnum.DiscoverTab}
            isSelectList="2"
            type="Trending"
            loading={loadingTrending}
            emptyData="No Trending titles"
            scoreType="Rec"
          />
          
          <HorizontalMovieList
            title="Recs for You"
            data={recommendData}
            navigateTo={ScreenNameEnum.DiscoverTab}
            isSelectList="1"
            type="Recs"
            loading={loadingRecs}
            emptyData="No recs for you yet"
            scoreType="Rec"
          />
          
          <HorizontalMovieList
            title="Want to watch"
            data={bookmarkData}
            navigateTo={ScreenNameEnum.DiscoverTab}
            isSelectList="5"
            type="wantWatch"
            loading={loadingBookmark}
            emptyData="No bookmarks added yet"
            scoreType="Rec"
          />
        </View>

        <Text
          allowFontScaling={false}
          style={styles.sectionTitle}
          onLayout={() => setFeedReached(true)}
        >
          Your Feed
        </Text>
      </View>
    );
  });

  const MemoFeedCardRender = useCallback((item, index, avatarUri, posterUri) => {
     return (
      <MemoFeedCardHome
        avatar={{ uri: avatarUri }}
        poster={{ uri: posterUri }}
        activity={item?.activity}
        key={item.movie?.imdb_id}
        user={item.user?.name ||item.user?.username}
        title={item.movie?.title}
        comment={item.comment}
        release_year={item?.movie?.release_year?.toString()}
        videoUri={item.movie?.trailer_url}
        imdb_id={item.movie?.imdb_id}
        isMuted={isMuted}
        token={token}
        rankPress={() => setIsVisible(true)}
        ranked={item?.rec_score}
        created_date={item?.created_date}
        shouldAutoPlay={autoPlayEnabled}
        isVisible={index === currentVisibleIndex}
        videoIndex={index}
        scoreType='Friend Score'
        shouldPlay={index - 1 === playIndex}
        isPaused={index - 1 !== playIndex}
        is_bookMark={item?.is_bookmarked}
        screenName='Home__Screen'
      />
    );
  }, [playIndex, currentVisibleIndex, autoPlayEnabled, token, isMuted]);

  const renderItem = useCallback(({ item, index }) => {
    if (item?.type === 'profileStatus') {
      if (userloading) {
        return <AvatarShimmer count={7} />;
      } else {
        return <RecentUsersList users={recentUsers} navigation={navigation} />;
      }
    }
    
    if (item?.type === 'header') {
      return (
        <HomeHeader
          trendingData={trendingData}
          recommendData={recommendData}
          bookmarkData={bookmarkData}
          setFeedReached={setFeedReached}
          loadingTrending={loadingTrending}
          loadingBookmark={loadingBookmark}
          loadingRecs={loadingRecs}
        />
      );
    }

    if (!item.movie || !item.user) return null;
    
    const avatarUri = `${BASE_IMAGE_URL}${item.user?.avatar}`;
    const posterUri = item.movie?.horizontal_poster_url;
    
    return MemoFeedCardRender(item, index, avatarUri, posterUri);
  }, [
    userloading,
    recentUsers,
    navigation,
    trendingData,
    recommendData,
    bookmarkData,
    loadingTrending,
    loadingBookmark,
    loadingRecs,
    MemoFeedCardRender
  ]);
 const filteredData = useMemo(() => {
  const result: any[] = [];
  const seenTitles = new Set<string>();

  combinedData.forEach(item => {
    if (item?.type !== 'feed') {
      result.push(item);
      return;
    }

    const movieTitle = item?.movie?.title;
    if (!movieTitle) {
      result.push(item);
      return;
    }
    // if (movieTitle.includes(item?.movie?.title)) {
    //   return; // skip this item
    // }

    // Skip duplicates
    if (!seenTitles.has(movieTitle)) {
      seenTitles.add(movieTitle);
      result.push(item);
    }
  });

  return result;
}, [combinedData]);

  const goToSearchScreen = useCallback(() => {
    navigation.navigate(ScreenNameEnum.WoodsScreen, {
      type: 'movie',
    });
  }, [navigation]);

  function mergeFeedByImdbId(data = []) {
  const result = [];
  const feedMap = new Map();

  data.forEach(item => {
    // 1️⃣ Non-feed items
    if (item?.type !== "feed") {
      result.push(item);
      return;
    }

    const imdbId = item?.movie?.imdb_id;

    // 2️⃣ Invalid feed → skip
    if (!imdbId || !item.activity || item.rec_score === -1) {
      return;
    }

    // 3️⃣ First occurrence
    if (!feedMap.has(imdbId)) {
      feedMap.set(imdbId, {
        ...item,
        _activities: new Set([item.activity]),
      });
      return;
    }

    // 4️⃣ Merge
    const existing = feedMap.get(imdbId);

    existing._activities.add(item.activity);

    // // ranked has priority
    // if (item.activity === "ranked") {
    //   existing.rec_score = item.rec_score;
    //   existing.comment = item.comment;
    // }

    // bookmarked once → always bookmarked
    if (item.is_bookmarked === true) {
      existing.is_bookmarked = true;
    }
  });

  // 5️⃣ Finalize
  feedMap.forEach(item => {
    const activityOrder = ["ranked", "bookmarked"];

    item.activity = activityOrder
      .filter(a => item._activities.has(a))
      .join(", ");

    delete item._activities;
    result.push(item);
  });

  return result;
}
  const fiter = mergeFeedByImdbId(combinedData)


   return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image 
            source={imageIndex.reelRecsHome}  
            resizeMode='cover'
            style={{
              height: 43,
              width: 133
            }} 
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setNotificationModal(true)}>
            <Image source={imageIndex.normalNotification} style={styles.backArrowImg} />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToSearchScreen}>
            <Image source={imageIndex.search} style={styles.backArrowImg} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={fiter}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || `index-${index}`}
        onEndReached={() => {
          if (hasMore && !loadingFeed) fetchFeed("home");
        }}
        contentContainerStyle={{ marginTop: 10 }}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
        windowSize={8}
        decelerationRate={0.86}
        onScrollBeginDrag={() => {
          if (!hasScrolled) setHasScrolled(true);
        }}
        ListFooterComponent={renderFooter}
        viewabilityConfigCallbackPairs={useRef([{
          viewabilityConfig: viewabilityConfigRef.current,
          onViewableItemsChanged,
        }]).current}
      />

      <CompareModals token={token} useCompareHook={compareHook} />
      <Notification
        visible={notificationModal}
        onClose={() => setNotificationModal(false)}
        bgColor={false}
      />
    </SafeAreaView>
  );
};

export default React.memo(App);