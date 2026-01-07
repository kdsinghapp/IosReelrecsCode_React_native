import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Dimensions,
  Pressable,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { Color } from '../../../theme/color';
import HeaderCustom from '../../common/header/HeaderCustom';
import { useNavigation } from '@react-navigation/native';
// import { Feather } from '@expo/vector-icons'; // use react-native-vector-icons for CLI
import { BlurView } from '@react-native-community/blur';
import { CustomStatusBar, EditNameModal, SuccessMessageCustom } from '../..';
import CustomSwitch from '../../common/CustomSwitch/CustomSwitch ';
import GroupMembersModal from '../GroupMemberModal/GroupMemberModal';
import AddFrindModal from '../AddFrindModal/AddFrindModal';
import BlurViewCom from '../../common/BlurViewCom/BlurViewCom';
import LogoutModal from '../logoutModal/logoutModal';
import GroupAllAvatars from '../../common/GroupAllAvatars/GroupAllAvatars';
import font from '../../../theme/font';
import StatusBarCustom from '../../common/statusBar/StatusBarCustom';
import { getAllGroups, getGroupMembers, leaveGroup, renameGroup, toggleGroupNotification } from '../../../redux/Api/GroupApi';
import ScreenNameEnum from '../../../routes/screenName.enum';

const { width, height } = Dimensions.get('window');

