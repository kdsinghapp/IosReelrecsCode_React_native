// // import React, {
// //   memo,
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from 'react';
// // import {
// //   View,
// //   ScrollView,
// //   Image,
// //   Text,
// //   StyleSheet,
// //   Dimensions,
// //   Animated,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Keyboard,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useSelector } from 'react-redux';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useNavigation } from '@react-navigation/native';
// // import debounce from 'lodash.debounce';
// // import FastImage from 'react-native-fast-image';

// // import imageIndex from '../../../../assets/imageIndex';
// // import { Color } from '../../../../theme/color';
// // import font from '../../../../theme/font';
// // import useMovie from '../../discover/movieDetail/useMovie';
// // import {
// //   FriendthinkModal,
// //   MovieInfoModal,
// //   CustomStatusBar,
// //   SuccessMessageCustom,
// // } from '../../../../component';
// // import WatchNowModal from '../../../../component/modal/WatchNowModal/WatchNowModal';
// // import { DescriptionWithReadMore } from '../../../../component/common/DescriptionWithReadMore/DescriptionWithReadMore';
// // import CustomText from '../../../../component/common/CustomText';
// // import { convertRuntime } from '../../../../component/convertRuntime/ConvertRuntime';
// // import {
// //   getGroupActivitiesAction,
// //   getMembersScores,
// //   recordGroupPreference,
// //   getFilteredGroupMovies,
// //   getGroupRecommendedMovies,
// //   getGroupSearchMovies,
// // } from '../../../../redux/Api/GroupApi';
// // import { RootState } from '../../../../redux/store';
// // import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
// // import GroupMovieModal from '../../../../component/modal/groupMovieModal/groupMovieModal';
// // import GroupMembersModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
// // import GroupSettingModal from '../../../../component/modal/WatchGroupSetting/WatchGroupSetting';

// // const { width, height } = Dimensions.get('window');
// // const ITEM_WIDTH = width * 0.4;
// // const SPACING = 20;
// // const ITEM_SIZE = ITEM_WIDTH + SPACING;

// // // Custom Background Component to prevent blinking
// // const BackgroundImage = memo(({ imageUri }) => {
// //   const opacity = useRef(new Animated.Value(1)).current;
// //   const [currentImage, setCurrentImage] = useState(imageUri);
// //   const [isLoading, setIsLoading] = useState(false);

// //   useEffect(() => {
// //     if (imageUri && imageUri !== currentImage) {
// //       setIsLoading(true);
// //       // Preload the image
// //       FastImage.preload([{ uri: imageUri }]);
      
// //       // Smooth transition
// //       Animated.sequence([
// //         Animated.timing(opacity, {
// //           toValue: 0.3,
// //           duration: 150,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(opacity, {
// //           toValue: 1,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //       ]).start(() => {
// //         setCurrentImage(imageUri);
// //         setIsLoading(false);
// //       });
// //     }
// //   }, [imageUri, currentImage, opacity]);

// //   if (!currentImage) {
// //     return (
// //       <View style={[StyleSheet.absoluteFill, { backgroundColor: Color.background }]} />
// //     );
// //   }

// //   return (
// //     <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
// //       <FastImage
// //         source={{
// //           uri: currentImage,
// //           priority: FastImage.priority.high,
// //           cache: FastImage.cacheControl.immutable,
// //         }}
// //         style={StyleSheet.absoluteFill}
// //         resizeMode={FastImage.resizeMode.cover}
// //         onLoadStart={() => setIsLoading(true)}
// //         onLoadEnd={() => setIsLoading(false)}
// //         onError={() => setIsLoading(false)}
// //       />
// //       <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
// //     </Animated.View>
// //   );
// // });

// // // Main Component
// // const WatchWithFrind = ({ route }) => {
// //   const token = useSelector((state: RootState) => state.auth.token);
// //   const navigation = useNavigation();
// //   const { groupProps: passedGroupProps, type, groupId } = route.params || {};

// //   // States
// //   const [group, setGroup] = useState(passedGroupProps);
// //   const [watchTogetherGroups, setWatchTogetherGroups] = useState(passedGroupProps);
// //   const [messModal, setMssModal] = useState(false);
// //   const [comment, setcomment] = useState('');
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [groupMember, setGroupMember] = useState(false);
// //   const [notificationModal, setNotificationModal] = useState(false);
// //   const [groupSettingModal, setGroupSettingModal] = useState(false);
// //   const [totalFilterApply, setTotalFilterApply] = useState(0);
// //   const [groupRecommend, setGroupRecommend] = useState([]);
// //   const [groupRecommendCopyData, setGroupRecommendCopyData] = useState([]);
// //   const [searchResult, setSearchResult] = useState([]);
// //   const [isSearchLoading, setIsSearchLoading] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(false);
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [isKeyboardVisible, setKeyboardVisible] = useState(false);
// //   const [likes, setLikes] = useState({});
// //   const [dislikes, setDislikes] = useState({});
// //   const [watchNow, setWatchNow] = useState(false);
// //   const [selectedImdbId, setSelectedImdbId] = useState(null);
// //   const [watchModalLoad, setWatchModalLoad] = useState(null);
// //   const [groupActivity, setGroupActivity] = useState([]);
// //   const [loadingActivity, setLoadingActivity] = useState(false);
// //   const [recommgroupMemebrsScore, setRecommgroupMemebrsScore] = useState([]);
// //   const [scoreMovieRank, setScoreMovieRank] = useState('');
// //   const [delayActionPreference, setDelayActionPreference] = useState(false);
// //   const [delayedIndex, setDelayedIndex] = useState(activeIndex);
// //   const [group_name, setGroup_name] = useState(group?.groupName || '');
// //   const [cachedImages, setCachedImages] = useState({});

// //   // Refs
// //   const scrollX = useRef(new Animated.Value(0)).current;
// //   const groupActivityRef = useRef([]);
// //   const searchTimeoutRef = useRef(null);
// //   const scrollViewRef = useRef(null);

// //   // Modals
// //   const { setInfoModal, InfoModal, thinkModal, setthinkModal } = useMovie();

// //   // Preload images function
// //   const preloadImages = useCallback((images) => {
// //     if (!images || images.length === 0) return;
    
// //     const newImagesToCache = {};
// //     images.forEach((movie, index) => {
// //       if (movie?.cover_image_url && !cachedImages[movie.cover_image_url]) {
// //         newImagesToCache[movie.cover_image_url] = true;
// //       }
// //     });
    
// //     if (Object.keys(newImagesToCache).length > 0) {
// //       FastImage.preload(Object.keys(newImagesToCache).map(uri => ({ uri })));
// //       setCachedImages(prev => ({ ...prev, ...newImagesToCache }));
// //     }
// //   }, [cachedImages]);

// //   // Load group from AsyncStorage if not passed
// //   useEffect(() => {
// //     const fetchStoredGroup = async () => {
// //       if (!passedGroupProps) {
// //         try {
// //           const storedGroup = await AsyncStorage.getItem('selected_group');
// //           if (storedGroup) {
// //             const parsedGroup = JSON.parse(storedGroup);
// //             setGroup(parsedGroup);
// //             setWatchTogetherGroups(parsedGroup);
// //           }
// //         } catch (error) {
// //           console.error('Failed to load group from AsyncStorage:', error);
// //         }
// //       }
// //     };
// //     fetchStoredGroup();
// //   }, [passedGroupProps]);

// //   // Keyboard listeners
// //   useEffect(() => {
// //     const keyboardDidShowListener = Keyboard.addListener(
// //       Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
// //       () => setKeyboardVisible(true)
// //     );
// //     const keyboardDidHideListener = Keyboard.addListener(
// //       Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
// //       () => setKeyboardVisible(false)
// //     );
// //     return () => {
// //       keyboardDidShowListener.remove();
// //       keyboardDidHideListener.remove();
// //     };
// //   }, []);

// //   // Preload images when groupRecommend changes
// //   useEffect(() => {
// //     if (groupRecommend.length > 0) {
// //       preloadImages(groupRecommend);
// //     }
// //   }, [groupRecommend, preloadImages]);

// //   // Preload images when searchResult changes
// //   useEffect(() => {
// //     if (searchResult.length > 0) {
// //       preloadImages(searchResult);
// //     }
// //   }, [searchResult, preloadImages]);

// //   // Delayed index for smooth background transition
// //   useEffect(() => {
// //     const timeout = setTimeout(() => {
// //       setDelayedIndex(activeIndex);
// //     }, 100);
// //     return () => clearTimeout(timeout);
// //   }, [activeIndex]);

// //   // Fetch group activities
// //   useEffect(() => {
// //     const fetchGrouchActivities = async () => {
// //       const response = await getGroupActivitiesAction(token, groupId);
// //       if (response?.results?.length > 0) {
// //         response.results.forEach(item => {
// //           const imdbId = item.movie?.imdb_id;
// //           if (item.preference === "like") {
// //             setLikes(prev => ({ ...prev, [imdbId]: true }));
// //           } else if (item.preference === "dislike") {
// //             setDislikes(prev => ({ ...prev, [imdbId]: true }));
// //           }
// //         });
// //       }
// //     };
// //     fetchGrouchActivities();
// //   }, [token]);

// //   // Fetch group activities for active movie
// //   useEffect(() => {
// //     const fetchActivity = async () => {
// //       setLoadingActivity(true);
// //       const result = await getGroupActivitiesAction(
// //         token,
// //         groupId,
// //         groupRecommend[activeIndex]?.imdb_id
// //       );
// //       setGroupActivity(result?.results);
// //       groupActivityRef.current = result?.results;
// //       setLoadingActivity(false);
// //     };
// //     if (groupRecommend.length > 0) {
// //       fetchActivity();
// //     }
// //   }, [token, delayActionPreference]);

// //   // Trigger preference update
// //   useEffect(() => {
// //     setTimeout(() => {
// //       setDelayActionPreference(!delayActionPreference);
// //     }, 500);
// //   }, [activeIndex]);

