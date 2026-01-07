import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Button,
  ScrollView, TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from 'react-native';
import imageIndex from '../../../../assets/imageIndex';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomStatusBar, FriendChat, FriendthinkModal, InviteModal, SuccessMessageCustom } from '../../../../component';
import { Dimensions } from 'react-native';
import Watchtogether from './Watchtogether';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import { Color } from '../../../../theme/color';
import font from '../../../../theme/font';
import GroupMovieModal from '../../../../component/modal/groupMovieModal/groupMovieModal';
// import GroupMemberModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
import GroupMembersModal from '../../../../component/modal/GroupMemberModal/GroupMemberModal';
import GroupSettingModal from '../../../../component/modal/WatchGroupSetting/WatchGroupSetting';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { getFilteredGroupMovies, getGroupRecommendedMovies, getGroupSearchMovies } from '../../../../redux/Api/GroupApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../../../../component/common/CustomText';
import FastImage from 'react-native-fast-image';
const { width, height } = Dimensions.get('window');



const WatchWithFrind = ({ route }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation()
  // const { groupProps, type, groupId } = route.params || {};
  const { groupProps: passedGroupProps, type, groupId } = route.params || {};


  // console.log(passedGroupProps, "setGroud___data__herte_______")

  const [group, setGroup] = useState(passedGroupProps)
  const [watchTogetherGroups, setWatchTogetherGroups] = useState(passedGroupProps)
  // const [inviteModal, setInviteModal] = useState(false)
  const [messModal, setMssModal] = useState(false)
  const [comment, setcomment] = useState('')
  // const [searchCencel, setSearchCencel] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupMember, setGroupMember] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [groupSettingModal, setGroupSettingModal] = useState(false);
  const [totalFilterApply, setTotalFilterApply] = useState(0);
  const [groupRecommend, setGroupRecommend] = useState([]);
  const [groupRecommendCopyData, setGroupRecommendCopyData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchStoredGroup = async () => {
      if (!passedGroupProps) {
        try {
          const storedGroup = await AsyncStorage.getItem('selected_group');
          if (storedGroup) {
            const parsedGroup = JSON.parse(storedGroup);
            setGroup(parsedGroup);
            setWatchTogetherGroups(parsedGroup);
            // Alert.alert("AsyncStorage save group data")
          }
        } catch (error) {
          console.error('Failed to load group from AsyncStorage:', error);
        }
      }
    };

    fetchStoredGroup();
  }, [passedGroupProps]);
  // const [group_name , setGroup_name] = group?.groupName
  const [group_name, setGroup_name] = useState(group?.groupName || '');

  // console.log(group_name, "group_name_____group_name")

  // `    // const {
  //     //   thinkModal, setthinkModal
  //     // } = useMovie();`
  // GroupSettingModal
  // console.log(group, "watchwithfriend___data_scfreen")
  // console.log(groupId, "groupId_____groupId")

  // console.log(totalFilterApply, "totalFilterApply___   -  -   ")

  const [delayedIndex, setDelayedIndex] = useState(activeIndex);

  // console.log(group.n , "group.members____>>>")
  // console.log(activeIndex, "-----  activeIndex -------")
  // console.log(group, "groupgroupgroupgroupgroup")

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
  //     () => {
  //       setKeyboardVisible(true);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
  //     () => {
  //       setKeyboardVisible(false);
  //     }
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // ✅ OK
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // ✅ OK
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedIndex(activeIndex);
    }, 100); // 200ms delay
    return () => clearTimeout(timeout); // Cleanup on unmount or re-run
  }, [activeIndex, groupRecommend]);

  // const activeMovieImage = useMemo(() => {
  //   console.log(groupRecommend?.[delayedIndex]?.cover_image_url, "ojuk----.-.-.-.-.-__>__>___>__-.-->_.-Image")
  //   return groupRecommend?.[delayedIndex]?.cover_image_url || null;
  // }, [groupRecommend, delayedIndex]);

  const trimmedComment = comment.trim();

  const displayMovies = useMemo(() => {
    return trimmedComment !== '' ? searchResult : groupRecommend;
  }, [searchResult, groupRecommend, trimmedComment]);

  const activeMovieImage = useMemo(() => {
    const movies = trimmedComment !== '' ? searchResult : groupRecommend;
    return movies?.[delayedIndex]?.cover_image_url || null;
  }, [trimmedComment, searchResult, groupRecommend, delayedIndex]);

  // console.log(groupRecommend, "groupRecommend________")




  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useMemo(() =>
    debounce((text) => {
      getSreachGroupMovie(token, groupId, text);
    }, 500), [token, groupId]
  );

  const handleCommentChange = useCallback((text: string) => {
    setcomment(text);
    if (text.trim() === '') {
      setSearchResult([]);
      return;
    }
    debouncedSearch(text);
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  // console.log(group, "<- - - - - - friend group data")
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getGroupRecommendedMovies(token, groupId)
        setGroupRecommend(response.results)
        setGroupRecommendCopyData(response.results)
        // console.log( "fetchRecommended___getGroupRecommendedMovies", response.results )
      } catch (err) {
        console.log("Error fetching recommendations:", err);
      }
    };
    fetchRecommended()
  }, [groupId])
  // console.log(group.members, "kakakak_____kaka")
  // 
  //  get group search movie api 

  const getSreachGroupMovie = async (token: string, groupId: string, query: string) => {
    setIsSearchLoading(true);
    try {
      const response = await getGroupSearchMovies(token, groupId, query)
      // console.log(response, " ___------> getGroupSearchMovies____")
      setSearchResult(response || [])

    } catch {
      console.log("error aaagya  ------> getGroupSearchMovies")
      setSearchResult([])
    } finally {
      setIsSearchLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);


  // console.log(groupRecommend, "ederfrfrt")
  // console.log(activeMovieImage, "image_bg_PAST")

  const filterGroupMovie = async (token: string,
    groupId: string,
    selectedUsers?: string[],
    groupValue?: number

  ) => {
    // console.log(token, "token baba ---")
    try {
      const response = await getFilteredGroupMovies(token, groupId, groupValue, selectedUsers);
      // console.log(response.results, "<------_____getFilteredGroupMovies____--->")
      if (totalFilterApply && response.results.length > 0) {
        setGroupRecommend(response.results)
      } else {
        // setLoading(true);
        setGroupRecommend(groupRecommendCopyData)
      }
    } catch (error) {
      console.error(error, "filterGroupMovie")
      throw error
    }

  };
  useEffect(() => {
    if (totalFilterApply.length == 0 || totalFilterApply == '') {
      setGroupRecommend(groupRecommendCopyData)
    }
  }, [modalVisible, totalFilterApply])


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor:"black" }}
    >
      
      <ImageBackground
        source={
          
          { uri: `${activeMovieImage}` }
        }
        style={styles.bg}
        blurRadius={3}
        resizeMode="cover"
        imageStyle={{ opacity: 0.4, backgroundColor: Color.background }}
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      >

        {/* Overlay with opacity */}
        <View style={{
          ...StyleSheet.absoluteFillObject,
          // backgroundColor:"rgba(158, 3, 3, 0.4)",
          // backgroundColor:'green'
        }} />
        {/* Your content goes here */}
        {/* <Text>Something on top of background</Text> */}
        <SafeAreaView style={[styles.mincontainer, { paddingBottom: isKeyboardVisible ? 0 : 0 }]}>
          <CustomStatusBar translucent={true} />

          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, }}>
              <TouchableOpacity onPress={() => navigation.goBack()} >
                <Image source={imageIndex.backArrow} style={{ height: 24, width: 24, marginRight: 12, }} resizeMode='contain' />

              </TouchableOpacity>
              {/* <Text style={styles.title} numberOfLines={1} >{group_name ?? 'Group Name'}</Text> */}

              <CustomText
                size={16}
                color={Color.whiteText}
                style={styles.title}
                font={font.PoppinsBold}
                numberOfLines={1}
              >
                {group_name ?? 'Group Name'}
              </CustomText>
            </View>

            <View style={{ flexDirection: "row", }}>
              <TouchableOpacity onPress={() => setNotificationModal(true)}>
                <Image source={imageIndex.normalNotification} style={{
                  height: 22,
                  width: 22,
                  right: 12
                }} resizeMode='contain' />

              </TouchableOpacity>
              <TouchableOpacity onPress={() => setGroupSettingModal(true)}>
                <Image source={imageIndex.menu} style={{
                  height: 22,
                  width: 22
                }} />
              </TouchableOpacity>
            </View>
          </View>









          
          <View>
            <TouchableOpacity onPress={() => setGroupMember(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, justifyContent: 'center' }}>

              {/* {group.groupuser.slice(0, 1).map((user, index) => (
                <Image
                  key={index}
                  source={user.userImage}
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 20,
                    marginRight: -4,
                  }}
                />
              ))} */}

              {type === 'createGroup'
                ?
                // group.groupName?.slice(0).map((user, index) => (
                group.members?.slice(0).map((user, index) => (
                  // <Image
                  //   key={index + 1}
                  //   source={{ uri: `${BASE_IMAGE_URL}${user.avatar}` }}
                  //   style={{
                  //     height: 18,
                  //     width: 18,
                  //     borderRadius: 20,
                  //     marginRight: -4,
                  //   }}
                  // />


                  <FastImage
                    key={index + 1}
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 20,
                      marginRight: -4,
                    }}
                    source={{
                      uri: `${BASE_IMAGE_URL}${user.avatar}`,
                      priority: FastImage.priority.low,
                      cache: FastImage.cacheControl.immutable,
                    }}
              resizeMode={FastImage.resizeMode.cover}
                  />
                )) :

                group.members.slice(0).map((user, index) => (
                  // <Image
                  //   key={index + 1}
                  //   source={{ uri: `${BASE_IMAGE_URL}${user.avatar}` }}
                  //   style={{
                  //     height: 18,
                  //     width: 18,
                  //     borderRadius: 20,
                  //     marginRight: -4,
                  //   }}
                  // />


                  <FastImage
                    key={index + 1}
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 20,
                      marginRight: -4,
                    }}
                    source={{
                      uri: `${BASE_IMAGE_URL}${user.avatar}`,
                      priority: FastImage.priority.low,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  // resizeMode={FastImage.resizeMode.cover}
                  />
                ))
              }

              {type === 'createGroup'
                ?
                // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group?.groupName?.trim() || 'Unnamed'} </Text>
                // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group?.members[0] || 'Unnamed'} </Text>
                <CustomText
                  size={12}
                  color={Color.whiteText}
                  style={{ marginLeft: 10 }}
                  font={font.PoppinsRegular}
                  numberOfLines={1}
                >
                  {group?.members[0] || 'Unnamed'}
                </CustomText>
                :
                // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 10 }}>{group.members[0]?.username?.trim() || 'Unnamed'} </Text>
                <CustomText
                  size={12}
                  color={Color.whiteText}
                  style={{ marginLeft: 10 }}
                  font={font.PoppinsRegular}
                  numberOfLines={1}
                >
                  {group.members[0]?.username?.trim() || 'Unnamed'}
                </CustomText>
              }
              {group.members.length > 1 && (


                // <Text style={{ color: Color.whiteText, fontSize: 12, marginLeft: 2 }}>
                //   {`and ${group.members.length - 1} members`}
                // </Text>

                <CustomText
                  size={12}
                  color={Color.whiteText}
                  style={{ marginLeft: 10 }}
                  font={font.PoppinsRegular}
                  numberOfLines={1}
                >
                  {`and ${group.members.length - 1} members`}
                </CustomText>
              )
              }
            </TouchableOpacity>
          </View>











          <View style={{ flexDirection: "row", marginHorizontal: 20, alignItems: "center",
             justifyContent: "center", marginTop: 15, }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',

              backgroundColor: isFocused ? 'transparent' : 'transparent',

              borderRadius: isFocused ? 0 : 100,
              flex: 1,
            }}>
              <View style={styles.searchContainer} >
                <Image source={imageIndex.search} style={styles.searchImg} />
                <TextInput
                  allowFontScaling={false}
                  placeholder="Search movies, shows..."
                  placeholderTextColor={isFocused ? 'white' : 'white'}
                  style={styles.input}
                  onChangeText={handleCommentChange}
                  value={comment}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity onPress={() => {
                  setcomment('');
                  setSearchResult([]);
                }} >
                  <Image source={imageIndex.closeimg} style={styles.closingImg}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)}  >
              {totalFilterApply === 0 ? (
                <Image source={imageIndex.filterImg} style={{
                  height: 24,
                  width: 24,
                  resizeMode: "contain",
                  // right: 8
                }} />
              ) : (
                <Image source={imageIndex.filterImg} style={{
                  height: 24,
                  width: 24,
                  marginLeft: 8,
                  resizeMode: "contain",

                  tintColor: Color.primary
                }} />
              )}

            </TouchableOpacity>
            {totalFilterApply !== 0 && totalFilterApply != null && (
  <CustomText
    size={12}
    color={Color.whiteText}
    style={styles.totalFilterApply}
    font={font.PoppinsMedium}
    numberOfLines={1}
  >
    {String(totalFilterApply)}
  </CustomText>
)}
          </View>


          {(searchResult.length === 0 && comment.trim() !== '' && isSearchLoading) ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {/* <Text style={{ color: 'white' }}>Searching...</Text> */}
              <CustomText
                size={14}
                color={Color.whiteText}
                style={{}}
                font={font.PoppinsMedium}
                numberOfLines={1}
              >
                Searching...
              </CustomText>
            </View>
          ) :

            (
              <Watchtogether
                loading={loading}
                
                token={token}
                groupId={groupId}
                groupMembers={group.members}
                groupRecommend={displayMovies}
                // groupRecommend={searchResult.length > 0 ? searchResult : groupRecommend}
                setActiveIndex={setActiveIndex}
                activeIndex={activeIndex}
              />
            )}

      
       

          {groupMember &&
            <GroupMembersModal visible={groupMember}
              groupMembers={group.members}
              onClose={() => setGroupMember(false)}
              token={token}
              heading={"Group Members"} />
          }

          {groupSettingModal &&
            <GroupSettingModal
              visible={groupSettingModal}
              group={group}
              groupId={groupId}
              token={token}
              group_name={group_name}
              setGroup_name={setGroup_name}
              onClose={() => setGroupSettingModal(false)}


            />
          }

          {modalVisible &&
            <GroupMovieModal
              visible={modalVisible}
              group={group}
              groupId={groupId}
              token={token}
              // func={filterGroupMovie(selectedUsers, groupValue)}
              filterFunc={(selectedUsers, groupValue) => filterGroupMovie(token, groupId, selectedUsers, groupValue)}
              onClose={() => setModalVisible(false)}
              setTotalFilterApply={setTotalFilterApply}
              groupTotalMember={group.members.length}
            />
          }
          {/* <Notification
            visible={notificationModal}
            onClose={() => setNotificationModal(false)}
            bgColor={true}
          /> */}
          {/* <FriendthinkModal
            headaing={"Group Setting"}
            visible={thinkModal}
            onClose={() => setthinkModal(false)}
            reviews={movieReact}
            type="react"
          /> */}
          {/* <InviteModal
            onClose={() => setInviteModal(false)}
            visible={inviteModal} /> */}

          {/* {true && <SuccessMessageCustom
        first={false}
        titie={"Invite Sent!"}
        message="You’ve invited your friends to watch a movie together! Now, just wait for them to accept your invitation." />} */}
          {/* <Deatiesmodal visible={messModal} onClose={() => setMssModal(false)} /> */}
          {/* </ScrollView> */}
        </SafeAreaView>
      </ImageBackground>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default memo(WatchWithFrind);