const GroupSettingModal = ({ visible, onClose, group, groupId, token, group_name, setGroup_name }) => {
  const navigation = useNavigation();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [isTrailer, setIsTrailer] = useState(false);
  const [editNameModal, setEditNameModal] = useState(false);
  const [groupMember, setGroupMember] = useState(false);
  const [addFrindModal, setAddFrindModal] = useState(false);
  const [groupName, setgroupName] = useState("Movie Night Crew")
  const [exitGroupModal, setExitGroupModal] = useState(false);
  const [deletegroupModal, setDeletegroupModal] = useState(false)
  // const [ countmemebers , setCountmemebers ] = useState('')

  // const userCount = group?.members.length;
  const [isGroupMute, setIsGroupMute] = useState(group?.isMuted);


 const [toestMess, setToestMess] = useState(false)
  const [toestMessColorGreen, setToestMessGreen] = useState(true)
  const [toastMessage, setToastMessage] = useState('');

  // console.log(isGroupMute)
  // Alert.alert(isGroupMute)
  // console.log(userCount, "------> group members copunt");
  // console.log(isGroupMute, group_name ,group.members, "------> groupgroup_______isMuted members copunt");
  // console.log(group ,  '- -  - -group')
  const toggleNotification = () => {
    setNotificationEnabled(prev => !prev);
  };

  // const renameGroupHandle = async (token, groupId, groupName) => {
  //   try {
  //     const response = await renameGroup(token, groupId, groupName);
  //     console.log(response, "renameGroup_______")
  //   } catch (error) {
  //     console.log("Rename group error", error)
  //   }
  // }

  const handleNotification = async (token, groupId, currentStatus) => {
    const newStatus = currentStatus ? 'off' : 'on'; // true => 'off', false => 'on'
    // console.log(token, groupId, currentStatus, "token, groupId, __currentStatus______")
    try {
      setIsGroupMute(!isGroupMute)
      const response = await toggleGroupNotification(token, groupId, newStatus);
 
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };
  useEffect(()=>{
    fetchGroups()
  },[]) 
  const [group1, setGroup] = useState<any>([]);
const fetchGroups = async () => {
 

  try {
    const groupsRes = await getGroupMembers(token, groupId);
    console.log("✅ groupsRes:", groupsRes);

    if (groupsRes) {
      setGroup(groupsRes);
    }
  } catch (error) {
    console.error("❌ Error fetching group details:", error);
  }
};



const handleLogOutMsg = ()=> {
 setToestMess(true)
}

  const hanldeleaveGroup = async (token, groupId) => {
    try {
      const response = await leaveGroup(token, groupId)
      onClose()
     navigation.navigate(ScreenNameEnum.WatchScreen, {
        getAllGroupReferace: Date.now()
      })
   
 
      console.log(response, "<------_____leaveGroup")
    } catch (error) {
      console.error(error , "error__e")
    }
  };

const [userCount, setUserCount] = useState(group1?.results?.length ||group);
const [userCount1, setUserCount1] = useState(0);
useEffect(() => {
  if (group1?.results?.length !== undefined) {
    setUserCount1(group1.results.length);

 
   }
}, [group1?.results?.length ||group]);

useEffect(() => {
     console.log("add --- groupMember get")
     fetchGroups();
 
}, [groupMember,addFrindModal]);

 

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}
 >
      <View style={{ flex: 1, backgroundColor: Color.modalTransperant }}  >

        <StatusBarCustom
          barStyle="light-content"
          backgroundColor={Color.modalTransperant}
          translucent={false}
        />
        {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}

        {/* <BlurViewCom /> */}
        <View style={[styles.modalContainer,{
          marginTop:  Platform.OS === "ios" ? 30 : 0,
        }]}>
          <View style={styles.headerContainer} >
            <TouchableOpacity onPress={()=>{
              onClose(userCount)
            }} >
              <Image source={imageIndex.backArrow} style={styles.icon} resizeMode="contain" />

            </TouchableOpacity>
            <Text style={styles.title} >
              Group Setting
            </Text> 
          </View>
          
          <View style={styles.headerSection}>
            <View style={styles.avatarsContainer}>
              <GroupAllAvatars group={group1?.results} />
            </View>
            <View style={styles.groupNameRow}  >
                              <Image source={imageIndex.edit} style={{ height: 24, width: 24, tintColor: Color.background , }} resizeMode='contain' />

               <Text style={styles.groupName} numberOfLines={2} >{group_name}</Text>

              <TouchableOpacity  onPress={() => setEditNameModal(true)} >
                <Image source={imageIndex.edit} style={{ height: 24, width: 24, tintColor: Color.primary , marginLeft:5,}} resizeMode='contain' />
              </TouchableOpacity  >
            </View>
          </View>


          {/* Options List */}
          <TouchableOpacity style={styles.optionRow} onPress={() => setGroupMember(true)} >
            <Image source={imageIndex.usersGroup} style={{ marginLeft: 6, height: 24, width: 24 }} resizeMode='contain' />

            {/* <Feather name="users" size={20} color="#fff" /> */}
            <Text style={styles.optionText}>Members {`(${userCount1})`} </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setAddFrindModal(true)} >
            <Image source={imageIndex.UserAdd} style={{ marginLeft: 6, height: 24, width: 24 }} resizeMode='contain' />

            {/* <Feather name="user-plus" size={20} color="#fff" /> */}
            <Text style={styles.optionText}>Add Friends</Text>
          </TouchableOpacity>

          <View style={[styles.optionRow, { justifyContent: 'space-between' , }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={imageIndex.bellNotification}
                style={{ marginLeft: 6, height: 24, width: 24  ,
 
                 }}
                resizeMode="contain"
               />
              <Text style={styles.optionText}>Notification</Text>
            </View>

            <CustomSwitch
              value={!isGroupMute}
              onValueChange={() => handleNotification(token, groupId, isGroupMute)}
            />
          </View>
          <TouchableOpacity style={styles.optionRow} onPress={() => setExitGroupModal(true)} >
            {/* <Feather name="log-out" size={20} color="#fff" /> */}
            <Image source={imageIndex.settingExit} style={{ marginLeft: 6, height: 24, width: 24 }} resizeMode='contain' />

            <Text style={styles.optionText}>Exit Group</Text>
          </TouchableOpacity>
        </View>

        <EditNameModal
          modalVisible={editNameModal}
          fieldLabel="Change Group Name"
          initialValue={group_name}
          setGroup_name={setGroup_name}
          setModalVisible={setEditNameModal}
          fieldKey="group_name"
          group_name={group_name}
          groupId={groupId}
          token={token}
          type="group_name"
          onSave={(key, newValue) => {
            setgroupName(newValue); //  Local UI update
          }}
          onClose={() => setEditNameModal(false)}
        />

        {/* <GroupMembersModal visible={groupMember}
        onClose={() => setGroupMember(false)}
        heading={"Group Members"}
        groupMembers={group.members}
      /> */}
        <GroupMembersModal visible={groupMember}
          groupMembers={group1?.results || group?.members}
          onClose={() => setGroupMember(false)}
          token={token}
          heading={"Group Members"} />
        <AddFrindModal
          visible={addFrindModal}
          token={token}
          groupId={groupId}
          fetchGroups={fetchGroups}
          onClose={(d) => {
    if (Array.isArray(d)) {
    setUserCount1(prev => prev + d?.length);
  }
fetchGroups()
  setAddFrindModal(false);
}}

        />
        {exitGroupModal && <LogoutModal
          visible={exitGroupModal}
          title={"Exit Group"}
          details={"You're about to leave this group Proceed?"}
          onCancel={() => setExitGroupModal(false)}
          onConfirm={() => {
            hanldeleaveGroup(token, groupId);
            setExitGroupModal(false);
handleLogOutMsg()
            // TODO: Call logout logic here (e.g., clearing tokens, navigating to login screen)
            // console.log('Logged out!');
          }}
        />}
 {toestMess && (
        <SuccessMessageCustom
          textColor={Color.whiteText}
          color={toestMessColorGreen ? Color.green : Color.red}
          message={'You have left the group.'}
        />
      )}
     
{deletegroupModal && 
<LogoutModal

  visible={deletegroupModal}
  title={"Delete Group"}
  details={"are you sure  you want to delete this group?"}
  onCancel={() => setDeletegroupModal(false)}
  onConfirm={() => {
    setDeletegroupModal(false);
    console.log('Logged out!');
  }}
/>
}
        {/* </Pressable> */}
      </View>
    </Modal>
  );
};