// //   // Fetch recommended movies
// //   useEffect(() => {
// //     const fetchRecommended = async () => {
// //       try {
// //         const response = await getGroupRecommendedMovies(token, groupId);
// //         setGroupRecommend(response.results);
// //         setGroupRecommendCopyData(response.results);
// //       } catch (err) {
// //         console.log("Error fetching recommendations:", err);
// //       }
// //     };
// //     fetchRecommended();
// //   }, [groupId]);

// //   // Search handler with debounce
// //   const debouncedSearch = useMemo(
// //     () =>
// //       debounce((text) => {
// //         getSreachGroupMovie(token, groupId, text);
// //       }, 500),
// //     [token, groupId]
// //   );

// //   const handleCommentChange = useCallback(
// //     (text: string) => {
// //       setcomment(text);
// //       if (text.trim() === '') {
// //         setSearchResult([]);
// //         return;
// //       }
// //       debouncedSearch(text);
// //     },
// //     [debouncedSearch]
// //   );

// //   const getSreachGroupMovie = async (token: string, groupId: string, query: string) => {
// //     setIsSearchLoading(true);
// //     try {
// //       const response = await getGroupSearchMovies(token, groupId, query);
// //       setSearchResult(response || []);
// //     } catch {
// //       console.log("error in getGroupSearchMovies");
// //       setSearchResult([]);
// //     } finally {
// //       setIsSearchLoading(false);
// //     }
// //   };

// //   // Filter movies
// //   const filterGroupMovie = async (
// //     token: string,
// //     groupId: string,
// //     selectedUsers?: string[],
// //     groupValue?: number
// //   ) => {
// //     try {
// //       const response = await getFilteredGroupMovies(token, groupId, groupValue, selectedUsers);
// //       if (totalFilterApply && response.results.length > 0) {
// //         setGroupRecommend(response.results);
// //       } else {
// //         setGroupRecommend(groupRecommendCopyData);
// //       }
// //     } catch (error) {
// //       console.error("filterGroupMovie error", error);
// //       throw error;
// //     }
// //   };

// //   useEffect(() => {
// //     if (totalFilterApply.length == 0 || totalFilterApply == '') {
// //       setGroupRecommend(groupRecommendCopyData);
// //     }
// //   }, [modalVisible, totalFilterApply]);

// //   // Clear timeout on unmount
// //   useEffect(() => {
// //     return () => {
// //       if (searchTimeoutRef.current) {
// //         clearTimeout(searchTimeoutRef.current);
// //       }
// //       debouncedSearch.cancel();
// //     };
// //   }, []);

// //   // Handle preference (like/dislike)
// //   const handlePreference = async ({
// //     type,
// //     imdbId,
// //     token,
// //     groupId,
// //     setLikes,
// //     setDislikes,
// //     likes,
// //     dislikes,
// //   }) => {
// //     const isLike = type === 'like';
// //     const newState = isLike ? !likes[imdbId] : !dislikes[imdbId];
    
// //     if (isLike) {
// //       setLikes(prev => ({ ...prev, [imdbId]: newState }));
// //       setDislikes(prev => ({ ...prev, [imdbId]: false }));
// //     } else {
// //       setDislikes(prev => ({ ...prev, [imdbId]: newState }));
// //       setLikes(prev => ({ ...prev, [imdbId]: false }));
// //     }

// //     try {
// //       const responsedata = await recordGroupPreference(
// //         token,
// //         groupId,
// //         imdbId,
// //         newState ? type : isLike ? 'dislike' : 'like'
// //       );
// //       console.log('__responsedata___se__recordGroupPreference', responsedata);
// //     } catch (err) {
// //       console.error(`Failed to send ${type} preference`);
// //       // Rollback if failed
// //       if (isLike) {
// //         setLikes(prev => ({ ...prev, [imdbId]: !newState }));
// //       } else {
// //         setDislikes(prev => ({ ...prev, [imdbId]: !newState }));
// //       }
// //     }
// //   };

// //   // Watch now function
// //   const watchModalFunc = ({ imdb_id }) => {
// //     setSelectedImdbId(imdb_id);
// //     setWatchNow(true);
// //   };

// //   // Determine which movies to display
// //   const trimmedComment = comment.trim();
// //   const displayMovies = useMemo(() => {
// //     return trimmedComment !== '' ? searchResult : groupRecommend;
// //   }, [searchResult, groupRecommend, trimmedComment]);

// //   // Get current background image
// //   const activeMovieImage = useMemo(() => {
// //     const movies = trimmedComment !== '' ? searchResult : groupRecommend;
// //     return movies?.[delayedIndex]?.cover_image_url || null;
// //   }, [trimmedComment, searchResult, groupRecommend, delayedIndex]);

// //   // Scroll handler with background transition
// //   const onScroll = useMemo(
// //     () =>
// //       Animated.event(
// //         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
// //         { useNativeDriver: true }
// //       ),
// //     []
// //   );

// //   // Handle scroll end to update active index
// //   const handleScrollEnd = (event) => {
// //     const offsetX = event.nativeEvent.contentOffset.x;
// //     const index = Math.round(offsetX / ITEM_SIZE);
// //     setActiveIndex(index);
// //   };

// //   // Render movie info
// //   const renderMovieInfo = (movie: any) => {
// //     const imdbId = movie?.imdb_id;
// //     return (
// //       <>
// //         <View style={styles.thumpCard}>
// //           <TouchableOpacity
// //             onPress={() =>
// //               handlePreference({
// //                 type: "like",
// //                 imdbId,
// //                 token,
// //                 groupId,
// //                 setLikes,
// //                 setDislikes,
// //                 likes,
// //                 dislikes,
// //               })
// //             }
// //             style={[
// //               styles.thumpContainer,
// //               { backgroundColor: likes[imdbId] ? Color.green : Color.grey },
// //             ]}
// //           >
// //             <Image source={imageIndex.thumpUP} style={styles.thumpImage} />
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             onPress={() =>
// //               handlePreference({
// //                 type: "dislike",
// //                 imdbId,
// //                 token,
// //                 groupId,
// //                 setLikes,
// //                 setDislikes,
// //                 likes,
// //                 dislikes,
// //               })
// //             }
// //             style={[
// //               styles.thumpContainer,
// //               { backgroundColor: dislikes[imdbId] ? Color.red : Color.grey },
// //             ]}
// //           >
// //             <Image source={imageIndex.thumpDown} style={styles.thumpImage} />
// //           </TouchableOpacity>
// //         </View>

// //         <Text numberOfLines={2} style={styles.title}>
// //           {movie?.title}
// //         </Text>

// //         <CustomText
// //           size={12}
// //           color={Color.lightGrayText}
// //           style={{ textAlign: "center", marginVertical: 6 }}
// //           font={font.PoppinsRegular}
// //         >
// //           {movie?.release_year} • {convertRuntime(movie?.runtime)} •{" "}
// //           {movie?.genres?.join(", ")}
// //         </CustomText>

// //         <DescriptionWithReadMore
// //           description={movie?.description}
// //           wordNo={70}
// //           descriptionStyle={{ textAlign: "center" }}
// //           viewmoreStyle={{ textAlign: "center" }}
// //         />

// //         <TouchableOpacity
// //           style={styles.watchNowContainer}
// //           onPress={() => watchModalFunc({ imdb_id: imdbId })}
// //         >
// //           <Image source={imageIndex.puased} style={styles.watchNowImg} />
// //           <CustomText size={14} color={Color.whiteText} font={font.PoppinsBold}>
// //             Watch Now
// //           </CustomText>
// //         </TouchableOpacity>
// //       </>
// //     );
// //   };

// //   // Movie cards with animations
// //   const movieCard = useMemo(() => {
// //     return displayMovies?.map((movie, index) => {
// //       const inputRange = [
// //         (index - 1) * ITEM_SIZE,
// //         index * ITEM_SIZE,
// //         (index + 1) * ITEM_SIZE,
// //       ];

// //       const scale = scrollX.interpolate({
// //         inputRange,
// //         outputRange: [1, 1.12, 1],
// //         extrapolate: "clamp",
// //       });

// //       const infoOpacity = scrollX.interpolate({
// //         inputRange,
// //         outputRange: [0, 1, 0],
// //         extrapolate: "clamp",
// //       });

// //       const translateY = scrollX.interpolate({
// //         inputRange,
// //         outputRange: [20, 0, 20],
// //         extrapolate: "clamp",
// //       });

// //       return (
// //         <Animated.View
// //           key={movie?.imdb_id || index}
// //           style={[styles.cardContainer, { transform: [{ scale }] }]}
// //         >
// //           <FastImage
// //             source={{
// //               uri: movie?.cover_image_url,
// //               priority: FastImage.priority.high,
// //               cache: FastImage.cacheControl.immutable,
// //             }}
// //             style={styles.poster}
// //             resizeMode={FastImage.resizeMode.cover}
// //           />

// //           <Animated.View
// //             style={[
// //               styles.movieInfo,
// //               {
// //                 opacity: infoOpacity,
// //                 transform: [{ translateY }],
// //               },
// //             ]}
// //           >
// //             {renderMovieInfo(movie)}
// //           </Animated.View>
// //         </Animated.View>
// //       );
// //     });
// //   }, [displayMovies, likes, dislikes]);

// //   return (
// //     <KeyboardAvoidingView
// //       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //       style={{ flex: 1, backgroundColor: "black" }}
// //     >

      
// //       {/* Background Image without blinking */}
// //       <BackgroundImage imageUri={activeMovieImage} />

// //       <SafeAreaView style={[styles.mincontainer, { flex: 1 }]}>
// //         <CustomStatusBar translucent={true} />

// //         {/* Header */}
// //         <View style={styles.header}>
// //           <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Image source={imageIndex.backArrow} style={styles.backArrow} />
// //             </TouchableOpacity>
// //             <CustomText
// //               size={16}
// //               color={Color.whiteText}
// //               style={styles.groupTitle}
// //               font={font.PoppinsBold}
// //               numberOfLines={1}
// //             >
// //               {group_name ?? 'Group Name'}
// //             </CustomText>
// //           </View>

// //           <View style={{ flexDirection: "row" }}>
// //             <TouchableOpacity onPress={() => setNotificationModal(true)}>
// //               <Image source={imageIndex.normalNotification} style={styles.notificationIcon} />
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={() => setGroupSettingModal(true)}>
// //               <Image source={imageIndex.menu} style={styles.menuIcon} />
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* Group Members */}
// //         <View>
// //           <TouchableOpacity
// //             onPress={() => setGroupMember(true)}
// //             style={styles.membersContainer}
// //           >
// //             {type === 'createGroup'
// //               ? group.members?.slice(0, 3).map((user, index) => (
// //                   <FastImage
// //                     key={index}
// //                     style={styles.memberAvatar}
// //                     source={{
// //                       uri: `${BASE_IMAGE_URL}${user.avatar}`,
// //                       priority: FastImage.priority.low,
// //                       cache: FastImage.cacheControl.immutable,
// //                     }}
// //                   />
// //                 ))
// //               : group.members?.slice(0, 3).map((user, index) => (
// //                   <FastImage
// //                     key={index}
// //                     style={styles.memberAvatar}
// //                     source={{
// //                       uri: `${BASE_IMAGE_URL}${user.avatar}`,
// //                       priority: FastImage.priority.low,
// //                       cache: FastImage.cacheControl.immutable,
// //                     }}
// //                   />
// //                 ))}

