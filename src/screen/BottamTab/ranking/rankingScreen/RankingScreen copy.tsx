// import React, { useCallback, useEffect, useRef, useState, } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ScrollView, StatusBar, Image, Alert, ActivityIndicator, Platform, LayoutAnimation, UIManager } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import imageIndex from '../../../../assets/imageIndex';
// import { Color } from '../../../../theme/color';
// import styles from './style';
// import ScreenNameEnum from '../../../../routes/screenName.enum';
// import { RootState } from '../../../../redux/store';
// import { getAllRatedMovies, getOtherUserRatedMovies, getRankingSuggestionMovie, recordPairwiseDecision } from '../../../../redux/Api/movieApi';
// import {
//   CustomStatusBar,
//   SearchBarCustom,
//   SlideInTooltipModal
// } from '../../../../component';
// import NormalMovieCard from '../../../../component/common/NormalMovieCard/NormalMovieCard';
// import StepProgressBar from '../../../../component/modal/stepProgressModal/StepProgressBar';
// import LayeredShadowText from '../../../../component/common/LayeredShadowText/LayeredShadowText';
// import FastImage from 'react-native-fast-image';
// import { useCompareComponent } from './useCompareComponent';
// import CompareModals from './CompareModals';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import font from '../../../../theme/font';
// import CustomText from '../../../../component/common/CustomText';
// import ButtonCustom from '../../../../component/common/button/ButtonCustom';
// import { setModalClosed } from '../../../../redux/feature/modalSlice/modalSlice';
// import RankingWithInfo from '../../../../component/ranking/RankingWithInfo';
// import NormalMovieCardShimmer from '../../../../component/common/NormalMovieCard/NormalMovieCardShimmer';
// import OutlineTextIOS from '../../../../component/NumbetTextIOS';
// // import { clearVideoCache } from '../../../../utils/VideoCacheManager/VideoCacheManager';

// const RankingScreen = () => {
//   const token = useSelector((state: RootState) => state.auth.token);
//   console.log('token token_dat ', token)
//   const { currentStep, setCurrentStep } = useCompareComponent(token);
//   const route = useRoute()
//   const navigation = useNavigation();
//   const { openTooltipModal } = route.params ?? {};
//   const [filteredMovies, setFilteredMovies] = useState([]);
//   // const [movies, setMovies] = useState([]);
//   const [ratedMovie, setRatedMovie] = useState([]);

//   const [flatlistTop, setFlatlistTop] = useState(null);
//   // const [stepsModal, setStepsModal] = useState(false);
//   const listRef = useRef(null);
//   const totalSteps = 6;
//   const [hasSeenTooltip, setHasSeenTooltip] = useState(false);
//   // const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   // const [hasMore, setHasMore] = useState(true);
//   const [TooltipModal, setTooltipModal] = useState<boolean>(openTooltipModal || false);
//   const [suggestionPage, setSuggestionPage] = useState(1);
//   const [suggestionHasMore, setSuggestionHasMore] = useState(true);
//   const [suggestionLoading, setSuggestionLoading] = useState(false);
//   const [displayMovies, setDisplayMovies] = useState([]); // ✅ copy for UI  normal movie
//   const pageRef = useRef(1);
//   // const hasMoreRef = useRef(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingIds, setLoadingIds] = useState<string[]>([]);
//   const ratedMovieRef = useRef(ratedMovie);
//   useEffect(() => { ratedMovieRef.current = ratedMovie; }, [ratedMovie]);
//   // console.log(openTooltipModal, '___openTooltipModal')
//   // useEffect(() => {
//   //   console.log(token, "token_____ -  - - - ");
//   // }, [token]);

//   const dispatch = useDispatch();
//   const isModalClosed = useSelector((state: RootState) => state.modal.isModalClosed);

//   const [loadingRated, setLoadingRated] = useState(true); // ✅ rated movies ke liye shimmer
//   const [loadingSuggestion, setLoadingSuggestion] = useState(false); // filtered suggestion

//   const [rankingRenderedCount, setRankingRenderedCount] = useState(0);
//   const [isRankingFullyRendered, setIsRankingFullyRendered] = useState(false);

//   const checkSuggestScrollRef = useRef(false);
//   const pageref = useRef(false);


//   useEffect(() => {
//     if (openTooltipModal) {
//       setTooltipModal(true);
//     }
//   }, [openTooltipModal]);


//   useEffect(() => {
//     setDisplayMovies(filteredMovies);
//   }, [filteredMovies]);




//   const getStepFromStorage = async () => {
//     try {
//       const value = await AsyncStorage.getItem('currentStep');
//       if (value !== null) {
//         const step = Number(value);
//         setCurrentStep(step);
//         setCurrentStep(step);
//         console.log("📥 Current Step fetched:", step);
//       }
//     } catch (error) {
//       console.error("❌ Error getting currentStep:", error);
//     }
//   };

//   useEffect(() => {
//     getStepFromStorage();
//   }, [compareHook,]);


//   useFocusEffect(
//     useCallback(() => {
//       if (token) {
//         setFilteredMovies([]);       // reset list
//         setSuggestionPage(1);        // reset page
//         setSuggestionHasMore(true);  // reset pagination flag
//         fetchSuggestionMovies();    // fetch first page
//         checkSuggestScrollRef.current = true;
//       }
//     }, [token])
//   );

