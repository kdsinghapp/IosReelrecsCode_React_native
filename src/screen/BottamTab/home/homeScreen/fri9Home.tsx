HomeScreen.tsx

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,

//   Alert,
//   VirtualizedList,
//   ActivityIndicator,
//   RefreshControl
// } from 'react-native';
// import { ComparisonModal, CustomStatusBar } from '../../../../component';
// import imageIndex from '../../../../assets/imageIndex';
// import styles from './style';
// import ScreenNameEnum from '../../../../routes/screenName.enum';
// import useHome from './useHome';
// import { Color } from '../../../../theme/color';
// import Notification from './Notification/Notification';
// import HorizontalMovieList from '../../../../component/common/HorizontalMovieList/HorizontalMovieList';
// import { getRecentActiveUsers } from '../../../../redux/Api/ProfileApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../redux/store';
// import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
// import useUserFeed from '../../../../component/card/feedCard/useUserFeed';
// import { useFocusEffect, useIsFocused } from '@react-navigation/native';

// import isEqual from 'lodash.isequal';
// import CompareModals from '../../ranking/rankingScreen/CompareModals';
// import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
// import MemoFeedCard from '../../../../component/card/feedCard/MemoFeedCard';
// import CustomText from '../../../../component/common/CustomText';
// import font from '../../../../theme/font';
// import { homeDiscoverApi } from '../../../../redux/Api/movieApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FeedCardShimmer from '../../../../component/card/feedCard/FeedCardShimmer';
// import AvatarShimmer from '../../../../component/ShimmerCom/AvatarShimmer';
// import MemoFeedCardHome from '../../../../component/card/feedCard/MemoFeedCardHome';
// const App = () => {
//   // const token = useSelector((state: RootState) => state.auth.token);
//   const token = useSelector((state: RootState) => state.auth.token);
//   const autoPlayEnabled = useSelector(
//     (state: RootState) => state.auth.userGetData?.autoplay_trailer ?? true // default to true
//   );
//   // const isMuted = useSelector((state: RootState) => state.auth.userGetData?.videos_start_with_sound);
//   const isMuted = false
//   const { navigation,
//     isVisible, setIsVisible,
//   } = useHome()

//   const {
//     feedData,
//     fetchFeed,
//     loadingFeed,
//     hasMore,
//   } = useUserFeed(token);
//   const [notificationModal, setNotificationModal] = useState(false);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [trendingData, setTrendingData] = useState([]);
//   const [recommendData, setRecommendData] = useState([]);
//   const [bookmarkData, setBookmarkData] = useState([]);
//   const [userloading, setUserLoading] = useState(true);

//   // scroll
//   const [hasScrolled, setHasScrolled] = useState(false);
//   const [playIndex, setPlayIndex] = useState<number | null>(null); // this controls when to autoplay after 2 seconds
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);


//   const [refreshing, setRefreshing] = useState(false);
//   const trendingUrl = '/trending?country=US';
//   // const recommendUrl = '/recommend-movies?country=US';
//   // const recommendUrl = '/rated-movies';
//   const recommendUrl = '/recommend-movies?sort_by=rec_score';
//   const bookmarksUrl = '/bookmarks?country=US';

//   const isFocused = useIsFocused();
//   const [loadingTrending, setLoadingTrending] = useState(true);
//   const [loadingRecs, setLoadingRecs] = useState(true);
//   const [loadingBookmark, setLoadingBookmark] = useState(true);
//   const restoredRef = useRef(false);

//   const lastPlayedIndexRef = useRef<number | null>(null);
//   const combinedData = useMemo(() => {
//     return [
//       { type: 'profileStatus' },
//       { type: 'header' },
//       ...feedData.map(item => ({ ...item, type: 'feed' })),
//     ];
//   }, [feedData]);

//   const compareHook = useCompareComponent(token);


//   // scroll

//   // refs
//   const playIndexRef = useRef<number | null>(null);
//   const currentVisibleIndexRef = useRef<number>(0);
//   const isFocusedRef = useRef<boolean>(false);

//   // timeoutRef already exists in your file; ensure it's null-initialized
//   // const timeoutRef = useRef<NodeJS.Timeout | null>(null); // you already have this

//   // sync refs when states change
//   useEffect(() => { playIndexRef.current = playIndex; }, [playIndex]);
//   useEffect(() => { currentVisibleIndexRef.current = currentVisibleIndex; }, [currentVisibleIndex]);
//   useEffect(() => { isFocusedRef.current = isFocused; }, [isFocused]);

//   // cleanup on unmount: clear timeout
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//     };
//   }, []);


//   const viewabilityConfigRef = useRef({
//     itemVisiblePercentThreshold: 90,
//     minimumViewTime: 250
//   });


//   // 2) Stable onViewableItemsChanged handler (useRef .current pattern)
//   const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
//     // guard: do nothing if screen not focused
//     if (!isFocusedRef.current) return;

//     // safe empty-check
//     if (!viewableItems || viewableItems.length === 0) {
//       // clear any pending timeout
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//       if (playIndexRef.current !== null) {
//         setPlayIndex(null);
//         playIndexRef.current = null;
//       }
//       return;
//     }