// //             <CustomText
// //               size={12}
// //               color={Color.whiteText}
// //               style={{ marginLeft: 10 }}
// //               font={font.PoppinsRegular}
// //               numberOfLines={1}
// //             >
// //               {type === 'createGroup'
// //                 ? group?.members[0]?.username || 'Unnamed'
// //                 : group.members[0]?.username?.trim() || 'Unnamed'}
// //             </CustomText>
// //             {group.members.length > 1 && (
// //               <CustomText
// //                 size={12}
// //                 color={Color.whiteText}
// //                 style={{ marginLeft: 2 }}
// //                 font={font.PoppinsRegular}
// //                 numberOfLines={1}
// //               >
// //                 {`and ${group.members.length - 1} members`}
// //               </CustomText>
// //             )}
// //           </TouchableOpacity>
// //         </View>

// //         {/* Search and Filter */}
// //         <View style={styles.searchFilterContainer}>
// //           <View style={styles.searchContainer}>
// //             <Image source={imageIndex.search} style={styles.searchImg} />
// //             <TextInput
// //               allowFontScaling={false}
// //               placeholder="Search movies, shows..."
// //               placeholderTextColor="white"
// //               style={styles.input}
// //               onChangeText={handleCommentChange}
// //               value={comment}
// //               onFocus={() => setIsFocused(true)}
// //               onBlur={() => setIsFocused(false)}
// //             />
// //             {comment.length > 0 && (
// //               <TouchableOpacity onPress={() => {
// //                 setcomment('');
// //                 setSearchResult([]);
// //               }}>
// //                 <Image source={imageIndex.closeimg} style={styles.closingImg} />
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           <TouchableOpacity onPress={() => setModalVisible(true)}>
// //             <Image
// //               source={imageIndex.filterImg}
// //               style={[
// //                 styles.filterIcon,
// //                 totalFilterApply > 0 && { tintColor: Color.primary }
// //               ]}
// //             />
// //             {totalFilterApply > 0 && (
// //               <CustomText
// //                 size={10}
// //                 color={Color.whiteText}
// //                 style={styles.filterBadge}
// //                 font={font.PoppinsMedium}
// //               >
// //                 {totalFilterApply}
// //               </CustomText>
// //             )}
// //           </TouchableOpacity>
// //         </View>

// //         {/* Movie Cards */}
// //         {groupRecommend?.length === 0? (
// //           <View style={styles.loadingContainer}>
// //             <ActivityIndicator size="large" color={Color.primary} />
// //           </View>
     
// //         ) : (
// //           <Animated.ScrollView 
         
// //             ref={scrollViewRef}
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             snapToInterval={ITEM_WIDTH + SPACING}
// //             pagingEnabled
// //             decelerationRate={0.8}
// //             contentContainerStyle={{
// //               paddingHorizontal: (width - ITEM_WIDTH) / 2.1,
// //               alignItems: "center",
// //               height: height * 0.38,
// //              }}
// //             onScroll={onScroll}
// //             onMomentumScrollEnd={handleScrollEnd}
// //             scrollEventThrottle={16}
// //           >
// //             {movieCard}
// //           </Animated.ScrollView>
// //         )}

// //         {/* Modals */}
// //         {InfoModal && (
// //           <MovieInfoModal
// //             visible={InfoModal}
// //             onClose={() => setInfoModal(false)}
// //             title={displayMovies[activeIndex]?.title || "Movie Title"}
// //             synopsis={displayMovies[activeIndex]?.description || "Movie Description"}
// //             releaseDate={displayMovies[activeIndex]?.release_date || "Unknown"}
// //             genre={(displayMovies[activeIndex]?.genres || []).join(', ')}
// //             groupMembers={group.members}
// //           />
// //         )}

// //         {watchNow && (
// //           <WatchNowModal
// //             visible={watchNow}
// //             token={token}
// //             watchNow={watchNow}
// //             selectedImdbId={selectedImdbId}
// //             watchModalLoad={watchModalLoad}
// //             setWatchModalLoad={setWatchModalLoad}
// //             onClose={() => setWatchNow(false)}
// //           />
// //         )}

// //         {thinkModal && (
// //           <FriendthinkModal
// //             headaing={"Details"}
// //             visible={thinkModal}
// //             ranking_react={scoreMovieRank}
// //             onClose={() => setthinkModal(false)}
// //             reviews={recommgroupMemebrsScore}
// //             groupActivity={groupActivity}
// //             type="react"
// //           />
// //         )}

// //         {groupMember && (
// //           <GroupMembersModal
// //             visible={groupMember}
// //             groupMembers={group.members}
// //             onClose={() => setGroupMember(false)}
// //             token={token}
// //             heading={"Group Members"}
// //           />
// //         )}

// //         {groupSettingModal && (
// //           <GroupSettingModal
// //             visible={groupSettingModal}
// //             group={group}
// //             groupId={groupId}
// //             token={token}
// //             group_name={group_name}
// //             setGroup_name={setGroup_name}
// //             onClose={() => setGroupSettingModal(false)}
// //           />
// //         )}

// //         {modalVisible && (
// //           <GroupMovieModal
// //             visible={modalVisible}
// //             group={group}
// //             groupId={groupId}
// //             token={token}
// //             filterFunc={(selectedUsers, groupValue) =>
// //               filterGroupMovie(token, groupId, selectedUsers, groupValue)
// //             }
// //             onClose={() => setModalVisible(false)}
// //             setTotalFilterApply={setTotalFilterApply}
// //             groupTotalMember={group.members.length}
// //           />
// //         )}
// //       </SafeAreaView>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   // Container styles
// //   mincontainer: {
// //     flex: 1,
// //   },
// //   bg: {
// //     backgroundColor: Color.background,
// //     flex: 1,
// //   },