//   // console.log(currentStep, "currentStep___")

//   const markTooltipSeen = async () => {
//     try {
//       await AsyncStorage.setItem('hasSeenTooltip', 'true');
//       setHasSeenTooltip(true);
//     } catch (e) {
//       console.error('Failed to save tooltip flag', e);
//     }
//   };

//   const getCurrentStep = async () => {
//     try {
//       const value = await AsyncStorage.getItem('currentStep');
//       if (value !== null) {

//         return Number(value);
//       }
//       return null;
//     } catch (error) {
//       console.error('Error reading currentStep:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchStep = async () => {
//       const step = await getCurrentStep();
//       setCurrentStep(step);
//     };
//     fetchStep();
//   }, [isModalClosed]);

//   const goToSearchScreen = useCallback(() => {
//     navigation.navigate(ScreenNameEnum.WoodsScreen, {
//       type: 'movie',
//       title: 'Search Movies',
//     });
//   }, [navigation]);

//   const handleLayout = (event) => {
//     const { y } = event.nativeEvent.layout;
//     const statusbar = y + StatusBar.currentHeight;
//     setFlatlistTop(statusbar);
//   };

//   // all rated movie 
//   useEffect(() => {
//     if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//       UIManager.setLayoutAnimationEnabledExperimental(true);
//     }
//   }, []);

//   const fetchRatedMovies = async () => {
//     if (!token) return;

//     setLoading(true);
//     // setLoadingRated(true); 
//     setRefreshing(true); // start subtle loader
//     try {
//       const res_All_Rated = await getAllRatedMovies(token);
//       console.log(res_All_Rated, 'res_All_Rated___');
//       // Store all movies in state
//       setRatedMovie(res_All_Rated?.results ?? []);
//       console.log('ratedMovie__data', res_All_Rated?.results)
//     } catch (error) {
//       console.error("❌ Error fetching rated movies:", error);
//     } finally {
//       setLoading(false);
//       setLoadingRated(false); // shimmer stop
//       setRefreshing(false); // stop loader
//     }
//   };

//   const fetchSuggestionMovies = async () => {
//     if (!token || suggestionLoading || !suggestionHasMore) return;
//     if (!suggestionHasMore) return;
//     if (!isRankingFullyRendered) return;
//     setSuggestionLoading(true);
//     try {
//       const res = await getRankingSuggestionMovie(token, pageRef.current);
//       console.log(pageRef.current, 'pageRef.current--', res, 'res__from__suggestion__api')
//       if (pageRef.current === 1) {
//         setFilteredMovies(res.results);
//         console.log('first__page__data_here', res)
//       } else {
//         // ✅ append only if not duplicate
//         setFilteredMovies(prev => {
//           const existingIds = new Set(prev.map(m => m.imdb_id));
//           const newResults = res.results.filter(m => !existingIds.has(m.imdb_id));
//           const newData = [...prev, ...newResults];
//           console.log('append__data_here', newData);
//           return newData;
//         });
//       }
//       // increment page internally
//       setTimeout(() => {

//         pageRef.current += 1;
//       }, 400);

//       // check if more pages available
//       if (pageRef.current > res.total_pages) {
//         console.log('api closed___pagination__')
//         setSuggestionHasMore(false);
//       }

//       // if (pageRef.current === 1) {
//       //   setFilteredMovies(res.results);
//       //   console.log('first__page__data_here',res)
//       //   // pageRef.current = res.current_page; // update current pagec
//       //   res.current_page = 2 // reset
//       // } else  {
//       //   setFilteredMovies(prev => [...prev, ...res.results]); // append
//       // };
//       // console.log('movie__suggestion__data__data_here',res)
//       // setTimeout(() => {
//       //   pageRef.current = pageRef.current +1
//       // }, 500);
//       // // console.log(res, "res__total__page___")
//       // // check if more pages available
//       // if (pageRef.current >= res.total_pages) {
//       //   setSuggestionHasMore(false);
//       // };
//       // setSuggestionPage(res?.current_page);
//     } catch (error) {
//       console.error("❌ Error fetching suggestion movies:", error);
//     } finally {
//       setSuggestionLoading(false);
//     }
//   };


//   const fetchingPage = useRef(false);

//   useEffect(() => {
//     if (!token) return;
//     // pageRef.current = 1;
//     // hasMoreRef.current = true;

//     const init = async () => {
//       setLoadingRated(true)
//       await fetchRatedMovies(); // 🔹 reset true

//       setFilteredMovies([]);       // reset list
//       setSuggestionPage(1);        // reset page
//       setSuggestionHasMore(true);  // reset pagination flag


//       await fetchSuggestionMovies();
//       checkSuggestScrollRef.current = true;
//     }
//     init()
//   }, [token]);

//   useEffect(() => {
//     if (isModalClosed) {
//       // setRatedMovie([]); // reset

//       // pageRef.current = 1;
//       // hasMoreRef.current = true;
//       fetchRatedMovies(); // first page
//       dispatch(setModalClosed(false));
//     }
//   }, [isModalClosed, dispatch]);