//     // stop if header/profileStatus visible
//     const headerOrProfileVisible = viewableItems.some(v => v?.item?.type === 'header' || v?.item?.type === 'profileStatus');
//     if (headerOrProfileVisible) {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//       if (playIndexRef.current !== null) {
//         setPlayIndex(null);
//         playIndexRef.current = null;
//       }
//       lastPlayedIndexRef.current = null;
//       return;
//     }

//     // find first visible index
//     const firstVisible = viewableItems[0];
//     const index = firstVisible?.index ?? 0;

//     // ensure it's a feed card (has movie + user)
//     const isFeedCardVisible = viewableItems.some(item => item?.item?.movie && item?.item?.user);
//     if (!isFeedCardVisible) {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//       if (playIndexRef.current !== null) {
//         setPlayIndex(null);
//         playIndexRef.current = null;
//         lastPlayedIndexRef.current = 0;
//       }
//       return;
//     }

//     // reset pending timeout and debounce
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }

//     // debounce: wait 800ms of stable view state before switching playIndex
//     timeoutRef.current = setTimeout(() => {
//       const target = index - 1; // your logic uses index-1
//       if (playIndexRef.current !== target) {
//         // update both ref & state (state used to re-render playing card)
//         currentVisibleIndexRef.current = index;
//         setCurrentVisibleIndex(index);

//         playIndexRef.current = target;
//         setPlayIndex(target);

//         lastPlayedIndexRef.current = target;
//         // optional debug log
//         // console.log('Optimized: playIndex set to', target);
//       }
//       timeoutRef.current = null;
//     }, 800);

//   }).current;





//   const fetchRecentUsers = useCallback(async () => {
//     try {
//       setUserLoading(true);
//       const users = await getRecentActiveUsers(token);
//        setUserLoading(false);
//       setRecentUsers(users.data?.results || []);
//     } catch (err) {
//        setUserLoading(false);
//       console.error("Error fetching users", err);
//     } finally {
//       setUserLoading(false);
//     }
//   }, [token]);


//   const fetchTrendingdata = async () => {
//     let url = trendingUrl
 
//     try {
//       const res = await homeDiscoverApi(token, url);
//       if(res?.results){
//          setLoadingTrending(false);
//       setTrendingData(res?.results)
//       }
//       // console.log('trendingUrl__data', res?.results , 'home__data_')

//     } catch (error) {
//              setLoadingTrending(false);

//       console.error(error)
//     } finally {
//       setLoadingTrending(false);
//     }
//   }
// useEffect(()=>{
//   fetchRecommendgdata()
// },[])
// const fetchRecommendgdata = async () => {
//   setLoadingRecs(true); // Loader start

//   try {
//     const res = await homeDiscoverApi(token, recommendUrl);

//     if (res?.results) {
//         setLoadingRecs(false); // Loader start

//       setRecommendData(res.results); // Data set
//     }
//   } catch (error) {
    
//     console.error("API Error:", error);
//   } finally {
//     setLoadingRecs(false); // Loader stop (sirf yahan)
//   }
// };



// const fetchsetBookmardata = async () => {
//   let url = bookmarksUrl;

//   try {
//     const res = await homeDiscoverApi(token, url);
//     if (res?.results) {
//       setLoadingBookmark(false); // loader stop (success + error dono me
//       setBookmarkData(res.results);
//     }
//   } catch (error) {
//     console.error(error);
//         setLoadingBookmark(false); // loader stop (success + error dono me)

//   } finally {
//     setLoadingBookmark(false); // loader stop (success + error dono me)
//   }
// };


//   useEffect(() => {

//     fetchTrendingdata()
//     fetchRecommendgdata()
//     fetchsetBookmardata()
//   }, [token])




//   useEffect(() => {
//     const init = async () => {
//       let videoNUllVideo = 0;
//       if (token) {
//         fetchRecentUsers();
//       }
//       await AsyncStorage.setItem('homeIndex', videoNUllVideo.toString());
//     };

//     init();
//   }, [token]);


//   // feed api 
//   const goToSearchScreen = useCallback(() => {
//     navigation.navigate(ScreenNameEnum.WoodsScreen, {
//       type: 'movie',
//     });
//   }, [navigation, token]);

//   // fetch feed data
//   // feed api 
//   useEffect(() => {
//     if (hasMore && !loadingFeed) {
//       fetchFeed("home");
//       // console.log("______homeconsoleData")
//     }
//   }, [token]);

//   // scroll
//   // const viewabilityConfigRef = useRef({
//   //   itemVisiblePercentThreshold: 90,
//   //    minimumViewTime: 250
//   // });



//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;

//       const restoreIndex = async () => {
//         try {
//           const savedIndex = await AsyncStorage.getItem('homeIndex');
//           if (savedIndex !== null && isActive && !restoredRef.current) {
//             const index = parseInt(savedIndex, 10);
//             setCurrentVisibleIndex(index + 1); // scroll to last index
//             setPlayIndex(index); // play previous video
//             restoredRef.current = true;
//           }
//         } catch (err) {
//           console.error('Error restoring homeIndex:', err);
//         }
//       };

//       restoreIndex();

