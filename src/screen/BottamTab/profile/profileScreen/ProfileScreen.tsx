import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, ScrollView,  FlatList, TouchableOpacity, ActivityIndicator, VirtualizedList, Dimensions } from 'react-native';
import { Button, ComparisonModal, CustomStatusBar, FeedbackModal, HeaderCustom, ProfileCard } from '../../../../component';
import imageIndex from '../../../../assets/imageIndex';
import styles from './style';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import useHome from '../../home/homeScreen/useHome';
// import { feedData, mockMovies, mockMoviesw } from '../../home/homeScreen/HomeData';
import FeedCard from '../../../../component/card/feedCard/FeedCard';
import { Color } from '../../../../theme/color';
import HorizontalMovieList from '../../../../component/common/HorizontalMovieList/HorizontalMovieList';
import font from '../../../../theme/font';
import useProfile from './useProfile';
import LoadingModal from '../../../../utils/Loader';
import { getHistoryApi, getUserBookmarks, toggleBookmar } from '../../../../redux/Api/ProfileApi';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { getRatedMovies } from '../../../../redux/Api/movieApi';
import useUserFeed from '../../../../component/card/feedCard/useUserFeed';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { getSuggestedFriends } from '../../../../redux/Api/followService';
import SuggestedFriendCard from '../../../../component/common/SuggestedFriendCard/SuggestedFriendCard';
import MemoFeedCard from '../../../../component/card/feedCard/MemoFeedCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedCardShimmer from '../../../../component/card/feedCard/FeedCardShimmer';
import MemoFeedCardHome from '../../../../component/card/feedCard/MemoFeedCardHome';


const ProfileScreen = () => {

  const { token, userGetData } = useSelector((state: RootState) => state.auth);
  const avatar = userGetData?.avatar;
  const autoPlayEnabled = userGetData?.autoplay_trailer ?? true;
  const isMuted = userGetData?.videos_start_with_sound;
const restoredRef = useRef(false);

  // const token = useSelector((state: RootState) => state.auth.token); // ✅ outside any condition
  // const userprofile = useSelector((state: RootState) => state.auth.userGetData.avatar); // ✅ outside any condition
  const email_da_data = useSelector((state: RootState) => state.auth.userGetData);
  // console.log(email_da_data, 'email_da_data_wdd_')
  const userprofile = useSelector((state: RootState) => state.auth.userGetData?.avatar);
   // console.log(BASE_IMAGE_URL + avatar, "userGetDatakala")
  const {
    loading,
    userProfile,
    // userProfileDate,
    getAgain,

    setGetAgain
  } = useProfile();
  const page = "1";
  ;
  const {
    feedData,
    fetchFeed,
    loadingFeed,
    hasMore,
    getUserFeed,
  } = useUserFeed(token);
   const { navigation,
    isVisible, setIsVisible,
    modalVisible, setModalVisible,
  } = useHome()
  const [suggestedFriend, setSuggestedFriend] = useState([]);
  const listRef = useRef<FlatList>(null);
  const ITEM_HEIGHT = Math.round(Dimensions.get('window').height * 0.65);
  const [savedMovies, setSavedMovies] = useState([]);
  const [historyMovies, setHistoryMovies] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [rankingMovie, setRankingMovie] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);


  // scroll
  const [hasScrolled, setHasScrolled] = useState(false);
  const [loadingMovieLists, setLoadingMovieLists] = useState(true);
  const [playIndex, setPlayIndex] = useState<number | null>(null); // this controls when to autoplay after 2 seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const lastPlayedIndexRef = useRef<number | null>(null);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingBookmark, setLoadingBookmark] = useState(true);
  const isFocused = useIsFocused();

  //   const combinedData = useMemo(() => {
  //   console.log("header_list_mainData , ", feedData)
  //   return [{ type: 'header' }, ...feedData.map(item => ({ ...item, type: 'feed' }))];
  // }, [feedData]);

  const combinedData = useMemo(() => {
    return [
      { type: 'profileCard' },
      { type: 'header' },
      ...feedData.map(item => ({ ...item, type: 'feed' })),
    ];
  }, [feedData]);


  // const combinedData = useMemo(() => feedData.map(item => ({ ...item, type: 'feed' })), [feedData]);

  // console.log(feedData, "fffffdfdffdfdffdd")


  
useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const restoreIndex = async () => {
      try {
        const savedIndex = await AsyncStorage.getItem('profileIndex');
        console.log('savedIndex__data',savedIndex)
        if (savedIndex !== null && isActive && !restoredRef.current) {
        // if (savedIndex !== null && isActive) {
          const index = parseInt(savedIndex, 10);
          setCurrentVisibleIndex(index + 1); // scroll to last index
          setPlayIndex(index); // play previous video
          console.log('Restored last played index:', index);
          restoredRef.current = true;
        }
      } catch (err) {
        console.error('Error restoring profileIndex:', err);
      }
    };

    restoreIndex();

    return () => {
      isActive = false;
    };
  }, [])
);


useEffect(() => {
  const saveIndex = async () => {
    let indexForVideo = currentVisibleIndex -1 
    try {
      await AsyncStorage.setItem('profileIndex', indexForVideo.toString());
      console.log('Saved profileIndex__data_For_video__play:', currentVisibleIndex);
    } catch (err) {
      console.error('Error saving profileIndex:', err);
    }
  };

  if (currentVisibleIndex !== null) {
    saveIndex();
  }
}, [currentVisibleIndex]);

  // fetch feed data
  // feed api 

  // scroll
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 90,
     minimumViewTime: 250
  });
  // scroll
  // const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  //   // console.log("📸 viewableItems:", viewableItems.map(v => v.index));
  //   if (!isFocused) return;
  //   if (viewableItems.length > 0) {
  //     const firstVisible = viewableItems[0];
  //     const index = firstVisible?.index ?? 0;

  //     if (firstVisible?.item?.type === 'header') {
  //       setPlayIndex(null);
  //       return;
  //     }

  //     const isFeedCardVisible = viewableItems.some(
  //       item => item?.item?.movie && item?.item?.user
  //     );

  //     if (!isFeedCardVisible) {
  //       setPlayIndex(null);
  //       return;
  //     }

  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);

  //     timeoutRef.current = setTimeout(() => {
  //       if (playIndex !== index - 1) { // only update if changed
  //         setCurrentVisibleIndex(index);
  //         setPlayIndex(index - 1);
  //         lastPlayedIndexRef.current = index - 1;
  //         console.log("playIndex set to:", index - 1);
  //       }
  //     }, 800);
  //   } else {
  //     setPlayIndex(null);
  //   }
  // }, [isFocused]);