const styles = StyleSheet.create({

  mincontainer: {
    flex: 1,
    // paddingBottom: insets.bottom + 25, // Adds some extra space above safe area
    // backgroundColor: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    alignItems: 'center',
    // marginTop: 8
  },
  // title: {
  //   color: Color.whiteText,
  //   fontSize: 22,
  //   fontWeight: 'bold',
  // },
  icons: {
    flexDirection: 'row',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center'
  },
  invite: {
    marginRight: 8,
    marginTop: 12,
    width: 75,
    alignItems: 'center'
  },
  avatarText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 11,
    marginTop: 9,
    fontWeight: "400",
    textAlign: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  subHeading: {
    color: '#ccc',
    marginBottom: 10,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center"
  },
  card: {
    width: 140,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  movieImage: {
    width: 164,
    height: 246,
  },
  recsBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  recsScore: {
    color: Color.whiteText,
    fontWeight: 'bold',
  },
  title: {

    width: '75%',
    textAlign: 'center',
    marginHorizontal: 'auto',
   
  },

  recsText: {
    color: Color.whiteText,
    fontSize: 10,
  },
  commentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '95%',
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Color.whiteText,
    height: 45,
  },
  input: {
    // height: 45,
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
  totalFilterApply: {
    marginTop: 12,
    right: 4,
  },
  bg: {
    backgroundColor: Color.background,
    flex: 1,
  },

});