//       return () => {
//         isActive = false;
//       };
//     }, [])
//   );


//   useEffect(() => {
//     const saveIndex = async () => {
//       let indexForVideo = currentVisibleIndex - 1
//       try {
//         await AsyncStorage.setItem('homeIndex', indexForVideo.toString());
//       } catch (err) {
//         console.error('Error saving homeIndex:', err);
//       }
//     };

//     if (currentVisibleIndex !== null) {
//       saveIndex();
//     }
//   }, [currentVisibleIndex]);



//   const [feedReached, setFeedReached] = useState(false);

//   const renderFooter = useCallback(() => {
//     // 🟢 Normal loading
//     if (loadingFeed && combinedData.length <= 50) {
//       return <FeedCardShimmer />;
//     }

//     // 🟡 Heavy UI load
//     if (loadingFeed && combinedData.length > 50) {
//       return (
//         <View style={{ paddingVertical: 20, marginBottom: 90 }}>
//           <Text style={{ textAlign: "center", color: "gray" }}>
//             Loading more content... please wait
//           </Text>
//           <ActivityIndicator
//             size="small"
//             color={Color.primary}
//             style={{ marginTop: 8 }}
//           />
//         </View>
//       );
//     }

//     // 🔴 No more data
//     if (!hasMore && combinedData.length > 0) {
//       return (
//         <View style={{ paddingVertical: 20 }}>
//           <Text style={{ textAlign: "center", color: "gray" }}>
//             No more data available
//           </Text>
//         </View>
//       );
//     }

//     // Default shimmer
//     return (
//       <View>
//         <FeedCardShimmer />
//       </View>
//     );
//   }, [loadingFeed, hasMore, combinedData.length]);

//   // first load
//   useEffect(() => {
//     fetchRecentUsers();
//   }, [fetchRecentUsers]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchRecentUsers();
//   };


//   const RecentUsersList = React.memo(
//     ({ users, navigation }) => {
//       console.log('RecentUsersList___edr');
//       return (
//         <FlatList
//           data={users}
//           horizontal
//           keyExtractor={(item) => item?.username}
//           contentContainerStyle={styles.avatarList}
//           showsHorizontalScrollIndicator={false}
//           initialNumToRender={7}
//           maxToRenderPerBatch={6}
//           renderItem={({ item }) => {
//             const avatarUri = `${BASE_IMAGE_URL}${item?.avatar}`;
//             return (
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate(ScreenNameEnum.OtherProfile, { item })
//                 }
//                 style={{ alignItems: 'center', marginRight: 12 }}
//               >
//                 <Image
//                   source={{ uri: avatarUri }}
//                   style={{ height: 60, width: 60, borderRadius: 60 }}
//                 />
//               </TouchableOpacity>


//             );
//           }}
//         />
//       );
//     },
//     (prev, next) => isEqual(prev.users, next.users)
//   );


//   const HomeHeader = React.memo(({
//     // multiApiUrls,
//     // handleFetchedData,
//     trendingData,
//     recommendData,
//     bookmarkData,
//     loadingMovieLists,
//     setFeedReached,
//     // loader 
//     loadingTrending,
//     loadingBookmark,
//     loadingRecs,
//   }: any) => {
//     // console.log("HomeHeader___render______");

//     return (
//       <View style={{ marginHorizontal: 14, marginLeft: 5 }}>
//         {/* <MultiApiFetcher urls={multiApiUrls} onDataFetched={handleFetchedData} /> */}

//         <View
//           style={{
//             borderWidth: 0.5,
//             borderColor: Color.textGray,
//             marginBottom: 8,
//             marginLeft: 5,
//           }}
//         />

//         <View style={{ paddingLeft: 10, paddingRight:4 }}>
//           <HorizontalMovieList
//             title="Trending"
//             data={trendingData}
//             navigateTo={ScreenNameEnum.DiscoverTab}
//             isSelectList="2"
//             type="Trending"
//             loading={loadingTrending}
//             emptyData="No Trending titles"
//             scoreType="Rec"
//           />
//           <HorizontalMovieList
//             title="Recs for You"
//             data={recommendData}
//             navigateTo={ScreenNameEnum.DiscoverTab}
//             isSelectList="1"
//             type="Recs"
//             // loading={loadingMovieLists}
//             loading={loadingRecs}
//             emptyData="No recs for you yet"
//             scoreType="Rec"
//           />
//           <HorizontalMovieList
//             title="Want to watch"
//             data={bookmarkData}
//             navigateTo={ScreenNameEnum.DiscoverTab}
//             isSelectList="5"
//             type="wantWatch"
//             // loading={loadingMovieLists}
//             loading={loadingBookmark}
//             emptyData="No bookmarks added yet"
//             scoreType="Rec"
//           />
//         </View>

//         <Text
//           allowFontScaling={false}
//           style={styles.sectionTitle}
//           onLayout={() => setFeedReached(true)}
//         >
//           Your Feed
//         </Text>
//       </View>
//     );
//   });