//   const handleRemoveMovie = (imdb_id: string) => {
//     setDisplayMovies((prevMovies) => prevMovies.filter((movie) => movie.imdb_id !== imdb_id));
//   };

//   const handleNavigation = (imdb_id: string, token: string) => {
//     navigation.navigate(ScreenNameEnum.MovieDetailScreen, { imdb_idData: imdb_id, token: token })
//     // Alert.alert(imdb_id, token)
//   };
//   const renderMovie = useCallback(({ item }: any) => {
//     return (
//       //  <NormalMovieCardShimmer key={item.imdb_id} />
//       <NormalMovieCard
//         token={token}
//         item={item}
//         onPressClose={() => handleRemoveMovie(item.imdb_id)}
//         onPressRanking={() => handleRankingPress(item)} //  FIXED HERE
//         flatlistTop={flatlistTop}

//         imdb_id={item?.imdb_id}
//       />
//     );
//   }, [flatlistTop, suggestionPage]);


//   const compareHook = useCompareComponent(token);

//   const handleRankingPress = (movie) => {
//     compareHook.openFeedbackModal(movie);
//     console.log(movie, "movie in handleRankingPress");
//   };

//   // helper function for swap movie 

//   const addLoadingIds = (ids: (string | undefined)[]) =>
//     setLoadingIds(prev => Array.from(new Set([...prev, ...ids.filter(Boolean) as string[]])));

//   const removeLoadingIds = (ids: (string | undefined)[]) =>
//     setLoadingIds(prev => prev.filter(id => ids.includes(id) === false));


//   const swapItems = async (from, to) => {
//     const current = ratedMovieRef.current || [];
//     const movieFrom = current[from];
//     const movieTo = current[to];

//     if (!movieFrom?.imdb_id || !movieTo?.imdb_id) return;

//     if (loadingIds.includes(movieFrom.imdb_id) || loadingIds.includes(movieTo.imdb_id)) return;

//     // ⭐ ADD ANIMATION HERE BEFORE STATE CHANGE:
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

//     // 🔄 Optimistic UI swap
//     setRatedMovie(prev => {
//       const updated = [...prev];
//       [updated[from], updated[to]] = [updated[to], updated[from]];
//       return updated;
//     });

//     addLoadingIds([movieFrom.imdb_id, movieTo.imdb_id]);

//     const winnerId = from > to ? movieFrom.imdb_id : movieTo.imdb_id;
//     const preference = movieTo?.preference ?? movieFrom?.preference ?? "like";

//     try {
//       const payload = {
//         imdb_id_1: movieFrom.imdb_id,
//         imdb_id_2: movieTo.imdb_id,
//         winner: winnerId,
//         preference
//       };

//       const res = await recordPairwiseDecision(token, payload);

//       // ⭐ Smoothly update score
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

//       setRatedMovie(prev =>
//         prev.map(m => ({
//           ...m,
//           rec_score: res?.[m.imdb_id] ?? m.rec_score
//         }))
//       );

//     } catch (err) {
//       console.error(err);

//       // ⭐ animate rollback too
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

//       setRatedMovie(prev => {
//         const updated = [...prev];
//         const idxA = updated.findIndex(x => x.imdb_id === movieFrom.imdb_id);
//         const idxB = updated.findIndex(x => x.imdb_id === movieTo.imdb_id);
//         if (idxA !== -1 && idxB !== -1) [updated[idxA], updated[idxB]] = [updated[idxB], updated[idxA]];
//         return updated;
//       });

//     } finally {
//       removeLoadingIds([movieFrom.imdb_id, movieTo.imdb_id]);
//     }
//   };

//   useEffect(() => {
//     if (ratedMovie.length > 0 && rankingRenderedCount >= ratedMovie.length) {
//       setIsRankingFullyRendered(true);
//       console.log('working__here_for_suggestion__data')
//     }
//   }, [rankingRenderedCount, ratedMovie.length]);


//   const onViewableItemsChanged = useRef(({ viewableItems, changed }:any) => {
//     const renderedCount = viewableItems.length;
//     setRankingRenderedCount(renderedCount);
//     // console.log('sfde_here__data_ranking__list', renderedCount)
//   }).current;

//   const RankingMovieList = useCallback(({ item, index }:any) => {
//     //    useEffect(() => {
//     //     console.log('hee___data__ranking__')
//     //   setRankingRenderedCount(prev => prev + 1);
//     // }, []);
//     return (
//       <View style={styles.movieCard}>
//         <TouchableOpacity
//           style={[styles.rankingCardContainer, { marginTop: 2 }]}
//           onPress={() => handleNavigation(item.imdb_id, token)}
//         >
//           {/* <Image source={{ uri: item?.cover_image_url }} style={styles.poster} /> */}
//           <FastImage
//             style={styles.poster}
//             source={{
//               uri: item?.cover_image_url,
//               priority: FastImage.priority.low,
//               cache: FastImage.cacheControl.immutable,
//             }}
//             resizeMode={FastImage.resizeMode.cover}
//             // onLoadStart={() => console.log('🔄 Loading...')}
//             // onLoadEnd={() => console.log('✅ Loaded' ,item.title  )}
//             onError={() => console.log('❌ Failed to load')}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleNavigation(item?.imdb_id, token)} style={styles.info}>
//           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 17 }}>
//             {/* <Text style={[styles.title]} numberOfLines={2}>{item?.title}</Text> */}
//             <CustomText
//               size={16}
//               color={Color.whiteText}
//               style={[styles.title]}
//               font={font.PoppinsMedium}
//               numberOfLines={2}
//             >
//               {item?.title}
//             </CustomText>
//           </View>
//           <CustomText
//             size={14}
//             color={Color.placeHolder}
//             style={styles.year}
//             font={font.PoppinsRegular}
//           >
//             {item?.release_year}
//           </CustomText>