// //   // Header styles
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginHorizontal: 15,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   backArrow: {
// //     height: 24,
// //     width: 24,
// //     marginRight: 12,
// //   },
// //   groupTitle: {
// //     width: '75%',
// //     textAlign: 'center',
// //   },
// //   notificationIcon: {
// //     height: 22,
// //     width: 22,
// //     marginRight: 12,
// //   },
// //   menuIcon: {
// //     height: 22,
// //     width: 22,
// //   },

// //   // Members styles
// //   membersContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 10,
// //     justifyContent: 'center',
// //   },
// //   memberAvatar: {
// //     height: 18,
// //     width: 18,
// //     borderRadius: 20,
// //     marginRight: -4,
// //   },

// //   // Search and Filter styles
// //   searchFilterContainer: {
// //     flexDirection: "row",
// //     marginHorizontal: 20,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 15,
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     width: '90%',
// //     borderRadius: 25,
// //     borderWidth: 0.5,
// //     borderColor: Color.whiteText,
// //     height: 45,
// //   },
// //   input: {
// //     paddingHorizontal: 5,
// //     flex: 1,
// //     color: Color.whiteText,
// //     paddingVertical: 0,
// //     fontSize: 14,
// //     fontFamily: font.PoppinsRegular,
// //     includeFontPadding: false,
// //   },
// //   searchImg: {
// //     height: 20,
// //     width: 20,
// //     resizeMode: 'contain',
// //   },
// //   closingImg: {
// //     height: 16,
// //     width: 16,
// //     resizeMode: 'contain',
// //     tintColor: Color.whiteText,
// //   },
// //   filterIcon: {
// //     height: 24,
// //     width: 24,
// //     marginLeft: 8,
// //     resizeMode: "contain",
// //   },
// //   filterBadge: {
// //     position: 'absolute',
// //     top: -5,
// //     right: -5,
// //     backgroundColor: Color.primary,
// //     borderRadius: 10,
// //     width: 18,
// //     height: 18,
// //     textAlign: 'center',
// //     lineHeight: 18,
// //   },

// //   // Movie cards styles
// //   scrollViewContent: {
// //     paddingHorizontal: (width - ITEM_WIDTH) / 2.1,
// //     alignItems: "center",
// //     height: height * 0.6,
// //     paddingTop: 20,
// //   },
// //   cardContainer: {
// //     width: ITEM_WIDTH,
// //     marginHorizontal: SPACING / 2,
// //     position: 'relative',
// //     height: ITEM_WIDTH * 1.5,
// //   },
// //   poster: {
// //     width: '88%',
// //     height: ITEM_WIDTH * 1.2,
// //     borderRadius: 12,
// //   },
// //   movieInfo: {
// //     width: ITEM_WIDTH * 2.1,
// //     marginRight: ITEM_WIDTH / 50,
// //     alignSelf: 'center',
// //     padding: 15,
// //     borderRadius: 8,
// //     height: ITEM_WIDTH * 1.2,
// //     bottom: 30,
// //   },

// //   // Movie info styles
// //   thumpCard: {
// //     flexDirection: 'row',
// //     alignSelf: 'center',
// //   },
// //   thumpContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderRadius: 22,
// //     borderWidth: 1.2,
// //     borderColor: Color.whiteText,
// //     height: 33,
// //     width: 33,
// //     marginRight: 12,
// //     backgroundColor: Color.grey,
// //   },
// //   thumpImage: {
// //     height: 16,
// //     width: 16,
// //   },
// //   title: {
// //     textAlign: 'center',
// //     fontSize: 24,
// //     fontFamily: font.PoppinsBold,
// //     color: Color.whiteText,
// //     marginTop: 10,
// //   },
// //   watchNowContainer: {
// //     flexDirection: 'row',
// //     marginTop: 20,
// //     justifyContent: 'center',
// //     alignSelf: 'center',
// //     backgroundColor: Color.primary,
// //     height: 42,
// //     alignItems: 'center',
// //     width: width * 0.4,
// //     borderRadius: 10,
// //   },
// //   watchNowImg: {
// //     height: 14,
// //     width: 14,
// //     marginRight: 10,
// //   },

// //   // Loading and no results
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     height: height * 0.5,
// //   },
// //   noResultsContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     height: height * 0.5,
// //   },
// // });

// // export default memo(WatchWithFrind);


// import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   useWindowDimensions,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   Button,
//   ScrollView, TouchableWithoutFeedback,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import imageIndex from '../../../../assets/imageIndex';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { CustomStatusBar, FriendChat, FriendthinkModal, InviteModal, SuccessMessageCustom } from '../../../../component';
// import { Dimensions } from 'react-native';
// import Watchtogether from './Watchtogether';
// import { useNavigation } from '@react-navigation/native';
// import ScreenNameEnum from '../../../../routes/screenName.enum';
// import { Color } from '../../../../theme/color';
// import font from '../../../../theme/font';
// import GroupMovieModal from '../../../../component/modal/groupMovieModal/groupMovieModal';
// // import GroupMemberModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
// import GroupMembersModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
// import GroupSettingModal from '../../../../component/modal/WatchGroupSetting/WatchGroupSetting';
// import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
// import { getFilteredGroupMovies, getGroupRecommendedMovies, getGroupSearchMovies } from '../../../../redux/Api/GroupApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../redux/store';
// import debounce from 'lodash.debounce';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomText from '../../../../component/common/CustomText';
// import FastImage from 'react-native-fast-image';
// import Notification from '../../home/homeScreen/Notification/Notification';
// const { width, height } = Dimensions.get('window');



// const WatchWithFrind = ({ route }) => {
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [isFocused, setIsFocused] = useState(false);
//   const navigation = useNavigation()
//   // const { groupProps, type, groupId } = route.params || {};
//   const { groupProps: passedGroupProps, type, groupId } = route.params || {};


//   // console.log(passedGroupProps, "setGroud___data__herte_______")

//   const [group, setGroup] = useState(passedGroupProps)
//   const [watchTogetherGroups, setWatchTogetherGroups] = useState(passedGroupProps)
//  const [inviteModal, setInviteModal] = useState(false)
//   const [messModal, setMssModal] = useState(false)
//   const [comment, setcomment] = useState('')
//   // const [searchCencel, setSearchCencel] = useState('')
//   const [activeIndex, setActiveIndex] = useState(0)
//   const insets = useSafeAreaInsets();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [groupMember, setGroupMember] = useState(false);
//   const [notificationModal, setNotificationModal] = useState(false);
//   const [groupSettingModal, setGroupSettingModal] = useState(false);
//   const [totalFilterApply, setTotalFilterApply] = useState(0);
//   const [groupRecommend, setGroupRecommend] = useState([]);
//   const [groupRecommendCopyData, setGroupRecommendCopyData] = useState([]);
//   const [searchResult, setSearchResult] = useState([]);
//   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
//   const [isKeyboardVisible, setKeyboardVisible] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);


//   useEffect(() => {
//     const fetchStoredGroup = async () => {
//       if (!passedGroupProps) {
//         try {
//           const storedGroup = await AsyncStorage.getItem('selected_group');
//           if (storedGroup) {
//             const parsedGroup = JSON.parse(storedGroup);
//             setGroup(parsedGroup);
//             setWatchTogetherGroups(parsedGroup);
//             // Alert.alert("AsyncStorage save group data")
//           }
//         } catch (error) {
//           console.error('Failed to load group from AsyncStorage:', error);
//         }
//       }
//     };

//     fetchStoredGroup();
//   }, [passedGroupProps]);
//   // const [group_name , setGroup_name] = group?.groupName
//   const [group_name, setGroup_name] = useState(group?.groupName || '');

//   // console.log(group_name, "group_name_____group_name")

//   // `    // const {
//   //     //   thinkModal, setthinkModal
//   //     // } = useMovie();`
//   // GroupSettingModal
//   // console.log(group, "watchwithfriend___data_scfreen")
//   // console.log(groupId, "groupId_____groupId")

//   // console.log(totalFilterApply, "totalFilterApply___   -  -   ")

//   const [delayedIndex, setDelayedIndex] = useState(activeIndex);

//   // console.log(group.n , "group.members____>>>")
//   // console.log(activeIndex, "-----  activeIndex -------")
//   // console.log(group, "groupgroupgroupgroupgroup")

//   // useEffect(() => {
//   //   const keyboardDidShowListener = Keyboard.addListener(
//   //     Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//   //     () => {
//   //       setKeyboardVisible(true);
//   //     }
//   //   );
//   //   const keyboardDidHideListener = Keyboard.addListener(
//   //     Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
//   //     () => {
//   //       setKeyboardVisible(false);
//   //     }
//   //   );

//   //   return () => {
//   //     keyboardDidShowListener.remove();
//   //     keyboardDidHideListener.remove();
//   //   };
//   // }, []);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true); // ✅ OK
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false); // ✅ OK
//       }
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);



//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDelayedIndex(activeIndex);
//     }, 100); // 200ms delay
//     return () => clearTimeout(timeout); // Cleanup on unmount or re-run
//   }, [activeIndex, groupRecommend]);

//   // const activeMovieImage = useMemo(() => {
//   //   console.log(groupRecommend?.[delayedIndex]?.cover_image_url, "ojuk----.-.-.-.-.-__>__>___>__-.-->_.-Image")
//   //   return groupRecommend?.[delayedIndex]?.cover_image_url || null;
//   // }, [groupRecommend, delayedIndex]);

//   const trimmedComment = comment.trim();

//   const displayMovies = useMemo(() => {
//     return trimmedComment !== '' ? searchResult : groupRecommend;
//   }, [searchResult, groupRecommend, trimmedComment]);

//   const activeMovieImage = useMemo(() => {
//     const movies = trimmedComment !== '' ? searchResult : groupRecommend;
//     return movies?.[delayedIndex]?.cover_image_url || null;
//   }, [trimmedComment, searchResult, groupRecommend, delayedIndex]);

//   // console.log(groupRecommend, "groupRecommend________")




//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const debouncedSearch = useMemo(() =>
//     debounce((text) => {
//       getSreachGroupMovie(token, groupId, text);
//     }, 500), [token, groupId]
//   );

//   const handleCommentChange = useCallback((text: string) => {
//     setcomment(text);
//     if (text.trim() === '') {
//       setSearchResult([]);
//       return;
//     }
//     debouncedSearch(text);
//   }, [debouncedSearch]);

//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, []);
//   // console.log(group, "<- - - - - - friend group data")
//   useEffect(() => {
//     const fetchRecommended = async () => {
//       try {
//         const response = await getGroupRecommendedMovies(token, groupId)
//         setGroupRecommend(response.results)
//         setGroupRecommendCopyData(response.results)
//         // console.log( "fetchRecommended___getGroupRecommendedMovies", response.results )
//       } catch (err) {
//         console.log("Error fetching recommendations:", err);
//       }
//     };
//     fetchRecommended()
//   }, [groupId])
//   // console.log(group.members, "kakakak_____kaka")
//   // 
//   //  get group search movie api 

//   const getSreachGroupMovie = async (token: string, groupId: string, query: string) => {
//     setIsSearchLoading(true);
//     try {
//       const response = await getGroupSearchMovies(token, groupId, query)
//       // console.log(response, " ___------> getGroupSearchMovies____")
//       setSearchResult(response || [])

//     } catch {
//       console.log("error aaagya  ------> getGroupSearchMovies")
//       setSearchResult([])
//     } finally {
//       setIsSearchLoading(false);
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }
//     };
//   }, [searchTimeout]);


//   // console.log(groupRecommend, "ederfrfrt")
//   // console.log(activeMovieImage, "image_bg_PAST")

//   const filterGroupMovie = async (token: string,
//     groupId: string,
//     selectedUsers?: string[],
//     groupValue?: number

//   ) => {
//     // console.log(token, "token baba ---")
//     try {
//       const response = await getFilteredGroupMovies(token, groupId, groupValue, selectedUsers);
//       // console.log(response.results, "<------_____getFilteredGroupMovies____--->")
//       if (totalFilterApply && response.results.length > 0) {
//         setGroupRecommend(response.results)
//       } else {
//         // setLoading(true);
//         setGroupRecommend(groupRecommendCopyData)
//       }
//     } catch (error) {
//       console.error(error, "filterGroupMovie")
//       throw error
//     }

//   };
//   useEffect(() => {
//     if (totalFilterApply.length == 0 || totalFilterApply == '') {
//       setGroupRecommend(groupRecommendCopyData)
//     }
//   }, [modalVisible, totalFilterApply])


//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={{ flex: 1, backgroundColor:"black" }}
//     >
      
//       <ImageBackground
//         source={
          