const onViewableItemsChanged = useCallback(({ viewableItems }) => {
   if (!isFocused) return;

  const headerVisible = viewableItems.some(item => item?.item?.type === 'header');

  if (headerVisible) {
    setPlayIndex(null);
    lastPlayedIndexRef.current = null;
    return;
  }
   if (viewableItems.length > 0) {
    const firstVisible = viewableItems[0];
    const index = firstVisible?.index ?? 0;
 // If header or profileStatus is visible, stop video
  const nonFeedVisible = viewableItems.some(item => 
    item?.item?.type === 'header' || item?.item?.type === 'profileStatus'
  );
  if (nonFeedVisible) {
    setPlayIndex(null);
    return;
  }
console.log('callVIew__2')

    const isFeedCardVisible = viewableItems.some(
      item => item?.item?.movie && item?.item?.user
    );

    if (!isFeedCardVisible) {
      setPlayIndex(null);
      lastPlayedIndexRef.current = 0;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
console.log('callVIew__3')

    timeoutRef.current = setTimeout(() => {
      if (playIndex !== index - 1) {
        setCurrentVisibleIndex(index);
        setPlayIndex(index - 1);
        lastPlayedIndexRef.current = index - 1;
        console.log("playIndex set to:", index - 1);
      }
    }, 800);
  } else {
    setPlayIndex(null);
console.log('callVIew__4')

  }
}, [isFocused, playIndex, isVisible ]);



  

  const fetchBookmarks = async () => {
    try {
      setLoadingBookmark(true);
      const bookmarks = await getUserBookmarks(token);
      setSavedMovies(bookmarks?.results || []);
      // console.log('cll__hua__re__data__save_ka')
    } catch (err) {
      console.error("❌ Error loading bookmarks:", err);
    } finally {
      setLoadingBookmark(false);
    }
  };
  useEffect(() => {
    if (!token) return;

    fetchBookmarks();
  }, [token]);


  // -------------------------
  // RATED MOVIES FETCH
  // -------------------------
  const fetchRatedMovies = async () => {
    let videoNUllVideo = 0;

    try {
      setLoadingTrending(true);
      const rated = await getRatedMovies(token);
 await AsyncStorage.setItem('profileIndex', videoNUllVideo.toString());

      console.log("rated:", rated);
      setRankingMovie(rated?.results || []);
    } catch (err) {
      console.error("❌ Error loading rated movies:", err);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchRatedMovies();
  }, [token]);


  // -------------------------
  // HISTORY MOVIES FETCH
  // -------------------------

  const fetchHistory = async () => {
    try {
      setLoadingRecs(true);
      const history = await getHistoryApi(token);
      setHistoryMovies(history?.results || []);
    } catch (err) {
      console.error("❌ Error loading history:", err);
    } finally {
      setLoadingRecs(false);
    }
  };
  useEffect(() => {
    if (!token) return;

    fetchHistory();
  }, [token]);



  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          console.log('hua___re__Hua__kiuch__to__Hua')
          await fetchBookmarks();
          await fetchHistory();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      if (isActive) {
        fetchData();
      }

      // Cleanup when screen loses focus
      return () => {
        isActive = false;
      };
    }, [])
  );




  useEffect(() => {
    if (hasMore && !loadingFeed) {
      // fetchFeed("home");
      fetchFeed("profile", email_da_data?.username);

      // console.log("______homeconsoleData")
    }
  }, [token]);

  useEffect(() => {
    const getsuggtestFriend = async () => {
      try {
        const response = await getSuggestedFriends(token);
        setSuggestedFriend(response.results);
        console.log(response.results, "✅ response.data");
        // console.log(suggestedFriend, "📌 suggestedFriend AFTER set");
      } catch (error) {
        console.error("Error fetching suggested friends:", error);
      }
    };
    if (token) {
      getsuggtestFriend();
    };
  }, [token]);


  useEffect(() => {
    const historymoviedata = async () => {
      const data = await getHistoryApi(token);
      setHistoryMovies(data.results);
      console.log(data, "movieranking__data ")

    }
    historymoviedata()
  }, [token, navigation, getAgain])



  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfigRef.current,
      onViewableItemsChanged: onViewableItemsChanged,
    },
  ]);
  // const avatarUrl = useMemo(() => `${BASE_IMAGE_URL}${avatar}?t=${Date.now()}`, [avatar]);
  const avatarUrl = avatar ? `${BASE_IMAGE_URL}${avatar}` : undefined;

 

  const renderHeader = () => {
    return (
      <>
      
        <View style={{ paddingHorizontal: 15, marginTop:20 }} >
          <HorizontalMovieList
            title="Ranked"
            data={rankingMovie}
            username={userProfile?.name}
            imageUri={avatarUrl}
            token={token}
            my_profile={true}
            navigateTo={ScreenNameEnum.OtherTaingPrfofile}
            disableBottomSheet={true}
            loading={loadingTrending}
            emptyData={'No ratings yet'}
            scoreType='Rec'
          />
          {/* second */}
          <HorizontalMovieList
            title="Want to Watch"
            data={savedMovies}
            token={token}
            my_profile={true}

            username={userProfile?.name}
            imageUri={avatarUrl}
            navigateTo={ScreenNameEnum.OtherWantPrfofile}
            disableBottomSheet={true}
            loading={loadingRecs}

            emptyData={'No bookmarks added yet'}
            scoreType='Rec'

          />
          <HorizontalMovieList
            title="History"
            token={token}
            data={historyMovies} //  Fix applied here
            // data={savedMovies}
            // data={history}
            username={userProfile?.name}
            imageUri={avatarUrl}
            my_profile={true}

            navigateTo={ScreenNameEnum.OtherTaingPrfofile}
            disableBottomSheet={true}
            loading={loadingBookmark}

            emptyData={'No history yet'}
            scoreType='Rec'

          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, paddingHorizontal: 1, alignContent: 'center' }}>
            <Text style={styles.sectionTitle}>Suggested members</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameEnum.Followers, { tabToOpen: 2 })}
            >
              <Image source={imageIndex.rightArrow} style={styles.listArrow} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5, paddingVertical: 10 }} >
          <FlatList
            horizontal
            data={suggestedFriend}
            keyExtractor={(item) => item?.username}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5} 