//           <TouchableOpacity onPress={() => handleNavigation(item?.imdb_id, token)} style={[styles.iconprimary, { alignSelf: 'flex-end', }]}>
//             {Platform.OS == 'ios' ?
//               <OutlineTextIOS /> :
//               <LayeredShadowText text={(index + 1)} fontSize={60} marginRight={10} />
//             }
//           </TouchableOpacity>
//         </TouchableOpacity>
//         <View style={styles.icons}>
//           <View style={{ alignSelf: 'flex-end' }}>
//             {/* <RankingCard ranked={item?.rec_score} /> */}
//             <RankingWithInfo
//               score={item?.rec_score}
//               title="Rec Score"
//               description="This score predicts how much you'll enjoy this movie/show, based on your ratings and our custom algorithm."
//               loading={item?.imdb_id ? loadingIds.includes(item.imdb_id) : false}
//             />
//           </View>
//           <View style={styles.centerContainer}>
//             {/* <TouchableOpacity style={styles.iconprimary}>
//             <LayeredShadowText text={(index + 1)} fontSize={60} marginRight={10} />
//           </TouchableOpacity> */}
//             <View style={styles.iconprimary}>
//               {index > 0 && (
//                 <TouchableOpacity onPress={() => {
//                   swapItems(index, index - 1);
//                   console.log(index, item?.length, "index__in__swapItems")
//                 }}>
//                   <Image
//                     source={imageIndex.chevronUp}
//                     style={{ height: 24, width: 24 }}
//                     tintColor={Color.textGray}
//                     resizeMode='contain'
//                   />
//                 </TouchableOpacity>
//               )}
//               {index < ratedMovie.length - 1 && (
//                 <TouchableOpacity onPress={() => {
//                   swapItems(index, index + 1)
//                   console.log(index, item?.length, "Down___index__in__swapItems")
//                 }}>
//                   <Image
//                     source={imageIndex.downDown}
//                     resizeMode='contain'
//                     style={{ height: 24, width: 24 }}
//                     tintColor={Color.textGray}
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </View>
//     )
//   }

//     , [token, ratedMovie]);

//   return (
//     <SafeAreaView style={styles.maincontainer}>
//       <CustomStatusBar />

//       <View style={styles.container}>
//         <TouchableOpacity onPress={goToSearchScreen} activeOpacity={1}>
//           <View pointerEvents="none" style={{ marginBottom: 10 }}>
//             <SearchBarCustom
//               placeholder={"Search movies, shows ..."}
//               placeholderTextColor={Color.textGray}
//               editable={false}
//             />
//           </View>
//         </TouchableOpacity>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//         >

//           {currentStep >= 1 && (
//             <StepProgressBar
//               totalSteps={totalSteps}
//               disable={true}
//               currentStepModal={currentStep}
//             />
//           )}
//           {/* get all rated movie  */}

//           {currentStep > 5 && (
//             loadingRated ? (
//               <View style={{ paddingHorizontal: 10, marginTop: 14 }}>
//                 {Array.from({ length: 8 }).map((_, index) => (
//                   <NormalMovieCardShimmer key={index.toString()} />
//                 ))}
//               </View>
//             ) : (<FlatList
//               data={ratedMovie.slice(0, 11)}
//               showsVerticalScrollIndicator={false}
//               // renderItem={({ item, index }) =>RankingMovieList({ item, index })}
//               renderItem={({ item, index }) => RankingMovieList({ item, index })}
//               keyExtractor={(item, index) => `${item?.imdb_id}-${index}`} // make stable key
//               extraData={[ratedMovie, loadingIds]} // 🔹 important
//               // keyExtractor={(item, index) => `${index}-${item?.imdb_id ?? index}`}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               // extraData={ratedMovie}
//               refreshing={refreshing}
//               onRefresh={fetchRatedMovies} // pull-to-refresh if needed
//               onEndReachedThreshold={0.2}
//               initialNumToRender={8}   // still fine, renders 12 items initially
//               maxToRenderPerBatch={10}  // small batches for performance
//               windowSize={5}
//               removeClippedSubviews={true}             // small window is fine
//               onViewableItemsChanged={onViewableItemsChanged}
//               viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
//               ListFooterComponent={
//                 loading ?
//                   //  <ActivityIndicator size="large" color={Color.primary} /> 
//                   <NormalMovieCardShimmer />
//                   : null
//               }
//             />
//             )
//           )}
//           {currentStep > 5 && (
//             <ButtonCustom
//               title="Discover"
//               onPress={() => navigation.navigate(ScreenNameEnum.DiscoverTab, {
//                 screen: ScreenNameEnum.DiscoverScreen, params: { type: 'recs' },
//               })}
//               buttonStyle={styles.saveButton}
//             />
//           )}
//           <Text style={styles.heading}>
//             Have you had a chance to watch these yet?{"\n"}
//             <Text style={{ color: Color.whiteText }}>
//               We'd like to know your thoughts!
//             </Text>
//           </Text>


