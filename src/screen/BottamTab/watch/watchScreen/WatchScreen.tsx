import React, { useEffect, useState, useCallback, useLayoutEffect, useRef, Suspense, useMemo, memo } from 'react';
import {
  View,
  Text,
  
  Image,
  TouchableOpacity,

  TouchableNativeFeedback,
  BackHandler,
  Animated,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Color } from '../../../../theme/color';
import imageIndex from '../../../../assets/imageIndex';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CustomStatusBar } from '../../../../component';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { setMultiSelectMode, toggleMultiSelectMode } from '../../../../redux/feature/multiSelectSlice';
import CustomText from '../../../../component/common/CustomText';
import font from '../../../../theme/font';
import LogoutModal from '../../../../component/modal/logoutModal/logoutModal';
import Notification from '../../home/homeScreen/Notification/Notification';
 
import ShimmerGroupItem from '../watchScreen/ShimmerGroupItem'
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAllGroups,
  leaveGroup,
  toggleGroupNotification
} from '../../../../redux/Api/GroupApi';
import { WatchStyle } from './WatchStyle';
import { getUserProfile } from '../../../../redux/Api/authService';
import { setUserProfile } from '../../../../redux/feature/authSlice';
// 💤 Lazy load heavy components
const WatchGroupCom = React.lazy(() => import('../../../../component/common/WatchGroupCom/WatchGroupCom'));
// const Notifi cation = React.lazy(() => import('../../home/homeScreen/Notification/Notification'));
// const LogoutModal = React.lazy(() => import('../../../../component/modal/logoutModal/logoutModal'));