//   const MemoFeedCardRender = useCallback((item, index, avatarUri, posterUri) => {
//     return (
//       <MemoFeedCardHome
//         avatar={{ uri: avatarUri }}
//         poster={{ uri: posterUri }}
//         // poster={ source : require(imageIndex.THENOS1) }
//         // poster={{ uri: require('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-XiFGsiivMJ5EmeO1_ZnYkaNA4ktmNgsIA&s')  }}
//         // poster={{ uri: 'https://i.pinimg.com/originals/87/99/6d/87996d079c129821bbadd2f69a1b1795.jpg' }}
//         key={item.movie?.imdb_id} // <-- unique key per video
//         // avatar={avatarObj}
//         // poster={posterObj}
//         user={item.user?.name}
//         title={item.movie?.title}
//         comment={item.comment}
//         release_year={item?.movie?.release_year?.toString()}
//         videoUri={item.movie?.trailer_url}
//         imdb_id={item.movie?.imdb_id}
//         isMuted={isMuted}
//         token={token}
//         rankPress={() => setIsVisible(true)}
//         ranked={item?.rec_score}
//         created_date={item?.created_date}
//         shouldAutoPlay={autoPlayEnabled}
//         isVisible={index === currentVisibleIndex}
//         videoIndex={index} // FIX HERE
//         scoreType='Friend Score'
//         // scoreType='Rec'
//         shouldPlay={index - 1 === playIndex}
//         isPaused={index - 1 !== playIndex}
//         is_bookMark={item?.is_bookmarked}
//         screenName='Home__Screen'
//       />
//     );
//   }, [playIndex, recentUsers, HomeHeader])

//   const renderItem = useCallback(({ item, index }) => {
//     // console.log('call_data__item__here',item)
//     // console.log('cal_ghome__data____-----')

//     if (item?.type === 'profileStatus') {
//       if (userloading) {
//         return <AvatarShimmer count={7} />

//       } else {
//         return <RecentUsersList users={recentUsers} navigation={navigation} />;

//       }
//     }
//     if (item?.type === 'header') {
//       return <HomeHeader
//         // multiApiUrls={multiApiUrls}
//         // handleFetchedData={handleFetchedData}
//         trendingData={trendingData}
//         recommendData={recommendData}
//         bookmarkData={bookmarkData}
//         // loadingMovieLists={loadingMovieLists}
//         setFeedReached={setFeedReached}
//         loadingTrending={loadingTrending}
//         loadingBookmark={loadingBookmark}
//         loadingRecs={loadingRecs}
//       />;
//     }


//     if (loading) {
//       return <FeedCardShimmer key={`shimmer-${index}`} />;
//     }

//     // console.log(index === playIndex, "index - 1 ==___playIndex")
//     if (!item.movie || !item.user) return null;
//     const avatarUri = `${BASE_IMAGE_URL}${item.user?.avatar}`;
//     const posterUri = item.movie?.horizontal_poster_url;
//     // const avatarObj = useMemo(() => ({ uri: avatarUri }), [avatarUri]);
//     // const posterObj = useMemo(() => ({ uri: posterUri }), [posterUri]);
//     //   return (
//     //     <MemoFeedCard
//     //       avatar={{ uri: avatarUri }}
//     //       poster={{ uri: posterUri }}
//     //       // poster={ source : require(imageIndex.THENOS1) }
//     //       // poster={{ uri: require('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-XiFGsiivMJ5EmeO1_ZnYkaNA4ktmNgsIA&s')  }}
//     //       // poster={{ uri: 'https://i.pinimg.com/originals/87/99/6d/87996d079c129821bbadd2f69a1b1795.jpg' }}
//     //  key={item.movie?.imdb_id} // <-- unique key per video
//     //       // avatar={avatarObj}
//     //       // poster={posterObj}
//     //       user={item.user?.name}
//     //       title={item.movie?.title}
//     //       comment={item.comment}
//     //       release_year={item?.movie?.release_year?.toString()}
//     //       videoUri={item.movie?.trailer_url}
//     //       imdb_id={item.movie?.imdb_id}
//     //       isMuted={isMuted}
//     //       token={token}
//     //       rankPress={() => setIsVisible(true)}
//     //       ranked={item?.rec_score}
//     //       created_date={item?.created_date}
//     //       shouldAutoPlay={autoPlayEnabled}
//     //       isVisible={index === currentVisibleIndex}
//     //       videoIndex={index } // FIX HERE
//     //       scoreType='Rec'
//     //       shouldPlay={index - 1 === playIndex}
//     //       isPaused={index - 1 !== playIndex}
//     //       is_bookMark = {item?.is_bookmarked}
//     //       screenName = 'Home__Screen'
//     //     />
//     //   );
//     return MemoFeedCardRender(item, index, avatarUri, posterUri)
//   }, [autoPlayEnabled, playIndex, recentUsers, isFocused]);
//  const mergedData = [];

// const movieMap = new Map();

// combinedData.forEach(item => {
//   if (item.type !== 'feed') {
//     mergedData.push(item);
//     return;
//   }

//   const imdbId = item.movie?.imdb_id;

//   if (!movieMap.has(imdbId)) {
//     movieMap.set(imdbId, { ...item });
//   } else {
//     const existing = movieMap.get(imdbId);