ListEmptyComponent={() => {
  return (
       <Text style={{ color: Color.whiteText,marginLeft:11, fontSize: 14, 
       fontFamily:font.PoppinsMedium,
       textAlign: 'center' }}>
        No suggested members.
      </Text>
 
  );
}}

            removeClippedSubviews

            updateCellsBatchingPeriod={50}
            renderItem={({ item }) => (

              <SuggestedFriendCard
                item={item}
                BASE_IMAGE_URL={BASE_IMAGE_URL}
                onFollow={(username) => {
                  console.log('Follow clicked for', item?.username);
                }}
              />
            )}
          />
        </View>

        <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}  >

          <Text style={styles.sectionTitle}>Recent Activities</Text>
        </View>
        {/* <Text style={{fontSize:44,color:'red'}}>{savedMovies}</Text> */}

        {/* feedcard data */}
        {/* {renderFeedList} */}
        {/* </View> */}
      </>
    )
  }



  const userNameFollow = userProfile?.name;
  const renderItem = ({ item, index }) => {
    if (item.type === 'profileCard') {
      return (
        <ProfileCard
          imageUri={avatarUrl}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
          name={userProfile?.name}
          rank={`${userProfile?.ranked}`}
          rankscreenData={rankingMovie}
          followers={`${userProfile?.followers}`}
          following={`${userProfile?.following}`}
          butt={false}
          bio={userProfile?.bio}
          onFollow={() => navigation.navigate(ScreenNameEnum.Followers)}
          onFollowing={() =>
            // navigation.navigate('Followers', { tabToOpen: 1, type: 'Following', userName:userProfile?.name })
            navigation.navigate(ScreenNameEnum.Followers, { tabToOpen: 1, type: 'Following', userName: userNameFollow })
          }
          onSuggested={() =>
            navigation.navigate(ScreenNameEnum.Followers, { id: 2, type: 'Suggested', userName: userNameFollow })
          }
          onFollowPress={() =>
            navigation.navigate(ScreenNameEnum.EditProfile, {
              avatar: `${BASE_IMAGE_URL}${avatar}`,
            })
          }
        />
      );
    }
    if (item.type === 'header') {
      return renderHeader();
    }
    if (item.type === 'feed') {
      if (!item || !item.movie || !item.user) return null;

      const avatarUri = `${BASE_IMAGE_URL}${item.user?.avatar}`;
      const posterUri = item.movie?.horizontal_poster_url;
 
       return (
        <MemoFeedCardHome
          key={item?.movie?.imdb_id} // <-- unique key per video
          avatar={{ uri: avatarUri }}
          poster={{ uri: posterUri }}
          activity={item?.activity}
          user={item.user?.name}
          title={item.movie?.title}
          comment={item.comment}
          release_year={item?.movie?.release_year?.toString()}
          videoUri={item.movie?.trailer_url}
          imdb_id={item.movie?.imdb_id}
          isMuted={isMuted}
          token={token}
          rankPress={() => setIsVisible(true)}
          ranked={item?.rec_score}
          shouldAutoPlay={autoPlayEnabled}
          isVisible={index === currentVisibleIndex}
          // videoIndex={index}         // 👈 ab offset aur simple ho jayega
          // shouldPlay={index === playIndex}
          // isPaused={index !== playIndex}
          scoreType='Rec'
          videoIndex={index + 1} // FIX HERE
          // shouldPlay={index - 1 === playIndex}
          shouldPlay={index === currentVisibleIndex}

          isPaused={index - 1 !== playIndex}
          is_bookMark={item?.is_bookmarked}
        />
        // <MemoFeedCard
        //   key={item?.movie?.imdb_id} // <-- unique key per video
        //   avatar={{ uri: avatarUri }}
        //   poster={{ uri: posterUri }}
        //   user={item.user?.name}
        //   title={item.movie?.title}
        //   comment={item.comment}
        //   release_year={item?.movie?.release_year?.toString()}
        //   videoUri={item.movie?.trailer_url}
        //   imdb_id={item.movie?.imdb_id}
        //   isMuted={isMuted}
        //   token={token}
        //   rankPress={() => setIsVisible(true)}
        //   ranked={item?.rec_score}
        //   shouldAutoPlay={autoPlayEnabled}
        //   isVisible={index === currentVisibleIndex}
        //   // videoIndex={index}         // 👈 ab offset aur simple ho jayega
        //   // shouldPlay={index === playIndex}
        //   // isPaused={index !== playIndex}
        //   scoreType='Rec'
        //   videoIndex={index + 1} // FIX HERE
        //   // shouldPlay={index - 1 === playIndex}
        //   shouldPlay={index === currentVisibleIndex}

        //   isPaused={index - 1 !== playIndex}
        //   is_bookMark={item?.is_bookmarked}
        // />
      );
    }
    return null;
  };

 const renderFooter = useCallback(() => {
    // 🟢 Normal loading
    if (loadingFeed && combinedData.length <= 50) {
      return <FeedCardShimmer />;
    }

    // 🟡 Heavy UI load
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

    // 🔴 No more data
    if (!hasMore && combinedData.length > 0) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <Text style={{ textAlign: "center", color: "gray" }}>
            No more data available
          </Text>
        </View>
      );
    }

    // Default shimmer
    return (
      <View>
        <FeedCardShimmer />
      </View>
    );
  }, [loadingFeed, hasMore, combinedData.length]);


  if (loading) {
    return (<View style={{ flex: 1, backgroundColor: Color.background, alignItems: 'center', justifyContent: 'center' }} >
      <ActivityIndicator size="large" color={Color.primary} />
    </View>)
  }


  {
    loading && (
      <View style={{ flex: 1, backgroundColor: Color.background, alignItems: 'center', justifyContent: 'center' }} >
        <ActivityIndicator size="large" color={Color.primary} />
      </View>)};


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
      <LoadingModal visible={loading || !userProfile?.avatar} />
      <View style={{ paddingTop: 18, }}>
        {/* <Text style={{fontSize:22, color:'red'}} >{userProfile.name}</Text> */}
        <HeaderCustom
          title={userProfile?.name}
          rightIcon={imageIndex.settings}
          // onBackPress={() => console.log('Back pressed')}
          onRightPress={() => navigation.navigate(ScreenNameEnum.MainSetting)}
        />
        <FlatList
          data={fiter}
          // data={combinedData}
          renderItem={renderItem}
          //  keyExtractor={(item, index) => item?.id?.toString() || `index-${index}`}
          keyExtractor={(item, index) => item?.id?.toString?.() || `header-${index}`}

          onEndReached={() => {
            if (hasMore && !loadingFeed) fetchFeed("profile", email_da_data?.username);
            ;
          }}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
         initialNumToRender={2}
      maxToRenderPerBatch={6}
      // removeClippedSubviews={true} 
      windowSize={10}
      // removeClippedSubviews
   decelerationRate={0.86}
      // removeClippedSubviews={true} 

                        //  windowSize={14}             
          updateCellsBatchingPeriod={50}
          //  ListFooterComponent={renderFooter}
          onScrollBeginDrag={() => {
            if (!hasScrolled) setHasScrolled(true);
          }}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        //  viewabilityConfigCallbackPairs={useRef([{
        //    viewabilityConfig: viewabilityConfigRef.current,
        //    onViewableItemsChanged, //  Directly pass this
        //  }]).current}
        />
      </View>
    </SafeAreaView>
  );
};
// export default ProfileScreen;
export default React.memo(ProfileScreen);