const WatchScreen = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const avatar = useSelector((state: RootState) => state.auth.userGetData?.avatar);
   const isMultiSelectMode = useSelector(
    (state: RootState) => state.multiSelect.isMultiSelectMode
  );
  const route:any = useRoute()
  const { getAllGroupReferace } = route?.params || {};   // first come from groupsettingmodal
   const navigation = useNavigation();
  const [notificationModal, setNotificationModal] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
   const [logoutModalVisible, setLogoutModalVisible] = useState(false);
   const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [groupSettingModal, setGroupSettingModal] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true); // optional
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const modalButtonsAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
   const enableMultiSelect = () => dispatch(setMultiSelectMode(true));
  const disableMultiSelect = () => dispatch(setMultiSelectMode(false));
 const fetchUserProfile = useCallback(async () => {
   try {
     if (token) {
        const res = await getUserProfile(token);
       console.log(res , 'user_profile_data-Save_IN_redux')
       // setUserProfileDate(res);
       dispatch(setUserProfile({ userGetData: res }));
     }
   } catch (error) {
     console.error('❌ Profile fetch error', error);
   } finally {
    }
 }, [token,   dispatch]);
 
 

   useEffect(() => {
     fetchUserProfile();
    }, []);
  const animateBottomBarIn = useCallback(() => {
    Animated.timing(bottomBarAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [bottomBarAnim]);
  const animateBottomBarOut = useCallback(() => {
    Animated.timing(bottomBarAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // setIsMultiSelectMode(false);
      disableMultiSelect()
      setSelectedGroupIds([]);
      // setMultiSelectToStorage(false);
    });
  }, [bottomBarAnim]);

  const animateModalButtonsIn = useCallback(() => {
    Animated.timing(modalButtonsAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [modalButtonsAnim]);

  // Interpolations
  const bottomBarTranslateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const modalButtonsTranslateY = modalButtonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  // Effects
  useEffect(() => {
    if (isMultiSelectMode) {
      animateBottomBarIn();
    }
  }, [isMultiSelectMode, animateBottomBarIn]);

  useEffect(() => {
    if (groupSettingModal) {
      animateModalButtonsIn();
    } else {
      modalButtonsAnim.setValue(0);
    }
  }, [groupSettingModal, animateModalButtonsIn, modalButtonsAnim]);

  // Back handler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (groupSettingModal) {
          setGroupSettingModal(false);
          return true;
        } else if (isSettingsMode) {
          setIsSettingsMode(false);
          setSelectedGroup(null);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [groupSettingModal, isSettingsMode])
  );
  // Group selection handler
  const handleGroupSelect = useCallback((group) => {
    if (isMultiSelectMode) {
      const isAlreadySelected = selectedGroupIds?.includes(group.groupId);
      setSelectedGroupIds(prev =>
        isAlreadySelected
          ? prev?.filter(id => id !== group.groupId)
          : [...prev, group.groupId]
      );
    } else {
      setSelectedGroup(group);
      setIsSettingsMode(true);
      setGroupSettingModal(true);
    }
  }, [isMultiSelectMode, selectedGroupIds]);

  // delete gourp
  const deleteSelectedGroups = useCallback((groupToDelete = null) => {
    let groupIdsToDelete = [];
 
    if (groupToDelete && groupToDelete.groupId) {
      groupIdsToDelete = [groupToDelete.groupId];
      console.log(groupToDelete.groupId, "groupToDelete.groupId")
    } else {
      console.log(selectedGroupIds, 'selectedGroupIds')
      groupIdsToDelete = [...selectedGroupIds];
    }

    if (groupIdsToDelete.length === 0) return;
 
    const hanldeleaveGroup = async (token, groupId) => {
       try {
        const response = await leaveGroup(token, groupId);
       } catch (error) {
        console.log("❌ leaveGroup error:", error);
      }
    };
    console.log(selectedGroupIds, "selectedGroupIds____selectedGroupIds")
    if (groupIdsToDelete.length == 1) {
       hanldeleaveGroup(token, groupIdsToDelete[0]);
    }
    selectedGroupIds.forEach(async (id) => {
       await hanldeleaveGroup(token, id);
    });

    // UI state update
    setGroupsData(prev => prev.filter(group => !groupIdsToDelete.includes(group.groupId)));
    setSelectedGroupIds([]);
    setSelectedGroup(null);
    // setIsMultiSelectMode(false);
    disableMultiSelect()

    navigation.navigate(ScreenNameEnum.WatchScreen, {
      getAllGroupReferace: Date.now()
    });

  }, [selectedGroupIds]);


  // Store value in AsyncStorage

  const goToSearchScreen = useCallback(() => {
    navigation.navigate(ScreenNameEnum.WoodsScreen, {
      type: 'group',
    });
  }, []);

  // inside useEffect
  // useEffect(() => {
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const groupsRes = await getAllGroups(token); // groupsRes.results = array of groups
       const enrichedGroups = await Promise.all(
        groupsRes.results.map(async (group) => {


           let activities = [];
          let members = [];
          const groupId = group?.group_id || group.username;
          const max_activities_cnt =  group.max_activities_cnt;
          const groupName = group?.name || group?.username;
          const isMuted = group?.notification
          // console.log(isMuted, "isMuted__________isMuted")
           members = group?.members;
            console.log(typeof members, "members in watch screen data  -  -")
            // activities
             activities = group?.activities;
           // try {
          //   activities = await getGroupActivities(token, groupId);
          //   console.log(activities, "activities__2 in watch screen data  -  -")
          // } catch (err) {
          //   console.warn("⚠️ Activities failed:", err.message);
          // }

          // try {
          //   const m = await getGroupMembers(token, groupId);
          //   members = m.results;
          //   console.log(typeof members, "members in watch screen data  -  -")
          //   console.log(members, "members in watch screen data  -  -")
          // } catch (err) {
          //   console.warn("⚠️ Members failed:", err.message);
          // }
          return {
            groupId,
            groupName,
            isMuted,
            members,
            activities,
            max_activities_cnt
          };
        })
      );
      const filteredGroups = enrichedGroups.filter(Boolean);

      console.log("---- fffff -rr]",filteredGroups)
      setGroupsData(filteredGroups);

      // console.log(typeof filteredGroups, " Final enrichedGroups");
     } catch (error) {
      console.error("❌ Error fetching group details:", error);
    } finally {
      setLoadingGroups(false);
    }
  };



  const handleNotification = async (token, groupId, currentStatus) => {
    const newStatus = currentStatus ? 'off' : 'on';
 
    try {
      const response = await toggleGroupNotification(token, groupId, newStatus);
      const updatedGroups = groupsData.map(group =>
        group.groupId === groupId
          ? { ...group, isMuted: !currentStatus }
          : group
      );
      setGroupsData(updatedGroups);

      //  2. selectedGroup
      setSelectedGroup(prev =>
        prev?.groupId === groupId
          ? { ...prev, isMuted: !currentStatus }
          : prev
      );
      fetchGroups()
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };

  //  when getAllGroupReferace changes
useEffect(() => {
  if (getAllGroupReferace === true) {
    fetchGroups();
  }
}, [getAllGroupReferace]);
 

useFocusEffect(
  useCallback(() => {
    fetchGroups();
    return () => {
     };
  }, []) // ❗ NO dependencies
);

 
  const renderHeaderSection = useCallback(() => {   
    return (
    <View style={WatchStyle.header}>
      <View style={WatchStyle.headerLeft}>
        <CustomText
          size={20}
          color={Color.placeHolder}
          style={[WatchStyle.logo, ]}
          font={font.PoppinsBold}
        >
          {
            "Watch Together"
          }
          {/* {isSettingsMode ? 'Groups setting testing' : 'Watch Together'} */}
        </CustomText>
      </View>

      <View style={WatchStyle.headerRight}>
        <TouchableOpacity onPress={() => setNotificationModal(true)}>
          <Image
            source={imageIndex.normalNotification}
            style={WatchStyle.notificationIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToSearchScreen}
        >
          <Image source={imageIndex.search} style={WatchStyle.searchIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
},[isSettingsMode])

  // useEffect(() => {

  //   console.log(!isMultiSelectMode, !isSettingsMode, "isMultiSelectMode__isSettingsMode__________")
  //   if (isMultiSelectMode && !isSettingsMode) {
  //     animateBottomBarOut();
  //   }
  // },[ isSettingsMode])

  const renderUserActions = useCallback(() => {
   return   (
    <View style={WatchStyle.onlineuserContainer}>
      <TouchableOpacity
      onPress={() => setIsSettingsMode(!isSettingsMode)}>

        <FastImage
          style={WatchStyle.userOnlineImg}
          source={{
            uri: `${BASE_IMAGE_URL}${avatar}`,
            priority: FastImage.priority.low,
            cache: FastImage.cacheControl.immutable,
          }}
        // resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={WatchStyle.invitBtnContianerr}
        onPress={() => navigation.navigate(ScreenNameEnum.CreateGroupScreen)}
      >
        <Image source={imageIndex.invitIcon} style={WatchStyle.invitBtnIcon} />
      </TouchableOpacity>
    </View>
  ) },[isSettingsMode]);

  const renderGroupList = useCallback(() => {
 return     (
    <View style={WatchStyle.groupsContainer}>
      <Suspense fallback={
        <View>
          {[1, 2, 3].map((i) => (
            <ShimmerGroupItem key={i} />
          ))}
        </View>

      }>

        <WatchGroupCom
          groups={groupsData}
          isSettingsMode={isSettingsMode}
          onGroupSelect={handleGroupSelect}
          isMultiSelectMode={isMultiSelectMode}
          selectedGroupIds={selectedGroupIds}
          setSelectedGroup={setSelectedGroup}
          setIsSettingsMode={setIsSettingsMode}
        />

      </Suspense>

    </View>
  ) },[groupsData]);
  
  const renderBottomBar = () => {
     return (
      <Animated.View style={[
        WatchStyle.modalButtonsContainer,
        {
          transform: [{ translateY: modalButtonsTranslateY }],
          opacity: modalButtonsAnim
        }
      ]}>
        <View style={WatchStyle.modalItemContainer}>
          <TouchableOpacity
            style={WatchStyle.modalContainer}
            onPress={() => handleNotification(token, selectedGroup.groupId, selectedGroup?.isMuted)}
          >
            <Image
              style={WatchStyle.modalImg}
              source={selectedGroup?.isMuted ? imageIndex.bellNotification : imageIndex.mutedIcon}
              tintColor={Color.whiteText}
            />

            <CustomText
              size={14}
              color={Color.whiteText}
              style={WatchStyle.modalText}
              font={font.PoppinsMedium}
            >
              {selectedGroup?.isMuted ? 'Notification On' : 'Notification Off'}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={WatchStyle.modalContainer}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Image
              style={WatchStyle.modalImg}
              source={imageIndex.delete}
              tintColor={Color.orang}
            />

            <CustomText
              size={14}
              color={Color.whiteText}
              style={[WatchStyle.modalText, { color: Color.orang, alignSelf: 'center' }]}
              font={font.PoppinsMedium}
            >
              Delete Group
            </CustomText>
          </TouchableOpacity>

          <View style={WatchStyle.modalRow} />

          <TouchableOpacity
            style={WatchStyle.modalContainer}
            onPress={() => {
              // setIsMultiSelectMode(true);
              enableMultiSelect();
              setSelectedGroup(null);
              setIsSettingsMode(false);
              // setMultiSelectToStorage(true);
            }}
          >
            <Image style={WatchStyle.modalImg} source={imageIndex.doubleCheck} />

            <CustomText
              size={14}
              color={Color.whiteText}
              style={WatchStyle.modalText}
              font={font.PoppinsMedium}
            >
              Multiple selection
            </CustomText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  };



const HeaderSection = memo(({ isSettingsMode, goToSearchScreen, setNotificationModal }) => {
    return (
    <View style={WatchStyle.header}>
      <View style={WatchStyle.headerLeft}>
        <CustomText
          size={20}
          color={Color.placeHolder}
          style={[WatchStyle.logo, ]}
          // style={[WatchStyle.logo, { color: isSettingsMode ? Color.yellow1 : Color.whiteText }]}
          font={font.PoppinsBold}
        >
          Watch Together
          {/* {isSettingsMode ? 'Groups setting testing' : 'Watch Together'} */}
        </CustomText>
      </View>

      <View style={WatchStyle.headerRight}>
        <TouchableOpacity onPress={() => setNotificationModal(true)}>
          <Image
            source={imageIndex.normalNotification}
            style={WatchStyle.notificationIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToSearchScreen}
        >
          <Image source={imageIndex.search} style={WatchStyle.searchIcon} />
        </TouchableOpacity>
      </View>
    </View>
  
);});

const UserActions = memo(({ groupsData , isSettingsMode,isMultiSelectMode}) => {
 return   (
    <View style={WatchStyle.onlineuserContainer}>
      <TouchableOpacity 
      activeOpacity={1}
      //  onPress={() => setIsSettingsMode(!isSettingsMode)}
       >
        <FastImage
          style={WatchStyle.userOnlineImg}
          source={{
            uri: `${BASE_IMAGE_URL}${avatar}`,
            priority: FastImage.priority.low,
            cache: FastImage.cacheControl.immutable,
          }}
        // resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={WatchStyle.invitBtnContianerr}
        onPress={() => navigation.navigate(ScreenNameEnum.CreateGroupScreen)}
      >
        <Image source={imageIndex.invitIcon} style={WatchStyle.invitBtnIcon} />
      </TouchableOpacity>
    </View>
  )
})
console.log(groupsData , "groupsData in user action")
const GroupList = memo(({  groupsData ,isMultiSelectModel }) => {
 

  return     (
    <View style={WatchStyle.groupsContainer}>
      <Suspense fallback={
        <View>
          {[1, 2, 3].map((i) => (
            <ShimmerGroupItem key={i} />
          ))}
        </View>

      }>

        <WatchGroupCom
          groups={groupsData}
          isSettingsMode={isSettingsMode}
          onGroupSelect={handleGroupSelect}
          isMultiSelectMode={isMultiSelectMode}
          selectedGroupIds={selectedGroupIds}
          setSelectedGroup={setSelectedGroup}
          setIsSettingsMode={setIsSettingsMode}
        />

      </Suspense>

    </View>
  )})

   return (
    <SafeAreaView style={WatchStyle.mincontainer}>
      <CustomStatusBar translucent={true} />
      {/* <View  style={{backgroundColor:'red',flex:1,zIndex:9345}} >
          <CacheManagerUI /> 
        
        </View> */}
      <View style={WatchStyle.container}>
        {/* {renderHeaderSection()} */}

        {/* {renderUserActions()} */}
        {/* {renderGroupList()} */}
        {/* {headerSection}
        {userActions}
          {groupList} */}



<HeaderSection
  isSettingsMode={isSettingsMode}
  goToSearchScreen={goToSearchScreen}
  setNotificationModal={setNotificationModal}
/>
<UserActions
  isSettingsMode={isSettingsMode}
  avatar={avatar}
  navigation={navigation}
  setIsSettingsMode={setIsSettingsMode}
/>
 
<GroupList
  groupsData={groupsData}
  isSettingsMode={isSettingsMode}
  handleGroupSelect={handleGroupSelect}
  isMultiSelectMode={isMultiSelectMode}
  selectedGroupIds={selectedGroupIds}
  setSelectedGroup={setSelectedGroup}
  setIsSettingsMode={setIsSettingsMode}
/> 
 

      </View>

      {/* Group Settings Modal */}
      {selectedGroup && isSettingsMode && groupSettingModal && (
        <TouchableOpacity
          style={WatchStyle.modalOverlay}
          activeOpacity={1}
          onPress={() => setGroupSettingModal(false)}
        >
          <TouchableNativeFeedback>
            <View style={WatchStyle.modalContent}>

              <Suspense fallback={<ActivityIndicator color={Color.primary} size={'large'} />
                //  <View>
                //     {[1,2,3].map((i) => (
                //       <ShimmerGroupItem key={i} />
                //     ))}
                //   </View>
              }>
                <WatchGroupCom
                  groups={[selectedGroup]}
                  isSettingsMode={false}
                  onGroupSelect={handleGroupSelect}
                  navigationOff={true}
                  isMultiSelectMode={isMultiSelectMode}
                  selectedGroupIds={selectedGroupIds}
                  setSelectedGroup={setSelectedGroup}
                  // setIsSettingsMode={setIsSettingsMode}
                  groupSettingModal={groupSettingModal}
                  setGroupSettingModal={setGroupSettingModal}
                />
                {renderBottomBar()}
              </Suspense>

            </View>
          </TouchableNativeFeedback>
        </TouchableOpacity>
      )}


      {/* Multi-select Bottom Bar */}
      {isMultiSelectMode && (
        <Animated.View style={[
          WatchStyle.bottomActionBar,
          {
            transform: [{ translateY: bottomBarTranslateY }],
            opacity: bottomBarAnim
          }
        ]}>
          <TouchableOpacity
            style={WatchStyle.bottomActionButton}
            onPress={() => {
              if (selectedGroupIds.length === groupsData.length) {
                setSelectedGroupIds([]);
              } else {
                setSelectedGroupIds(groupsData.map(group => group.groupId));
              }
            }}
          >
            <CustomText
              size={14}
              color={Color.whiteText}
              style={WatchStyle.bottomActionText}
              font={font.PoppinsMedium}
            >
              {selectedGroupIds.length === groupsData.length ? 'Deselect All' : 'Select All'}

            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[WatchStyle.bottomActionButton, { alignItems: 'center' }]}
            onPress={() => selectedGroupIds.length > 0 && setLogoutModalVisible(true)}
          >
            <Image
              style={[WatchStyle.modalImg,]}
              source={imageIndex.delete}
              tintColor={Color.orang}
            />

            <CustomText
              size={14}
              color={Color.whiteText}
              style={[
                WatchStyle.bottomActionText,
                { color: Color.orang, marginTop: 6, }
                // { color: selectedGroupIds.length > 0 ? Color.red : Color.textGray }
              ]}
              font={font.PoppinsMedium}
            >
              Delete

            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={WatchStyle.bottomActionButton}
            onPress={animateBottomBarOut}
          >



            <CustomText
              size={14}
              color={Color.whiteText}
              style={WatchStyle.bottomActionText}
              font={font.PoppinsMedium}
            >
              Cancel

            </CustomText>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Notification
        visible={notificationModal}
        onClose={() => setNotificationModal(false)}
        bgColor={false}
      />

      {/* Delete Confirmation Modal */}
      <LogoutModal
        title={"Delete Group"}
        details={"Are you sure you want to delete this group?"}
        visible={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          if (selectedGroup) {
            deleteSelectedGroups(selectedGroup);
            console.log('modal__delete__group__open', selectedGroup)
          } else if (selectedGroupIds.length > 0) {
            console.log('modal__delete__group__open__elseeeee')

            deleteSelectedGroups();
          }
          setLogoutModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};


export default React.memo(WatchScreen);