export default GroupSettingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

  },
  modalContainer: {
    flex: 1,

    paddingHorizontal: 20,
    paddingTop: 16,
    //  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  // handleBar: {
  //   width: 40,
  //   height: 5,
  //   backgroundColor: '#555',
  //   borderRadius: 3,
  //   alignSelf: 'center',
  //   // marginBottom: 16,
  // },
  headerSection: {
    // marginTop:14,
    alignItems: 'center',

    justifyContent:'center',
    // marginBottom: 10,
  },
  avatarsContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
  },
  // avatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   borderWidth: 2,
  //   borderColor: '#fff',
  // },
  // countBadge: {
  //   backgroundColor: '#00AEEF',
  //   borderRadius: 10,
  //   paddingHorizontal: 6,
  //   height: 20,
  //   marginLeft: 6,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // countText: {
  //   color: '#fff',
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20,
    marginBottom:10,
    // backgroundColor:'center',
    justifyContent:'center',
    width:'90%'

  },
  groupName: {
    color: Color.whiteText,
    fontSize: 18,
    fontFamily: font.PoppinsBold,
    lineHeight: 24,
    textAlign: 'center',
   },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: Color.lightGrayText,
    borderBottomWidth: 0.6,
  },
  optionText: {
    marginLeft: 12,
    marginRight: 33,
    fontSize: 16,
    color: '#fff',
    fontFamily:font.PoppinsMedium ,
    textAlign:"center"

  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    // alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: font.PoppinsBold,
    color: Color.whiteText,
    lineHeight: 20,
    flex: 1,
    marginRight: 25,

  },
  icon: {
    width: 24,
    height: 24,


  },
});