//           { uri: `${activeMovieImage}` }
//         }
//         style={styles.bg}
//         blurRadius={3}
//         resizeMode="cover"
//         imageStyle={{ opacity: 0.4, backgroundColor: Color.background }}
//         onLoadStart={() => {
//           setLoading(true);
//           setError(false);
//         }}
//         onLoadEnd={() => setLoading(false)}
//         onError={() => {
//           setLoading(false);
//           setError(true);
//         }}
//       >

//         {/* Overlay with opacity */}
//         <View style={{
//           ...StyleSheet.absoluteFillObject,
//           // backgroundColor:"rgba(158, 3, 3, 0.4)",
//           // backgroundColor:'green'
//         }} />
//         {/* Your content goes here */}
//         {/* <Text>Something on top of background</Text> */}
//         <SafeAreaView style={[styles.mincontainer, { paddingBottom: isKeyboardVisible ? 0 : 0 }]}>
//           <CustomStatusBar translucent={true} />

//           <View style={styles.header}>
//             <View style={{ flexDirection: "row", alignItems: "center", flex: 1, }}>
//               <TouchableOpacity onPress={() => navigation.goBack()} >
//                 <Image source={imageIndex.backArrow} style={{ height: 24, width: 24, marginRight: 12, }} resizeMode='contain' />

//               </TouchableOpacity>
//               {/* <Text style={styles.title} numberOfLines={1} >{group_name ?? 'Group Name'}</Text> */}

//               <CustomText
//                 size={16}
//                 color={Color.whiteText}
//                 style={styles.title}
//                 font={font.PoppinsBold}
//                 numberOfLines={1}
//               >
//                 {group_name ?? 'Group Name'}
//               </CustomText>
//             </View>

//             <View style={{ flexDirection: "row", }}>
//               <TouchableOpacity onPress={() => setNotificationModal(true)}>
//                 <Image source={imageIndex.normalNotification} style={{
//                   height: 22,
//                   width: 22,
//                   right: 12
//                 }} resizeMode='contain' />

//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setGroupSettingModal(true)}>
//                 <Image source={imageIndex.menu} style={{
//                   height: 22,
//                   width: 22
//                 }} />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View>
//             <TouchableOpacity onPress={() => setGroupMember(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, justifyContent: 'center' }}>

//               {/* {group.groupuser.slice(0, 1).map((user, index) => (
//                 <Image
//                   key={index}
//                   source={user.userImage}
//                   style={{
//                     height: 18,
//                     width: 18,
//                     borderRadius: 20,
//                     marginRight: -4,
//                   }}
//                 />
//               ))} */}

//               {type === 'createGroup'
//                 ?
//                 // group.groupName?.slice(0).map((user, index) => (
//                 group.members?.slice(0).map((user, index) => (
//                   // <Image
//                   //   key={index + 1}
//                   //   source={{ uri: `${BASE_IMAGE_URL}${user.avatar}` }}
//                   //   style={{
//                   //     height: 18,
//                   //     width: 18,
//                   //     borderRadius: 20,
//                   //     marginRight: -4,
//                   //   }}
//                   // />


//                   <FastImage
//                     key={index + 1}
//                     style={{
//                       height: 18,
//                       width: 18,
//                       borderRadius: 20,
//                       marginRight: -4,
//                     }}
//                     source={{
//                       uri: `${BASE_IMAGE_URL}${user.avatar}`,
//                       priority: FastImage.priority.low,
//                       cache: FastImage.cacheControl.immutable,
//                     }}
//               resizeMode={FastImage.resizeMode.cover}
//                   />
//                 )) :

//                 group.members.slice(0).map((user, index) => (
//                   // <Image
//                   //   key={index + 1}
//                   //   source={{ uri: `${BASE_IMAGE_URL}${user.avatar}` }}
//                   //   style={{
//                   //     height: 18,
//                   //     width: 18,
//                   //     borderRadius: 20,
//                   //     marginRight: -4,
//                   //   }}
//                   // />


//                   <FastImage
//                     key={index + 1}
//                     style={{
//                       height: 18,
//                       width: 18,
//                       borderRadius: 20,
//                       marginRight: -4,
//                     }}
//                     source={{
//                       uri: `${BASE_IMAGE_URL}${user.avatar}`,
//                       priority: FastImage.priority.low,
//                       cache: FastImage.cacheControl.immutable,
//                     }}
//                   // resizeMode={FastImage.resizeMode.cover}
//                   />
//                 ))
//               }

//               {type === 'createGroup'
//                 ?
//                 // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group?.groupName?.trim() || 'Unnamed'} </Text>
//                 // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group?.members[0] || 'Unnamed'} </Text>
//                 <CustomText
//                   size={12}
//                   color={Color.whiteText}
//                   style={{ marginLeft: 10 }}
//                   font={font.PoppinsRegular}
//                   numberOfLines={1}
//                 >
//                   {group?.members[0] || 'Unnamed'}
//                 </CustomText>
//                 :
//                 // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group.members[0]?.username?.trim() || 'Unnamed'} </Text>
//                 <CustomText
//                   size={12}
//                   color={Color.whiteText}
//                   style={{ marginLeft: 10 }}
//                   font={font.PoppinsRegular}
//                   numberOfLines={1}
//                 >
//                   {group.members[0]?.username?.trim() || 'Unnamed'}
//                 </CustomText>
//               }
//               {group.members.length > 1 && (


//                 // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 2 }}>
//                 //   {`and ${group.members.length - 1} members`}
//                 // </Text>

//                 <CustomText
//                   size={12}
//                   color={Color.whiteText}
//                   style={{ marginLeft: 10 }}
//                   font={font.PoppinsRegular}
//                   numberOfLines={1}
//                 >
//                   {`and ${group.members.length - 1} members`}
//                 </CustomText>
//               )
//               }
//             </TouchableOpacity>
//           </View>











//           <View style={{ flexDirection: "row", marginHorizontal: 20, alignItems: "center",
//              justifyContent: "center", marginTop: 15, }}>
//             <View style={{
//               flexDirection: 'row',
//               alignItems: 'center',

//               backgroundColor: isFocused ? 'transparent' : 'transparent',

//               borderRadius: isFocused ? 0 : 100,
//               flex: 1,
//             }}>
//               <View style={styles.searchContainer} >
//                 <Image source={imageIndex.search} style={styles.searchImg} />
//                 <TextInput
//                   allowFontScaling={false}
//                   placeholder="Search movies, shows..."
//                   placeholderTextColor={isFocused ? 'white' : 'white'}
//                   style={styles.input}
//                   onChangeText={handleCommentChange}
//                   value={comment}
//                   onFocus={() => setIsFocused(true)}
//                   onBlur={() => setIsFocused(false)}
//                 />
//                 <TouchableOpacity onPress={() => {
//                   setcomment('');
//                   setSearchResult([]);
//                 }} >
//                   <Image source={imageIndex.closeimg} style={styles.closingImg}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <TouchableOpacity onPress={() => setModalVisible(true)}  >
//               {totalFilterApply === 0 ? (
//                 <Image source={imageIndex.filterImg} style={{
//                   height: 24,
//                   width: 24,
//                   resizeMode: "contain",
//                   // right: 8
//                 }} />
//               ) : (
//                 <Image source={imageIndex.filterImg} style={{
//                   height: 24,
//                   width: 24,
//                   marginLeft: 8,
//                   resizeMode: "contain",

//                   tintColor: Color.primary
//                 }} />
//               )}

//             </TouchableOpacity>
//             {totalFilterApply !== 0 && totalFilterApply != null && (
//   <CustomText
//     size={12}
//     color={Color.whiteText}
//     style={styles.totalFilterApply}
//     font={font.PoppinsMedium}
//     numberOfLines={1}
//   >
//     {String(totalFilterApply)}
//   </CustomText>
// )}
//           </View>


//           {(searchResult.length === 0 && comment.trim() !== '' && isSearchLoading) ? (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//               {/* <Text style={{ color: 'white' }}>Searching...</Text> */}
//               <CustomText
//                 size={14}
//                 color={Color.whiteText}
//                 style={{}}
//                 font={font.PoppinsMedium}
//                 numberOfLines={1}
//               >
//                 Searching...
//               </CustomText>
//             </View>
//           ) :

//             (
//               <Watchtogether
//                 loading={loading}
                
//                 token={token}
//                 groupId={groupId}
//                 groupMembers={group.members}
//                 groupRecommend={displayMovies}
//                 // groupRecommend={searchResult.length > 0 ? searchResult : groupRecommend}
//                 setActiveIndex={setActiveIndex}
//                 activeIndex={activeIndex}
//               />
//             )}

      
       

//           {groupMember &&
//             <GroupMembersModal visible={groupMember}
//               groupMembers={group.members}
//               onClose={() => setGroupMember(false)}
//               token={token}
//               heading={"Group Members"} />
//           }

//           {groupSettingModal &&
//             <GroupSettingModal
//               visible={groupSettingModal}
//               group={group}
//               groupId={groupId}
//               token={token}
//               group_name={group_name}
//               setGroup_name={setGroup_name}
//               onClose={() => setGroupSettingModal(false)}


//             />
//           }

//           {modalVisible &&
//             <GroupMovieModal
//               visible={modalVisible}
//               group={group}
//               groupId={groupId}
//               token={token}
//               // func={filterGroupMovie(selectedUsers, groupValue)}
//               filterFunc={(selectedUsers, groupValue) => filterGroupMovie(token, groupId, selectedUsers, groupValue)}
//               onClose={() => setModalVisible(false)}
//               setTotalFilterApply={setTotalFilterApply}
//               groupTotalMember={group.members.length}
//             />
//           }
//           <Notification
//             visible={notificationModal}
//             onClose={() => setNotificationModal(false)}
//             bgColor={true}
//           />
//           {/* <FriendthinkModal
//             headaing={"Group Setting"}
//             visible={thinkModal}
//             onClose={() => setthinkModal(false)}
//             reviews={movieReact}
//             type="react"
//           /> */}
//       {/* <InviteModal
//             onClose={() => setInviteModal(false)}
//             visible={inviteModal} />   */}