//           {isRankingFullyRendered ? (
//             // suggestionLoading && displayMovies.length === 0 ? (
//             //   <View style={{ paddingHorizontal: 10, marginTop: 14 }}>
//             //     {Array.from({ length: 8 }).map((_, index) => (
//             //       <NormalMovieCardShimmer key={index.toString()} />
//             //     ))}
//             //   </View>
//             // ) : (
//             <FlatList
//               showsVerticalScrollIndicator={false}
//               data={displayMovies}
//               keyExtractor={(item, index) => `${index}-${String(item?.imdb_id ?? index)}`}
//               ref={listRef}
//               onLayout={handleLayout}
//               renderItem={renderMovie}
//               extraData={displayMovies}
//               initialNumToRender={10}
//               maxToRenderPerBatch={10}
//               windowSize={8}
//               decelerationRate={0.86}
//               contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
//               // onEndReached={() => {
//               //   if (suggestionHasMore && !suggestionLoading) {
//               //     fetchSuggestionMovies(suggestionPage);
//               //   }
//               // }}
//               // FlatList onEndReached
//               onEndReached={() => {
//                 if (suggestionHasMore && !suggestionLoading) {
//                   fetchSuggestionMovies(); // next page calculate
//                 }
//               }}
//               onEndReachedThreshold={0.2}
//               ListFooterComponent={
//                 suggestionLoading ? (
//                   <ActivityIndicator size="large" color={Color.primary} />
//                 ) : null
//               }
//             />
//           ) :
//             // Optional: ranking fully render होने तक shimmer या null
//             (<View style={{ paddingHorizontal: 10, marginTop: 14 }}>
//               {Array.from({ length: 1 }).map((_, index) => (
//                 <NormalMovieCardShimmer key={index.toString()} />
//               ))}
//             </View>)
//           }



//           {/* {suggestionLoading && displayMovies.length === 0 ? (
//   <View style={{ paddingHorizontal: 10, marginTop: 14 }}>
//     {Array.from({ length: 8 }).map((_, index) => (
//       <NormalMovieCardShimmer key={index.toString()} />
//     ))}
//   </View>
// ) : (
//           <FlatList
//             showsVerticalScrollIndicator={false}
//             // data={filteredMovies}
//             data={displayMovies}
//             keyExtractor={(item, index) => `${index}-${String(item?.imdb_id ?? index)}`}
//             ref={listRef}
//             onLayout={handleLayout}
//             renderItem={renderMovie}
//             extraData={displayMovies}
//             initialNumToRender={10}
//             maxToRenderPerBatch={10}
//             windowSize={8}
//             // removeClippedSubviews={true}
//             contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
//             //  Pagination properly applied
//             onEndReached={() => {
//               if (suggestionHasMore && !suggestionLoading) {
//                 fetchSuggestionMovies(suggestionPage + 1);
//               }
//             }}
//             onEndReachedThreshold={0.2}
//             extraData={[filteredMovies, suggestionLoading, suggestionHasMore]}
//             ListFooterComponent={
//               suggestionLoading ? (
//                 <ActivityIndicator size="large" color={Color.primary} />
//               ) : null
//             }
//           />
//           )} */}
//         </ScrollView>
//       </View>
//       <CompareModals token={token} useCompareHook={compareHook} />
//       <SlideInTooltipModal
//         visible={TooltipModal}
//         onClose={() => {
//           setTooltipModal(false);
//           markTooltipSeen(); //  mark it permanently closed
//         }}
//         flatlistTop={flatlistTop}
//       />
//     </SafeAreaView>
//   );
// };
// export default React.memo(RankingScreen);