//     // activity merge logic
//     if (
//       (existing.activity === 'ranked' && item.activity === 'bookmarked') ||
//       (existing.activity === 'bookmarked' && item.activity === 'ranked')
//     ) {
//       existing.activity = 'ranked_and_bookmarked';
//     }

//     // bookmark true rakho agar kisi me true ho
//     existing.is_bookmarked =
//       existing.is_bookmarked || item.is_bookmarked;

//     // rec_score preference (ranked ka score)
//     existing.rec_score =
//       item.activity === 'ranked'
//         ? item.rec_score
//         : existing.rec_score;
//   }
// });

// mergedData.push(...movieMap.values());

//   return (
//     <SafeAreaView style={styles.container}>
//       <CustomStatusBar />
//       <View style={styles.header}>
//         <View style={{ flexDirection: "row", alignItems: "center", }}>
//           <Image source={imageIndex.reelRecsHome}  
//           resizeMode='cover'
//           style={{
//             height: 43,
//             width: 133
//           }} />

//           {/* <CustomText
//             size={20}
//             color={Color.whiteText}
//             style={styles.logo}
//             font={font.PoppinsMedium}
//           >
//             ReelRecs
//           </CustomText> */}


//         </View>

//         <View style={{ flexDirection: "row", }}>
//           <TouchableOpacity onPress={() => {
//             setNotificationModal(true);
//           }}>
//             <Image source={imageIndex.normalNotification} style={styles.backArrowImg} />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={goToSearchScreen}>
//             <Image source={imageIndex.search} style={styles.backArrowImg} />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <FlatList
//         data={mergedData}
//         //  data={combinedData}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => item?.id?.toString() || `index-${index}`}
//         onEndReached={() => {
//           if (hasMore && !loadingFeed) fetchFeed("home");
//         }}
//         contentContainerStyle={{ marginTop: 10 }}
//         onEndReachedThreshold={0.5}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//         initialNumToRender={2}
//         maxToRenderPerBatch={6}
//         removeClippedSubviews={true}
//         windowSize={8}
//         // removeClippedSubviews
//         decelerationRate={0.86}
//         onScrollBeginDrag={() => {
//           if (!hasScrolled) setHasScrolled(true);
//         }}

//         ListFooterComponent={renderFooter}
//         viewabilityConfigCallbackPairs={useRef([{
//           viewabilityConfig: viewabilityConfigRef.current,
//           onViewableItemsChanged,
//         }]).current}

//       // 👇 Footer Loader + UI Heavy Condition
//       //   ListFooterComponent={() => {
//       //    { 
//       //     // 🟢 Condition 1: Normal loading when fetching more data
//       //     if (loadingFeed && combinedData.length <= 50) {
//       //       return (
//       //         <FeedCardShimmer   />
//       //       );
//       //     }
//       //     // 🟡 Condition 2: When too much data already loaded (UI heavy)
//       //     else if (loadingFeed && combinedData.length > 50) {
//       //       return (
//       //         <View style={{ paddingVertical: 20, marginBottom: 90 }}>
//       //           <Text style={{ textAlign: "center", color: "gray" }}>
//       //             Loading more content... please wait
//       //           </Text>
//       //           <ActivityIndicator
//       //             size="small"
//       //             color={Color.primary}
//       //             style={{ marginTop: 8 }}
//       //           />
//       //         </View>
//       //       );
//       //     }

//       //     // 🔴 Condition 3: When no more data
//       //     else if (!hasMore && combinedData.length > 0) {
//       //       return (
//       //         <View style={{ paddingVertical: 20 }}>
//       //           <Text style={{ textAlign: "center", color: "gray" }}>
//       //             No more data available
//       //           </Text>
//       //         </View>
//       //       );
//       //     }

//       //     // Default case: nothing to show
//       //     else {
//       //       return (
//       //          <View>
//       //       <FeedCardShimmer />
//       //       </View>
//       //       )
//       //       ;
//       //     }}

//       //   }
//       // }

//       />

//       <CompareModals token={token} useCompareHook={compareHook} />
//       <Notification
//         visible={notificationModal}
//         onClose={() => setNotificationModal(false)}
//         bgColor={false}
//       />
//     </SafeAreaView>
//   );
// };
// // export default App;
// export default React.memo(App);