//           {/* {true && <SuccessMessageCustom
//         first={false}
//         titie={"Invite Sent!"}
//         message="You’ve invited your friends to watch a movie together! Now, just wait for them to accept your invitation." />} */}
//           {/* <Deatiesmodal visible={messModal} onClose={() => setMssModal(false)} /> */}
//           {/* </ScrollView> */}
//         </SafeAreaView>
//       </ImageBackground>
//       {/* </View> */}
//     </KeyboardAvoidingView>
//   );
// };

// export default memo(WatchWithFrind);

// const styles = StyleSheet.create({

//   mincontainer: {
//     flex: 1,
//     // paddingBottom: insets.bottom + 25, // Adds some extra space above safe area
//     // backgroundColor: 'red',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//     alignItems: 'center',
//     // marginTop: 8
//   },
//   // title: {
//   //   color: Color.whiteText,
//   //   fontSize: 22,
//   //   fontWeight: 'bold',
//   // },
//   icons: {
//     flexDirection: 'row',
//   },
//   avatars: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     justifyContent: 'center'
//   },
//   invite: {
//     marginRight: 8,
//     marginTop: 12,
//     width: 75,
//     alignItems: 'center'
//   },
//   avatarText: {
//     color: 'rgba(255, 255, 255, 1)',
//     fontSize: 11,
//     marginTop: 9,
//     fontWeight: "400",
//     textAlign: "center",
//   },
//   avatarImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 60,
//   },
//   subHeading: {
//     color: '#ccc',
//     marginBottom: 10,
//     fontWeight: "700",
//     fontSize: 16,
//     textAlign: "center"
//   },
//   card: {
//     width: 140,
//     marginRight: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   movieImage: {
//     width: 164,
//     height: 246,
//   },
//   recsBadge: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//     alignItems: 'center',
//   },
//   recsScore: {
//     color: Color.whiteText,
//     fontWeight: 'bold',
//   },
//   title: {

//     width: '75%',
//     textAlign: 'center',
//     marginHorizontal: 'auto',
   
//   },

//   recsText: {
//     color: Color.whiteText,
//     fontSize: 10,
//   },
//   commentBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#222',
//     margin: 16,
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     flex: 1
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     width: '95%',
//     borderRadius: 25,
//     borderWidth: 0.5,
//     borderColor: Color.whiteText,
//     height: 45,
//   },
//   input: {
//     // height: 45,
//     paddingHorizontal: 5,
//     flex: 1,
//     color: Color.whiteText,
//     paddingVertical: 0,
//     fontSize: 14,
//     fontFamily: font.PoppinsRegular,
//      includeFontPadding: false,
//   },
//   searchImg: {
//     height: 20,
//     width: 20,
//     resizeMode: 'contain',
//   },
//   closingImg: {
//     height: 16,
//     width: 16,
//     resizeMode: 'contain',
//     tintColor: Color.whiteText,
//   },
//   totalFilterApply: {
//     marginTop: 12,
//     right: 4,
//   },
//   bg: {
//     backgroundColor: Color.background,
//     flex: 1,
//   },

// });




import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import FastImage from 'react-native-fast-image';

import imageIndex from '../../../../assets/imageIndex';
import { Color } from '../../../../theme/color';
import font from '../../../../theme/font';
import useMovie from '../../discover/movieDetail/useMovie';
import {
  FriendthinkModal,
  MovieInfoModal,
  CustomStatusBar,
 
} from '../../../../component';
import WatchNowModal from '../../../../component/modal/WatchNowModal/WatchNowModal';
import { DescriptionWithReadMore } from '../../../../component/common/DescriptionWithReadMore/DescriptionWithReadMore';
import CustomText from '../../../../component/common/CustomText';
import { convertRuntime } from '../../../../component/convertRuntime/ConvertRuntime';
import {
  getGroupActivitiesAction,
   recordGroupPreference,
  getFilteredGroupMovies,
  getGroupRecommendedMovies,
  getGroupSearchMovies,
   getGroupMembers,
} from '../../../../redux/Api/GroupApi';
import { RootState } from '../../../../redux/store';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import GroupMovieModal from '../../../../component/modal/groupMovieModal/groupMovieModal';
import GroupMembersModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
import GroupSettingModal from '../../../../component/modal/WatchGroupSetting/WatchGroupSetting';
import Notification from '../../home/homeScreen/Notification/Notification';
  const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4;
const SPACING = 20;
const ITEM_SIZE = ITEM_WIDTH + SPACING;