import React, { useCallback, useEffect, useRef, useState, } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StatusBar, Image, Alert, ActivityIndicator, Platform, LayoutAnimation, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import imageIndex from '../../../../assets/imageIndex';
import { Color } from '../../../../theme/color';
import styles from './style';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import { RootState } from '../../../../redux/store';
import { getAllRatedMovies, getOtherUserRatedMovies, getRankingSuggestionMovie, recordPairwiseDecision } from '../../../../redux/Api/movieApi';
import {
  CustomStatusBar,
  SearchBarCustom,
  SlideInTooltipModal
} from '../../../../component';
import NormalMovieCard from '../../../../component/common/NormalMovieCard/NormalMovieCard';
import StepProgressBar from '../../../../component/modal/stepProgressModal/StepProgressBar';
import LayeredShadowText from '../../../../component/common/LayeredShadowText/LayeredShadowText';
import FastImage from 'react-native-fast-image';
import { useCompareComponent } from './useCompareComponent';
import CompareModals from './CompareModals';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import font from '../../../../theme/font';
import CustomText from '../../../../component/common/CustomText';
import ButtonCustom from '../../../../component/common/button/ButtonCustom';
import { setModalClosed } from '../../../../redux/feature/modalSlice/modalSlice';
import RankingWithInfo from '../../../../component/ranking/RankingWithInfo';
import NormalMovieCardShimmer from '../../../../component/common/NormalMovieCard/NormalMovieCardShimmer';
import OutlineTextIOS from '../../../../component/NumbetTextIOS';
import Animated, { 
  Layout,
  SlideInDown,
  SlideInUp,
  ZoomIn,
  ZoomOut,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

const RankingScreen = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { currentStep, setCurrentStep } = useCompareComponent(token);
  const route = useRoute()
  const navigation = useNavigation();
  const { openTooltipModal } = route.params ?? {};
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [ratedMovie, setRatedMovie] = useState([]);

  const [flatlistTop, setFlatlistTop] = useState(null);
  const listRef = useRef(null);
  const totalSteps = 6;
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [TooltipModal, setTooltipModal] = useState<boolean>(openTooltipModal || false);
  const [suggestionPage, setSuggestionPage] = useState(1);
  const [suggestionHasMore, setSuggestionHasMore] = useState(true);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [displayMovies, setDisplayMovies] = useState([]);
  const pageRef = useRef(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const ratedMovieRef = useRef(ratedMovie);
  useEffect(() => { ratedMovieRef.current = ratedMovie; }, [ratedMovie]);

  const dispatch = useDispatch();
  const isModalClosed = useSelector((state: RootState) => state.modal.isModalClosed);

  const [loadingRated, setLoadingRated] = useState(true);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const [rankingRenderedCount, setRankingRenderedCount] = useState(0);
  const [isRankingFullyRendered, setIsRankingFullyRendered] = useState(false);

  const checkSuggestScrollRef = useRef(false);
  const pageref = useRef(false);

  useEffect(() => {
    if (openTooltipModal) {
      setTooltipModal(true);
    }
  }, [openTooltipModal]);

  useEffect(() => {
    setDisplayMovies(filteredMovies);
  }, [filteredMovies]);

  const getStepFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('currentStep');
      if (value !== null) {
        const step = Number(value);
        setCurrentStep(step);
        console.log("📥 Current Step fetched:", step);
      }
    } catch (error) {
      console.error("❌ Error getting currentStep:", error);
    }
  };

  useEffect(() => {
    getStepFromStorage();
  }, [compareHook]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setFilteredMovies([]);
        setSuggestionPage(1);
        setSuggestionHasMore(true);
        fetchSuggestionMovies();
        checkSuggestScrollRef.current = true;
      }
    }, [token])
  );

  const markTooltipSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTooltip', 'true');
      setHasSeenTooltip(true);
    } catch (e) {
      console.error('Failed to save tooltip flag', e);
    }
  };

  const getCurrentStep = async () => {
    try {
      const value = await AsyncStorage.getItem('currentStep');
      if (value !== null) {
        return Number(value);
      }
      return null;
    } catch (error) {
      console.error('Error reading currentStep:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchStep = async () => {
      const step = await getCurrentStep();
      setCurrentStep(step);
    };
    fetchStep();
  }, [isModalClosed]);

  const goToSearchScreen = useCallback(() => {
    navigation.navigate(ScreenNameEnum.WoodsScreen, {
      type: 'movie',
      title: 'Search Movies',
    });
  }, [navigation]);

  const handleLayout = (event) => {
    const { y } = event.nativeEvent.layout;
    const statusbar = y + StatusBar.currentHeight;
    setFlatlistTop(statusbar);
  };

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const fetchRatedMovies = async () => {
    if (!token) return;

    setLoading(true);
    setRefreshing(true);
    try {
      const res_All_Rated = await getAllRatedMovies(token);
      setRatedMovie(res_All_Rated?.results ?? []);
    } catch (error) {
      console.error("❌ Error fetching rated movies:", error);
    } finally {
      setLoading(false);
      setLoadingRated(false);
      setRefreshing(false);
    }
  };

  const fetchSuggestionMovies = async () => {
    if (!token || suggestionLoading || !suggestionHasMore) return;
    if (!isRankingFullyRendered) return;
    setSuggestionLoading(true);
    try {
      const res = await getRankingSuggestionMovie(token, pageRef.current);
      if (pageRef.current === 1) {
        setFilteredMovies(res.results);
      } else {
        setFilteredMovies(prev => {
          const existingIds = new Set(prev.map(m => m.imdb_id));
          const newResults = res.results.filter(m => !existingIds.has(m.imdb_id));
          return [...prev, ...newResults];
        });
      }
      
      setTimeout(() => {
        pageRef.current += 1;
      }, 400);

      if (pageRef.current > res.total_pages) {
        setSuggestionHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error fetching suggestion movies:", error);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const fetchingPage = useRef(false);

  useEffect(() => {
    if (!token) return;
    
    const init = async () => {
      setLoadingRated(true)
      await fetchRatedMovies();
      setFilteredMovies([]);
      setSuggestionPage(1);
      setSuggestionHasMore(true);
      await fetchSuggestionMovies();
      checkSuggestScrollRef.current = true;
    }
    init()
  }, [token]);

  useEffect(() => {
    if (isModalClosed) {
      fetchRatedMovies();
      dispatch(setModalClosed(false));
    }
  }, [isModalClosed, dispatch]);

  const handleRemoveMovie = (imdb_id: string) => {
    setDisplayMovies((prevMovies) => prevMovies.filter((movie) => movie.imdb_id !== imdb_id));
  };

  const handleNavigation = (imdb_id: string, token: string) => {
    navigation.navigate(ScreenNameEnum.MovieDetailScreen, { imdb_idData: imdb_id, token: token })
  };

  const renderMovie = useCallback(({ item }: any) => {
    return (
      <NormalMovieCard
        token={token}
        item={item}
        onPressClose={() => handleRemoveMovie(item.imdb_id)}
        onPressRanking={() => handleRankingPress(item)}
        flatlistTop={flatlistTop}
        imdb_id={item?.imdb_id}
      />
    );
  }, [flatlistTop, suggestionPage]);

  const compareHook = useCompareComponent(token);

  const handleRankingPress = (movie) => {
    compareHook.openFeedbackModal(movie);
    console.log(movie, "movie in handleRankingPress");
  };

  // Helper functions for loading states
  const addLoadingIds = (ids: (string | undefined)[]) =>
    setLoadingIds(prev => Array.from(new Set([...prev, ...ids.filter(Boolean) as string[]])));

  const removeLoadingIds = (ids: (string | undefined)[]) =>
    setLoadingIds(prev => prev.filter(id => ids.includes(id) === false));

  // Smooth swap function with position animation
  const swapItems = async (from: number, to: number) => {
    const movieFrom = ratedMovieRef.current[from];
    const movieTo = ratedMovieRef.current[to];

    if (!movieFrom?.imdb_id || !movieTo?.imdb_id) return;
    if (loadingIds.includes(movieFrom.imdb_id) || loadingIds.includes(movieTo.imdb_id)) return;

    // Mark movies as loading
    addLoadingIds([movieFrom.imdb_id, movieTo.imdb_id]);

    // Configure smooth layout animation for position change
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
    }

    // Optimistic UI swap - this will trigger the animation
    setRatedMovie(prev => {
      const updated = [...prev];
      [updated[from], updated[to]] = [updated[to], updated[from]];
      return updated;
    });

    const winnerId = from > to ? movieFrom.imdb_id : movieTo.imdb_id;
    const preference = movieTo?.preference ?? movieFrom?.preference ?? "like";

    try {
      const payload = {
        imdb_id_1: movieFrom.imdb_id,
        imdb_id_2: movieTo.imdb_id,
        winner: winnerId,
        preference,
      };

      const res = await recordPairwiseDecision(token, payload);
      console.log('Pairwise decision recorded', res);

      // Update scores after animation completes
      setTimeout(() => {
        setRatedMovie(prev =>
          prev.map(m => ({
            ...m,
            rec_score: res?.[m.imdb_id] ?? m.rec_score,
          }))
        );
      }, 300);

    } catch (err) {
      console.error('Swap API failed', err);
      
      // Rollback with animation
      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setRatedMovie(prev => {
          const updated = [...prev];
          const idxA = updated.findIndex(x => x.imdb_id === movieFrom.imdb_id);
          const idxB = updated.findIndex(x => x.imdb_id === movieTo.imdb_id);
          if (idxA !== -1 && idxB !== -1) [updated[idxA], updated[idxB]] = [updated[idxB], updated[idxA]];
          return updated;
        });
      }, 100);

    } finally {
      // Remove loading flag after animation
      setTimeout(() => {
        removeLoadingIds([movieFrom.imdb_id, movieTo.imdb_id]);
      }, 400);
    }
  };

  useEffect(() => {
    if (ratedMovie.length > 0 && rankingRenderedCount >= ratedMovie.length) {
      setIsRankingFullyRendered(true);
    }
  }, [rankingRenderedCount, ratedMovie.length]);

  const onViewableItemsChanged = useRef(({ viewableItems, changed }: any) => {
    const renderedCount = viewableItems.length;
    setRankingRenderedCount(renderedCount);
  }).current;

  // Simplified RankingMovieList with smooth position animation
  const RankingMovieList = useCallback(({ item, index }: any) => {
    const isSwapping = loadingIds.includes(item?.imdb_id);
    
    return (
      <Animated.View
        layout={Layout.springify().damping(15).stiffness(120)}
        entering={index % 2 === 0 ? SlideInDown.duration(200) : SlideInUp.duration(200)}
        style={[
          styles.movieCard,
          isSwapping && { opacity: 0.8 }
        ]}
      >
        <TouchableOpacity
          style={[styles.rankingCardContainer, { marginTop: 2 }]}
          onPress={() => handleNavigation(item.imdb_id, token)}
          activeOpacity={0.8}
          disabled={isSwapping}
        >
          <Animated.Image
            source={{ uri: item?.cover_image_url }}
            style={styles.poster}
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleNavigation(item?.imdb_id, token)} 
          style={styles.info}
          disabled={isSwapping}
        >
          <CustomText
            size={16}
            color={Color.whiteText}
            style={[styles.title]}
            font={font.PoppinsMedium}
            numberOfLines={2}
          >
            {item.title}
          </CustomText>
          <CustomText
            size={14}
            color={Color.placeHolder}
            style={styles.year}
            font={font.PoppinsRegular}
          >
            {item.release_year}
          </CustomText>
          
          <View style={[styles.iconprimary, { alignSelf: 'flex-end' }]}>
            {Platform.OS == 'ios' ?
              <OutlineTextIOS /> :
              <LayeredShadowText text={(index + 1)} fontSize={60} marginRight={10} />
            }
          </View>
        </TouchableOpacity>
        
        <View style={styles.icons}>
          <View style={{ alignSelf: 'flex-end' }}>
            <RankingWithInfo
              score={item?.rec_score}
              title="Rec Score"
              description="This score predicts how much you'll enjoy this movie/show, based on your ratings and our custom algorithm."
            />
          </View>
          
          <View style={styles.centerContainer}>
            <View style={styles.iconprimary}>
              {index > 0 && (
                <TouchableOpacity 
                  onPress={() => swapItems(index, index - 1)}
                  disabled={isSwapping}
                >
                  <Image
                    source={imageIndex.chevronUp}
                    style={{ 
                      height: 24, 
                      width: 24,
                      opacity: isSwapping ? 0.5 : 1 
                    }}
                    tintColor={Color.textGray}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              )}
              {index < ratedMovie.length - 1 && (
                <TouchableOpacity 
                  onPress={() => swapItems(index, index + 1)}
                  disabled={isSwapping}
                >
                  <Image
                    source={imageIndex.downDown}
                    resizeMode='contain'
                    style={{ 
                      height: 24, 
                      width: 24,
                      opacity: isSwapping ? 0.5 : 1 
                    }}
                    tintColor={Color.textGray}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }, [token, ratedMovie, loadingIds]);

  return (
    <SafeAreaView style={styles.maincontainer}>
      <CustomStatusBar />

      <View style={styles.container}>
        <TouchableOpacity onPress={goToSearchScreen} activeOpacity={1}>
          <View pointerEvents="none" style={{ marginBottom: 10 }}>
            <SearchBarCustom
              placeholder={"Search movies, shows ..."}
              placeholderTextColor={Color.textGray}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentStep >= 1 && (
            <StepProgressBar
              totalSteps={totalSteps}
              disable={true}
              currentStepModal={currentStep}
            />
          )}

          {/* Rated Movies Section */}
          {currentStep > 5 && (
            loadingRated ? (
              <View style={{ paddingHorizontal: 10, marginTop: 14 }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <NormalMovieCardShimmer key={index.toString()} />
                ))}
              </View>
            ) : (
              <Animated.FlatList
                data={ratedMovie.slice(0, 9)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => RankingMovieList({ item, index })}
                keyExtractor={(item, index) => `${item?.imdb_id}-${index}`}
                extraData={[ratedMovie, loadingIds]}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={refreshing}
                onRefresh={fetchRatedMovies}
                onEndReachedThreshold={0.2}
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
                itemLayoutAnimation={Layout.springify().damping(15).stiffness(120)}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
                ListFooterComponent={
                  loading ? <NormalMovieCardShimmer /> : null
                }
              />
            )
          )}

          {currentStep > 5 && (
            <ButtonCustom
              title="Discover"
              onPress={() => navigation.navigate(ScreenNameEnum.DiscoverTab, {
                screen: ScreenNameEnum.DiscoverScreen, 
                params: { type: 'recs' },
              })}
              buttonStyle={styles.saveButton}
            />
          )}

          <Text style={styles.heading}>
            Have you had a chance to watch these yet?{"\n"}
            <Text style={{ color: Color.whiteText }}>
              We'd like to know your thoughts!
            </Text>
          </Text>

          {/* Suggestion Movies Section */}
          {isRankingFullyRendered ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={displayMovies}
              keyExtractor={(item, index) => `${index}-${String(item?.imdb_id ?? index)}`}
              ref={listRef}
              onLayout={handleLayout}
              renderItem={renderMovie}
              extraData={displayMovies}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={8}
              decelerationRate={0.86}
              contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
              onEndReached={() => {
                if (suggestionHasMore && !suggestionLoading) {
                  fetchSuggestionMovies();
                }
              }}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                suggestionLoading ? (
                  <ActivityIndicator size="large" color={Color.primary} />
                ) : null
              }
            />
          ) : (
            <View style={{ paddingHorizontal: 10, marginTop: 14 }}>
              {Array.from({ length: 1 }).map((_, index) => (
                <NormalMovieCardShimmer key={index.toString()} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
      
      <CompareModals token={token} useCompareHook={compareHook} />
      <SlideInTooltipModal
        visible={TooltipModal}
        onClose={() => {
          setTooltipModal(false);
          markTooltipSeen();
        }}
        flatlistTop={flatlistTop}
      />
    </SafeAreaView>
  );
};

export default React.memo(RankingScreen);