import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,

  Alert,
  VirtualizedList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { ComparisonModal, CustomStatusBar } from '../../../../component';
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
import MemoFeedCard from '../../../../component/card/feedCard/MemoFeedCard';
import CustomText from '../../../../component/common/CustomText';
import font from '../../../../theme/font';
import { homeDiscoverApi } from '../../../../redux/Api/movieApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedCardShimmer from '../../../../component/card/feedCard/FeedCardShimmer';
import AvatarShimmer from '../../../../component/ShimmerCom/AvatarShimmer';
import MemoFeedCardHome from '../../../../component/card/feedCard/MemoFeedCardHome';
const App = () => {
  // const token = useSelector((state: RootState) => state.auth.token);
  const token = useSelector((state: RootState) => state.auth.token);
  const autoPlayEnabled = useSelector(
    (state: RootState) => state.auth.userGetData?.autoplay_trailer ?? true // default to true
  );
  // const isMuted = useSelector((state: RootState) => state.auth.userGetData?.videos_start_with_sound);
  const isMuted = false
  const { navigation,
    isVisible, setIsVisible,
  } = useHome()

  const {
    feedData,
    fetchFeed,
    loadingFeed,
    hasMore,
  } = useUserFeed(token);
  const [notificationModal, setNotificationModal] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendingData, setTrendingData] = useState([]);
  const [recommendData, setRecommendData] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [userloading, setUserLoading] = useState(true);

  // scroll
  const [hasScrolled, setHasScrolled] = useState(false);
  const [playIndex, setPlayIndex] = useState<number | null>(null); // this controls when to autoplay after 2 seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);


  const [refreshing, setRefreshing] = useState(false);
  const trendingUrl = '/trending?country=US';
  // const recommendUrl = '/recommend-movies?country=US';
  // const recommendUrl = '/rated-movies';
  const recommendUrl = '/recommend-movies?sort_by=rec_score';
  const bookmarksUrl = '/bookmarks?country=US';

  const isFocused = useIsFocused();
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingBookmark, setLoadingBookmark] = useState(true);
  const restoredRef = useRef(false);

  const lastPlayedIndexRef = useRef<number | null>(null);
  const combinedData = useMemo(() => {
    return [
      { type: 'profileStatus' },
      { type: 'header' },
      ...feedData.map(item => ({ ...item, type: 'feed' })),
    ];
  }, [feedData]);

  const compareHook = useCompareComponent(token);


  // scroll

  // refs
  const playIndexRef = useRef<number | null>(null);
  const currentVisibleIndexRef = useRef<number>(0);
  const isFocusedRef = useRef<boolean>(false);

  // timeoutRef already exists in your file; ensure it's null-initialized
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null); // you already have this

  // sync refs when states change
  useEffect(() => { playIndexRef.current = playIndex; }, [playIndex]);
  useEffect(() => { currentVisibleIndexRef.current = currentVisibleIndex; }, [currentVisibleIndex]);
  useEffect(() => { isFocusedRef.current = isFocused; }, [isFocused]);

  // cleanup on unmount: clear timeout
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


  // 2) Stable onViewableItemsChanged handler (useRef .current pattern)
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    // guard: do nothing if screen not focused
    if (!isFocusedRef.current) return;

    // safe empty-check
    if (!viewableItems || viewableItems.length === 0) {
      // clear any pending timeout
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

    // stop if header/profileStatus visible
    const headerOrProfileVisible = viewableItems.some(v => v?.item?.type === 'header' || v?.item?.type === 'profileStatus');
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

    // find first visible index
    const firstVisible = viewableItems[0];
    const index = firstVisible?.index ?? 0;

    // ensure it's a feed card (has movie + user)
    const isFeedCardVisible = viewableItems.some(item => item?.item?.movie && item?.item?.user);
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

    // reset pending timeout and debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // debounce: wait 800ms of stable view state before switching playIndex
    timeoutRef.current = setTimeout(() => {
      const target = index - 1; // your logic uses index-1
      if (playIndexRef.current !== target) {
        // update both ref & state (state used to re-render playing card)
        currentVisibleIndexRef.current = index;
        setCurrentVisibleIndex(index);

        playIndexRef.current = target;
        setPlayIndex(target);

        lastPlayedIndexRef.current = target;
        // optional debug log
        // console.log('Optimized: playIndex set to', target);
      }
      timeoutRef.current = null;
    }, 800);

  }).current;





  const fetchRecentUsers = useCallback(async () => {
    try {
      setUserLoading(true);
      const users = await getRecentActiveUsers(token);
       setUserLoading(false);
      setRecentUsers(users.data?.results || []);
    } catch (err) {
       setUserLoading(false);
      console.error("Error fetching users", err);
    } finally {
      setUserLoading(false);
    }
  }, [token]);


  const fetchTrendingdata = async () => {
    let url = trendingUrl
 
    try {
      const res = await homeDiscoverApi(token, url);
      if(res?.results){
         setLoadingTrending(false);
      setTrendingData(res?.results)
      }
      // console.log('trendingUrl__data', res?.results , 'home__data_')

    } catch (error) {
             setLoadingTrending(false);

      console.error(error)
    } finally {
      setLoadingTrending(false);
    }
  }
useEffect(()=>{
  fetchRecommendgdata()
},[])
const fetchRecommendgdata = async () => {
  setLoadingRecs(true); // Loader start

  try {
    const res = await homeDiscoverApi(token, recommendUrl);

    if (res?.results) {
        setLoadingRecs(false); // Loader start

      setRecommendData(res.results); // Data set
    }
  } catch (error) {
    
    console.error("API Error:", error);
  } finally {
    setLoadingRecs(false); // Loader stop (sirf yahan)
  }
};