// Custom Background Component - NO DELAY
const BackgroundImage = memo(({ imageUri }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const [currentImage, setCurrentImage] = useState(imageUri);
  const [prevImage, setPrevImage] = useState(null);

  useEffect(() => {
    if (imageUri && imageUri !== currentImage) {
      // Immediately update current image
      setPrevImage(currentImage);
      setCurrentImage(imageUri);
      
      // Clear previous image after a very short time
      const timer = setTimeout(() => {
        setPrevImage(null);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [imageUri, currentImage]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Previous image fading out */}
      {prevImage && (
        <Animated.View style={StyleSheet.absoluteFill}>
          <FastImage
            source={{ uri: prevImage }}
            style={StyleSheet.absoluteFill}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
        </Animated.View>
      )}
      
      {/* Current image */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        {currentImage ? (
          <FastImage
            source={{
              uri: currentImage,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={StyleSheet.absoluteFill}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Color.background }]} />
        )}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
      </Animated.View>
    </View>
  );
});

// Main Component
const WatchWithFrind = () => {
  const route = useRoute()
  const token = useSelector((state: RootState) => state.auth.token);
  const navigation = useNavigation();
  const { groupProps: passedGroupProps, type, groupId } = route.params || {};
  const [group, setGroup] = useState(passedGroupProps);
  const [group1, setgroup1] = useState();
  const fetchGroups = async () => {
     try {
      const groupsRes = await getGroupMembers(token,groupId);
      console.log("_____getGroupMembers____",groupsRes);
      setgroup1(groupsRes); // ✅ state me set karo
    } catch (error) {
      console.error("❌ Error fetching group details:", error);
    }
  };
  
  const [watchTogetherGroups, setWatchTogetherGroups] = useState(passedGroupProps);
   const [comment, setcomment] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupMember, setGroupMember] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [groupSettingModal, setGroupSettingModal] = useState(false);
  const [totalFilterApply, setTotalFilterApply] = useState(0);
  const [groupRecommend, setGroupRecommend] = useState([]);
  const [groupRecommendCopyData, setGroupRecommendCopyData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [watchNow, setWatchNow] = useState(false);
  const [selectedImdbId, setSelectedImdbId] = useState(null);
  const [watchModalLoad, setWatchModalLoad] = useState(null);
  const [groupActivity, setGroupActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [recommgroupMemebrsScore, setRecommgroupMemebrsScore] = useState([]);
  const [scoreMovieRank, setScoreMovieRank] = useState('');
  const [delayActionPreference, setDelayActionPreference] = useState(false);
  const [group_name, setGroup_name] = useState(group?.groupName || '');

  // Refs
  const scrollX = useRef(new Animated.Value(0)).current;
  const groupActivityRef = useRef([]);
  const searchTimeoutRef = useRef(null);
  const scrollViewRef = useRef(null);
  const scrollOffsetRef = useRef(0);

  // Modals
  const { setInfoModal, InfoModal, thinkModal, setthinkModal } = useMovie();
useEffect(() => {
     fetchGroups();
 
}, [groupMember]); // 👈 modal open hone par trigger
  // Preload images function
  const preloadImages = useCallback((images) => {
    if (!images || images?.length === 0) return;
    
    const uris = images
      .filter(movie => movie?.cover_image_url)
      .map(movie => ({ uri: movie?.cover_image_url }));
    
    if (uris.length > 0) {
      FastImage.preload(uris);
    }
  }, []);

   useEffect(() => {
    const fetchStoredGroup = async () => {
      if (!passedGroupProps) {
        try {
          const storedGroup = await AsyncStorage.getItem('selected_group');
          if (storedGroup) {
            const parsedGroup = JSON.parse(storedGroup);
            setGroup(parsedGroup);
            setWatchTogetherGroups(parsedGroup);
          }
        } catch (error) {
          console.error('Failed to load group from AsyncStorage:', error);
        }
      }
    };
    fetchStoredGroup();
  }, [passedGroupProps]);

   useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

   useEffect(() => {
    if (groupRecommend?.length > 0) {
      preloadImages(groupRecommend);
    }
  }, [groupRecommend, preloadImages]);

  // Preload images when searchResult changes
  useEffect(() => {
    if (searchResult.length > 0) {
      preloadImages(searchResult);
    }
  }, [searchResult, preloadImages]);

  // Preload adjacent images when activeIndex changes
  useEffect(() => {
    const movies = comment.trim() !== '' ? searchResult : groupRecommend;
    if (movies?.length === 0) return;

    const imagesToPreload = [];
  
    const current = movies[activeIndex];
    if (current?.cover_image_url) {
      imagesToPreload.push({ uri: current.cover_image_url });
    }
    
    // Preload next 2 images
    for (let i = 1; i <= 2; i++) {
      const nextIndex = activeIndex + i;
      if (nextIndex < movies.length && movies[nextIndex]?.cover_image_url) {
        imagesToPreload.push({ uri: movies[nextIndex].cover_image_url });
      }
    }
    
    if (imagesToPreload.length > 0) {
      FastImage.preload(imagesToPreload);
    }
  }, [activeIndex, groupRecommend, searchResult, comment]);
 
  useEffect(() => {
       fetchGroups();
 
     
  }, [notificationModal]);
  // Fetch group activities
  useEffect(() => {
    const fetchGrouchActivities = async () => {
      const response = await getGroupActivitiesAction(token, groupId);
      if (response?.results?.length > 0) {
        response.results.forEach(item => {
          const imdbId = item.movie?.imdb_id;
          if (item?.preference === "like") {
            setLikes(prev => ({ ...prev, [imdbId]: true }));
          } else if (item.preference === "dislike") {
            setDislikes(prev => ({ ...prev, [imdbId]: true }));
          }
        });
      }
    };
    fetchGrouchActivities();
  }, [token]);

  // Fetch group activities for active movie
  useEffect(() => {
    const fetchActivity = async () => {
      setLoadingActivity(true);
      const result = await getGroupActivitiesAction(
        token,
        groupId,
        groupRecommend[activeIndex]?.imdb_id
      );
      setGroupActivity(result?.results);
      groupActivityRef.current = result?.results;
      setLoadingActivity(false);
    };
    if (groupRecommend.length > 0) {
      fetchActivity();
    }
  }, [token, delayActionPreference, activeIndex]);
  
  useEffect(() => {
       fetchGroups();
 
     
  }, [notificationModal]);
  // Trigger preference update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayActionPreference(prev => !prev);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Fetch recommended movies
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await getGroupRecommendedMovies(token, groupId);
        setGroupRecommend(response.results);
        setGroupRecommendCopyData(response.results);
      } catch (err) {
        console.log("Error fetching recommendations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [groupId]);

  // Search handler with debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((text) => {
        getSreachGroupMovie(token, groupId, text);
      }, 500),
    [token, groupId]
  );

  const handleCommentChange = useCallback(
    (text: string) => {
      setcomment(text);
      if (text.trim() === '') {
        setSearchResult([]);
        setActiveIndex(0);
        return;
      }
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const getSreachGroupMovie = async (token: string, groupId: string, query: string) => {
    setIsSearchLoading(true);
    try {
      const response = await getGroupSearchMovies(token, groupId, query);
      setSearchResult(response || []);
      setActiveIndex(0);
    } catch {
      console.log("error in getGroupSearchMovies");
      setSearchResult([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Filter movies
  const filterGroupMovie = async (
    token: string,
    groupId: string,
    selectedUsers?: string[],
    groupValue?: number
  ) => {
    try {
      const response = await getFilteredGroupMovies(token, groupId, groupValue, selectedUsers);
      if (totalFilterApply && response.results.length > 0) {
        setGroupRecommend(response.results);
        setActiveIndex(0);
      } else {
        setGroupRecommend(groupRecommendCopyData);
        setActiveIndex(0);
      }
    } catch (error) {
      console.error("filterGroupMovie error", error);
      throw error;
    }
  };

  useEffect(() => {
    if (totalFilterApply.length == 0 || totalFilterApply == '') {
      setGroupRecommend(groupRecommendCopyData);
      setActiveIndex(0);
    }
  }, [modalVisible, totalFilterApply]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      debouncedSearch.cancel();
    };
  }, []);

 const handlePreference = async ({
  type,
  imdbId,
  token,
  groupId,
  setLikes,
  setDislikes,
  likes,
  dislikes,
}) => {
  if (!imdbId) return;

  const isLike = type === "like";

  // 🔹 Previous state save (rollback ke liye)
  const prevLike = !!likes[imdbId];
  const prevDislike = !!dislikes[imdbId];

  // 🔹 New toggle state
  const newLikeState = isLike ? !prevLike : false;
  const newDislikeState = !isLike ? !prevDislike : false;

  // 🚀 OPTIMISTIC UI UPDATE (instant)
  setLikes(prev => ({
    ...prev,
    [imdbId]: newLikeState,
  }));

  setDislikes(prev => ({
    ...prev,
    [imdbId]: newDislikeState,
  }));

  // 🔹 Decide API action
  let apiAction = null;

  if (isLike) {
    apiAction = newLikeState ? "like" : "unlike";
  } else {
    apiAction = newDislikeState ? "dislike" : "undislike";
  }

  try {
    await recordGroupPreference(
      token,
      groupId,
      imdbId,
      apiAction
    );
  } catch (error) {
    console.error("Preference API failed:", error);

    // 🔁 ROLLBACK on failure
    setLikes(prev => ({
      ...prev,
      [imdbId]: prevLike,
    }));

    setDislikes(prev => ({
      ...prev,
      [imdbId]: prevDislike,
    }));
  }
};

  // Watch now function
  const watchModalFunc = ({ imdb_id }) => {
    setSelectedImdbId(imdb_id);
    setWatchNow(true);
  };

  // Determine which movies to display
  const trimmedComment = comment.trim();
  const displayMovies = useMemo(() => {
    return trimmedComment !== '' ? searchResult : groupRecommend;
  }, [searchResult, groupRecommend, trimmedComment]);

  // Get current background image - NO DELAY
  const activeMovieImage = useMemo(() => {
    const movies = displayMovies;
    return movies?.[activeIndex]?.cover_image_url || null;
  }, [displayMovies, activeIndex]);

  // Scroll handler with background transition
  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { 
          useNativeDriver: true,
          listener: (event) => {
            // Track scroll offset for immediate background update
            const offsetX = event?.nativeEvent?.contentOffset.x;
            scrollOffsetRef.current = offsetX;
            
            // Calculate current index based on scroll position
            const calculatedIndex = Math.round(offsetX / ITEM_SIZE);
            if (calculatedIndex !== activeIndex) {
              setActiveIndex(calculatedIndex);
            }
          }
        }
      ),
    [activeIndex]
  );
 
  // Handle scroll end to update active index
  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_SIZE);
    setActiveIndex(index);
  };
    const [memberCount,setmemberCount] = useState()

  // Render movie info
  const renderMovieInfo = (movie: any) => {
    const imdbId = movie?.imdb_id;
    return (
      <>
        <View style={styles.thumpCard}>
          <TouchableOpacity
            onPress={() =>
              handlePreference({
                type: "like",
                imdbId,
                token,
                groupId,
                setLikes,
                setDislikes,
                likes,
                dislikes,
              })
            }
            style={[
              styles.thumpContainer,
              { backgroundColor: likes[imdbId] ? Color.green : Color.grey },
            ]}
          >
            <Image source={imageIndex.thumpUP} style={styles.thumpImage} />
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() =>
            handlePreference({
              type: "dislike",
              imdbId,
              token,
              groupId,
              setLikes,
              setDislikes,
              likes,
              dislikes,
            })
          }
            style={[
              styles.thumpContainer,

              { backgroundColor: dislikes[imdbId] ? Color.red : Color.grey ,
                
               },
            ]}
          >
            <Image 
             source={imageIndex.thumpDown} style={[styles.thumpImage,{
  marginTop:0.5 ,
 

             }]} />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={2} style={[styles.title,{
              bottom:20 ,
                  lineHeight:31

        }]}>
          {movie?.title}
        </Text>

     <CustomText
  size={12}
  color={Color.lightGrayText}
  style={{ 
    textAlign: "center", 
    marginVertical: 6  ,
    bottom:22 ,

  }}
  font={font.PoppinsRegular}
  numberOfLines={1}          // limits to 1 line
  ellipsizeMode="tail"       // adds "..." if text is too long
>
  {movie?.release_year} • {convertRuntime(movie?.runtime)} • {movie?.genres?.join(", ")}
</CustomText>
 <View pointerEvents="box-none" 
 style={{
      bottom:18

 }}
 >

        <DescriptionWithReadMore
          description={movie?.description} 
          wordNo={80}
        //      onViewMore={() =>
        //     setInfoModal(true)
        //   // setTimeout(() => {
        //   //               if (!isScrollView.current) {
        //   //                 setInfoModal(true);
        //   //               }
        //   //             }, 200)} 
        //  }
          descriptionStyle={{ textAlign: "center" }}
          viewmoreStyle={{ textAlign: "center" }}
        />
</View>
        {/* <TouchableOpacity
          style={styles.watchNowContainer}
          onPress={() => watchModalFunc({ imdb_id: imdbId })}
        >
          <Image source={imageIndex.puased} style={styles.watchNowImg} />
          <CustomText size={14} color={Color.whiteText} font={font.PoppinsBold}>
            Watch Now
          </CustomText>
        </TouchableOpacity> */}
        <Pressable
          // hitSlop={10}
  onPress={() => watchModalFunc({ imdb_id: imdbId })}
   style={{
        flexDirection: 'row',
     justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Color.primary,
    height: 42,
    alignItems: 'center',
    width: width * 0.4,
    borderRadius: 10, 
      marginTop: Platform.OS === 'ios' ? 5 : 30,
    // position:"relative" ,
    // top:11
   }}
>
  <Image source={imageIndex.puased} style={styles.watchNowImg} />
  <CustomText
    size={14}
    color={Color.whiteText}
    font={font.PoppinsBold}
  >
    Watch Now
  </CustomText>
</Pressable>
      </>
    );
  };
const totalMembers = memberCount ?? group1?.results?.length ?? 0;
// const remainingMembers = Math.max(totalMembers, 0);
// const remainingMembers = totalMembers;
const remainingMembers = Math.max(totalMembers - 1, 0);
   // Movie cards with animations
  const movieCard = useMemo(() => {
    return displayMovies?.map((movie, index) => {
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [1, 1.12, 1],
        extrapolate: "clamp",
      });

      const infoOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: "clamp",
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [20, 0, 20],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={movie?.imdb_id || index}
          style={[styles.cardContainer, { transform: [{ scale }] }]}
        >
          <FastImage
            source={{
              uri: movie?.cover_image_url,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[styles.poster,{
              bottom:22.5
            }]}
            resizeMode={FastImage.resizeMode.cover}
          />

          <Animated.View
            style={[
              styles.movieInfo,
              {
                opacity: infoOpacity,
                transform: [{ translateY }],
              },
            ]}
          >
            {renderMovieInfo(movie)}
          </Animated.View>
        </Animated.View>
      );
    });
  }, [displayMovies, likes, dislikes, scrollX]);
const cleanGroupName = group_name
  ?.replace(/\bnull\b/gi, '')             // remove "null"
  ?.replace(/\s{2,}/g, ' ')               // extra spaces
  ?.trim()
  ?.replace(/ ([^,]+)$/g, ' , $1');       // last word se pehle comma
const membersData =
  (group?.members?.length || 0) >= (group1?.results?.length || 0)
    ? group?.members
    : group1?.results;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      {/* Background Image - NO DELAY */}
      <BackgroundImage imageUri={activeMovieImage} />

      <SafeAreaView style={[styles.mincontainer, { flex: 1 }]}>
        <CustomStatusBar translucent={true} />

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center",  }}>
            <TouchableOpacity   onPress={() => {
    fetchGroups();      // call API
    navigation.goBack(); // navigate back
  }}>
              <Image source={imageIndex.backArrow} style={styles.backArrow} />
            </TouchableOpacity>
            <View style={[styles.backArrow,{
              marginRight:0
            }]} >
              
            </View>
          </View>
 <CustomText
              size={16}
              color={Color.whiteText}
              style={styles.groupTitle}
              font={font.PoppinsBold}
              numberOfLines={1}
            > 
           {/* {cleanGroupName} */}
              {group_name ?? 'Group Name'}
              
            </CustomText>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => 
              
              setNotificationModal(true)}>
              <Image source={imageIndex.normalNotification} style={styles.notificationIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGroupSettingModal(true)}>
              <Image source={imageIndex.menu} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Group Members */}
        <View>
          <TouchableOpacity
            onPress={() => setGroupMember(true)}
            style={[styles.membersContainer,
              {
                bottom:6
              }
            ]}
          >
            {type === 'createGroup'
              ? membersData?.slice(0, 3).map((user, index) => (
                  <FastImage
                    key={index}
                    style={styles.memberAvatar}
                    source={{
                      uri: `${BASE_IMAGE_URL}${user.avatar}`,
                      priority: FastImage.priority.low,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                ))
              : membersData?.slice(0, 3).map((user, index) => (
                  <FastImage
                    key={index}
                    style={styles.memberAvatar}
                    source={{
                      uri: `${BASE_IMAGE_URL}${user.avatar}`,
                      priority: FastImage.priority.low,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                ))}

            <CustomText
              size={12}
              color={Color.whiteText}
              style={{ marginLeft: 10 }}
              font={font.PoppinsRegular}
              numberOfLines={1}
            >
              {type === 'createGroup'
                ? group1?.results[0]?.username || 'Unnamed'
                : group1?.results[0]?.username?.trim() || 'Unnamed'}
            </CustomText>
            {/* {group1?.result?.length > 1 && (
              <CustomText
                size={12}
                color={Color.whiteText}
                style={{ marginLeft: 2 }}
                font={font.PoppinsRegular}
                numberOfLines={1}
              >
                 {`and ${
    memberCount !== undefined && memberCount !== null
      ? memberCount
      : (group1?.result?.length || 1) - 1
  } members`}
                </CustomText>
            )} */}
            {remainingMembers > 0 && (
  <CustomText
    size={12}
    color={Color.whiteText}
    style={{ marginLeft: 2, flexShrink: 1 }}
    font={font.PoppinsRegular}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {`and ${remainingMembers} ${
      remainingMembers === 1 ? 'member' : 'members'
    }`}
  </CustomText>
)}

          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={[styles.searchFilterContainer,  {
                bottom:6
              }]}>
          <View style={styles.searchContainer}>
            <Image source={imageIndex.search} style={styles.searchImg} />
            <TextInput
              allowFontScaling={false}
              placeholder="Search movies, shows..."
              placeholderTextColor="white"
              style={styles.input}
              onChangeText={handleCommentChange}
              value={comment}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {comment.length > 0 && (
              <TouchableOpacity onPress={() => {
                setcomment('');
                setSearchResult([]);
                setActiveIndex(0);
              }}>
                <Image source={imageIndex.closeimg} style={styles.closingImg} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={imageIndex.filterImg}
              style={[
                styles.filterIcon,
                totalFilterApply > 0 && { tintColor: Color.primary }
              ]}
            />
            {totalFilterApply > 0 && (
              <CustomText
                size={10}
                color={Color.whiteText}
                style={styles.filterBadge}
                font={font.PoppinsMedium}
              >
                {totalFilterApply}
              </CustomText>
            )}
          </TouchableOpacity>
        </View>

        {/* Movie Cards */}
        {loading ? (
          <View style={{
            marginTop:20
          }}>
            <ActivityIndicator size="small" color={Color.primary} />
          </View>
        ) : displayMovies?.length === 0 ? (
          <View style={styles.loadingContainer}>
            <CustomText size={16} color={Color.whiteText} font={font.PoppinsMedium}>
              No movies found
            </CustomText>
          </View>
        ) : (
          <Animated.ScrollView 
       
                        ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            pagingEnabled
            decelerationRate={0.8}
            contentContainerStyle={{
              paddingHorizontal: (width - ITEM_WIDTH) / 1.8,
              alignItems: "center",
              height: height * 0.38,
            }}
            onScroll={onScroll}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
          >
            {movieCard}
          </Animated.ScrollView>
        )}

        {/* Modals */}
        {InfoModal && (
          <MovieInfoModal
            visible={InfoModal}
            onClose={() => setInfoModal(false)}
            title={displayMovies[activeIndex]?.title || "Movie Title"}
            synopsis={displayMovies[activeIndex]?.description || "Movie Description"}
            releaseDate={displayMovies[activeIndex]?.release_date || "Unknown"}
            genre={(displayMovies[activeIndex]?.genres || []).join(', ')}
            groupMembers={group.members}
          />
        )}

        {watchNow && (
          <WatchNowModal
            visible={watchNow}
            token={token}
            watchNow={watchNow}
            selectedImdbId={selectedImdbId}
            watchModalLoad={watchModalLoad}
            setWatchModalLoad={setWatchModalLoad}
            onClose={() => setWatchNow(false)}
          />
        )}

        {thinkModal && (
          <FriendthinkModal
            headaing={"Details"}
            visible={thinkModal}
            ranking_react={scoreMovieRank}
            onClose={() => setthinkModal(false)}
            reviews={recommgroupMemebrsScore}
            groupActivity={groupActivity}
            type="react"
          />
        )}

        {/* {groupMember && (
          <WatchGroupMemberModal
            visible={groupMember}

      groupMembers={group1?.results}
            // groupMembers={group.members}
            onClose={() => setGroupMember(false)}
            token={token}
            heading={"Group Members"}
          />
        )} */}
                <GroupMembersModal visible={groupMember}
          groupMembers={membersData}
          // groupMembers={group1?.results || group?.members}
          onClose={() => setGroupMember(false)}
          token={token}
          heading={"Group Members"} />
        {/* {groupMember && (
          <GroupMembersModal
            visible={groupMember}

        // groupMembers={group1}
            groupMembers={group.members}
            onClose={() => setGroupMember(false)}
            token={token}
            heading={"Group Members"}
          />
        )} */}

        {/* {groupSettingModal && ( */}
          <GroupSettingModal
            visible={groupSettingModal}
            group={group1?.results}
            // group={group}
            groupId={groupId}
            token={token}
            group_name={group_name}
            setGroup_name={setGroup_name}
          onClose={(cc) => {
            fetchGroups()
   setmemberCount(cc);
  setGroupSettingModal(false)
}}

          />
        {/* )} */}
<Notification
            visible={notificationModal}
            onClose={() => {
        fetchGroups();          // call API
        setNotificationModal(false); // close modal
    }}
             bgColor={true}
         />
        {/* <View style={{
          bottom:120
        }}>
 
         </View> */}
           <GroupMovieModal
            visible={modalVisible}
            group={membersData}
            // group={group1?.results ||group.member}
            // group={group}
            groupId={groupId}
            token={token}
            filterFunc={(selectedUsers, groupValue) =>
              filterGroupMovie(token, groupId, selectedUsers, groupValue)
            }
            onClose={() => setModalVisible(false)}
            setTotalFilterApply={setTotalFilterApply}
            groupTotalMember={group.members.length}
          />
 
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Container styles
  mincontainer: {
    flex: 1,
  },
  bg: {
    backgroundColor: Color.background,
    flex: 1,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  backArrow: {
    height: 24,
    width: 24,
    marginRight: 12,
  },
  groupTitle: {
     textAlign: 'center',
     flex:1 ,
   },
  notificationIcon: {
    height: 22,
    width: 22,
    marginRight: 12,
  },
  menuIcon: {
    height: 22,
    
    width: 22,
  },

  // Members styles
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  memberAvatar: {
    height: 18,
    width: 18,
    borderRadius: 20,
    marginRight: -4,
  },

  // Search and Filter styles
  searchFilterContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '90%',
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Color.whiteText,
    height: 45,
  },
  input: {
    paddingHorizontal: 5,
    flex: 1,
    color: Color.whiteText,
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: font.PoppinsRegular,
    includeFontPadding: false,
  },
  searchImg: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  closingImg: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: Color.whiteText,
  },
  filterIcon: {
    height: 24,
    width: 24,
    marginLeft: 8,
    resizeMode: "contain",
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Color.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Movie cards styles
  cardContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: SPACING / 2,
    position: 'relative',
    height: ITEM_WIDTH * 1.5,
     marginLeft:4
  },
  poster: {
    width: '88%',
    height: ITEM_WIDTH * 1.2,
    borderRadius: 12,
  },
  movieInfo: {
    width: ITEM_WIDTH * 2.1,
    marginRight: ITEM_WIDTH / 50,
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    height: ITEM_WIDTH * 1.2,
    bottom: 40,
  },

  // Movie info styles
  thumpCard: {
    flexDirection: 'row',
    alignSelf: 'center',
    bottom:30
  },
  thumpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: Color.whiteText,
    height: 33,
    width: 33,
    marginRight: 12,
    backgroundColor: Color.grey,
  },
  thumpImage: {
    height: 16,
    width: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: font.PoppinsBold,
    color: Color.whiteText,
 
   },
  watchNowContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Color.primary,
    height: 42,
    alignItems: 'center',
    width: width * 0.4,
    borderRadius: 10,
  },
  watchNowImg: {
    height: 14,
    width: 14,
    marginRight: 10,
  },

  // Loading and no results
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.5,
  },
});

export default memo(WatchWithFrind);