const fetchsetBookmardata = async () => {
  let url = bookmarksUrl;

  try {
    const res = await homeDiscoverApi(token, url);
    if (res?.results) {
      setLoadingBookmark(false); // loader stop (success + error dono me
      setBookmarkData(res.results);
    }
  } catch (error) {
    console.error(error);
        setLoadingBookmark(false); // loader stop (success + error dono me)

  } finally {
    setLoadingBookmark(false); // loader stop (success + error dono me)
  }
};


  useEffect(() => {

    fetchTrendingdata()
    fetchRecommendgdata()
    fetchsetBookmardata()
  }, [token])




  useEffect(() => {
    const init = async () => {
      let videoNUllVideo = 0;
      if (token) {
        fetchRecentUsers();
      }
      await AsyncStorage.setItem('homeIndex', videoNUllVideo.toString());
    };

    init();
  }, [token]);


  // feed api 
  const goToSearchScreen = useCallback(() => {
    navigation.navigate(ScreenNameEnum.WoodsScreen, {
      type: 'movie',
    });
  }, [navigation, token]);

  // fetch feed data
  // feed api 
  useEffect(() => {
       console.log("======== ------")
    // if (hasMore && !loadingFeed) {
       fetchFeed("home");
      // console.log("______homeconsoleData")
    // }
  }, [token]);

  // scroll
  // const viewabilityConfigRef = useRef({
  //   itemVisiblePercentThreshold: 90,
  //    minimumViewTime: 250
  // });



  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreIndex = async () => {
        try {
          const savedIndex = await AsyncStorage.getItem('homeIndex');
          if (savedIndex !== null && isActive && !restoredRef.current) {
            const index = parseInt(savedIndex, 10);
            setCurrentVisibleIndex(index + 1); // scroll to last index
            setPlayIndex(index); // play previous video
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


  useEffect(() => {
    const saveIndex = async () => {
      let indexForVideo = currentVisibleIndex - 1
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
            {/* No more data available */}
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

  // first load
  useEffect(() => {
    fetchRecentUsers();
  }, [fetchRecentUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecentUsers();
  };


  const RecentUsersList = React.memo(
    ({ users, navigation }) => {
      console.log('RecentUsersList___edr');
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
    // multiApiUrls,
    // handleFetchedData,
    trendingData,
    recommendData,
    bookmarkData,
    loadingMovieLists,
    setFeedReached,
    // loader 
    loadingTrending,
    loadingBookmark,
    loadingRecs,
  }: any) => {
    // console.log("HomeHeader___render______");

    return (
      <View style={{ marginHorizontal: 14, marginLeft: 5 }}>
        {/* <MultiApiFetcher urls={multiApiUrls} onDataFetched={handleFetchedData} /> */}

        <View
          style={{
            borderWidth: 0.5,
            borderColor: Color.textGray,
            marginBottom: 8,
            marginLeft: 5,
          }}
        />

        <View style={{ paddingLeft: 10, paddingRight:4 }}>
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
            // loading={loadingMovieLists}
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
            // loading={loadingMovieLists}
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
      // <MemoFeedCard
        avatar={{ uri: avatarUri }}
        poster={{ uri: posterUri }}
        activity={item?.activity}
        // poster={ source : require(imageIndex.THENOS1) }
        // poster={{ uri: require('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-XiFGsiivMJ5EmeO1_ZnYkaNA4ktmNgsIA&s')  }}
        // poster={{ uri: 'https://i.pinimg.com/originals/87/99/6d/87996d079c129821bbadd2f69a1b1795.jpg' }}
        key={item.movie?.imdb_id} // <-- unique key per video
        // avatar={avatarObj}
        // poster={posterObj}
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
        created_date={item?.created_date}
        shouldAutoPlay={autoPlayEnabled}
        isVisible={index === currentVisibleIndex}
        videoIndex={index} // FIX HERE
        scoreType='Friend Score'
        // scoreType='Rec'
        shouldPlay={index - 1 === playIndex}
        isPaused={index - 1 !== playIndex}
        is_bookMark={item?.is_bookmarked}
        screenName='Home__Screen'
      />
    );
  }, [playIndex, recentUsers, HomeHeader])

  const renderItem = useCallback(({ item, index }) => {
    // console.log('call_data__item__here',item)
    // console.log('cal_ghome__data____-----')

    if (item?.type === 'profileStatus') {
      if (userloading) {
        return <AvatarShimmer count={7} />

      } else {
        return <RecentUsersList users={recentUsers} navigation={navigation} />;

      }
    }
    if (item?.type === 'header') {
      return <HomeHeader
        // multiApiUrls={multiApiUrls}
        // handleFetchedData={handleFetchedData}
        trendingData={trendingData}
        recommendData={recommendData}
        bookmarkData={bookmarkData}
        // loadingMovieLists={loadingMovieLists}
        setFeedReached={setFeedReached}
        loadingTrending={loadingTrending}
        loadingBookmark={loadingBookmark}
        loadingRecs={loadingRecs}
      />;
    }


    if (loading) {
      return <FeedCardShimmer key={`shimmer-${index}`} />;
    }

    // console.log(index === playIndex, "index - 1 ==___playIndex")
    if (!item.movie || !item.user) return null;
    const avatarUri = `${BASE_IMAGE_URL}${item.user?.avatar}`;
    const posterUri = item.movie?.horizontal_poster_url;
    // const avatarObj = useMemo(() => ({ uri: avatarUri }), [avatarUri]);
    // const posterObj = useMemo(() => ({ uri: posterUri }), [posterUri]);
    //   return (
    //     <MemoFeedCard
    //       avatar={{ uri: avatarUri }}
    //       poster={{ uri: posterUri }}
    //       // poster={ source : require(imageIndex.THENOS1) }
    //       // poster={{ uri: require('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-XiFGsiivMJ5EmeO1_ZnYkaNA4ktmNgsIA&s')  }}
    //       // poster={{ uri: 'https://i.pinimg.com/originals/87/99/6d/87996d079c129821bbadd2f69a1b1795.jpg' }}
    //  key={item.movie?.imdb_id} // <-- unique key per video
    //       // avatar={avatarObj}
    //       // poster={posterObj}
    //       user={item.user?.name}
    //       title={item.movie?.title}
    //       comment={item.comment}
    //       release_year={item?.movie?.release_year?.toString()}
    //       videoUri={item.movie?.trailer_url}
    //       imdb_id={item.movie?.imdb_id}
    //       isMuted={isMuted}
    //       token={token}
    //       rankPress={() => setIsVisible(true)}
    //       ranked={item?.rec_score}
    //       created_date={item?.created_date}
    //       shouldAutoPlay={autoPlayEnabled}
    //       isVisible={index === currentVisibleIndex}
    //       videoIndex={index } // FIX HERE
    //       scoreType='Rec'
    //       shouldPlay={index - 1 === playIndex}
    //       isPaused={index - 1 !== playIndex}
    //       is_bookMark = {item?.is_bookmarked}
    //       screenName = 'Home__Screen'
    //     />
    //   );
    return MemoFeedCardRender(item, index, avatarUri, posterUri)
  }, [autoPlayEnabled, playIndex, recentUsers, isFocused]);
 

const filteredData = useMemo(() => {
  const result = [];
  const feedMap = {};
  combinedData.forEach(item => {
    // Non-feed items ko same order me push karo
    if (item?.type !== 'feed') {
      result.push(item);
      return;
    }
    const imdbId = item?.movie?.imdb_id;
    if (!imdbId) {
      result.push(item);
      return;
    }
    if (!feedMap[imdbId]) {
      feedMap[imdbId] = {
        ...item,
        activities: [item.activity],
      };
    } else {
      feedMap[imdbId].activities.push(item.activity);
    }
  });

  // Merged feed items ko result me add karo
  Object.values(feedMap).forEach(item => {
    const uniqueActivities = [...new Set(item.activities)];

    result.push({
      ...item,
      activity: uniqueActivities.join(', '), // ✅ comma-separated string
      activities: uniqueActivities, // optional
    });
  });

  return result;
}, [combinedData]);
// console.log("combinedData",combinedData)
  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", }}>
          <Image source={imageIndex.reelRecsHome}  
          resizeMode='cover'
          style={{
            height: 43,
            width: 133
          }} />

          {/* <CustomText
            size={20}
            color={Color.whiteText}
            style={styles.logo}
            font={font.PoppinsMedium}
          >
            ReelRecs
          </CustomText> */}


        </View>

        <View style={{ flexDirection: "row", }}>
          <TouchableOpacity onPress={() => {
            setNotificationModal(true);
          }}>
            <Image source={imageIndex.normalNotification} style={styles.backArrowImg} />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToSearchScreen}>
            <Image source={imageIndex.search} style={styles.backArrowImg} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
      data={filteredData}
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
        // removeClippedSubviews
        decelerationRate={0.86}
        onScrollBeginDrag={() => {
          if (!hasScrolled) setHasScrolled(true);
        }}

        ListFooterComponent={renderFooter}
        viewabilityConfigCallbackPairs={useRef([{
          viewabilityConfig: viewabilityConfigRef.current,
          onViewableItemsChanged,
        }]).current}

      // 👇 Footer Loader + UI Heavy Condition
      //   ListFooterComponent={() => {
      //    { 
      //     // 🟢 Condition 1: Normal loading when fetching more data
      //     if (loadingFeed && combinedData.length <= 50) {
      //       return (
      //         <FeedCardShimmer   />
      //       );
      //     }
      //     // 🟡 Condition 2: When too much data already loaded (UI heavy)
      //     else if (loadingFeed && combinedData.length > 50) {
      //       return (
      //         <View style={{ paddingVertical: 20, marginBottom: 90 }}>
      //           <Text style={{ textAlign: "center", color: "gray" }}>
      //             Loading more content... please wait
      //           </Text>
      //           <ActivityIndicator
      //             size="small"
      //             color={Color.primary}
      //             style={{ marginTop: 8 }}
      //           />
      //         </View>
      //       );
      //     }

      //     // 🔴 Condition 3: When no more data
      //     else if (!hasMore && combinedData.length > 0) {
      //       return (
      //         <View style={{ paddingVertical: 20 }}>
      //           <Text style={{ textAlign: "center", color: "gray" }}>
      //             No more data available
      //           </Text>
      //         </View>
      //       );
      //     }

      //     // Default case: nothing to show
      //     else {
      //       return (
      //          <View>
      //       <FeedCardShimmer />
      //       </View>
      //       )
      //       ;
      //     }}

      //   }
      // }

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
// export default App;
export default React.memo(App);



