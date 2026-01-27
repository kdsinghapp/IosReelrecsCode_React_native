import { Alert, FlatList, Image, Modal, Pressable,  StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
 
 import { Color } from '@theme/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import ScreenNameEnum from '@routes/screenName.enum'
import LogoutModal from '@components/modal/logoutModal/logoutModal'
import { logoutApi } from '@redux/Api/authService'
 import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { logout } from '@redux/feature/authSlice'
import font from '@theme/font'
import { SafeAreaView } from 'react-native-safe-area-context'
import imageIndex from '@assets/imageIndex'
import StatusBarCustom from '@components/common/statusBar/StatusBarCustom'
import { HeaderCustom, SuccessMessageCustom } from '@components/index'
type MenuItem = {
  icon: string;
  label: string;
  screenName: string;
};

const menuData: MenuItem[] = [
  { icon: imageIndex.playCircle, label: 'Streaming Services', screenName: "StreamService" },
  { icon: imageIndex.settingUser, label: 'Account', screenName: "AccountSetting" },
  { icon: imageIndex.settingPlay, label: 'Playback', screenName: "PlaybackSetting" },
  { icon: imageIndex.settingPrivacy, label: 'Privacy', screenName: "PrivacySetting" },
  { icon: imageIndex.featureRequest, label: 'Feature Request', screenName: "FeatureRequest" },
  { icon: imageIndex.settingHelpImg, label: 'Help', screenName: "HelpSetting" },
  { icon: imageIndex.settingExit, label: 'Log Out', screenName: "SettingLogOut" },
];
const MainSetting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { toastTrue } = route?.params || {};
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token); // ✅ outside any condition
  const [toestMessColorGreen, setToestMessGreen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toestMess, setToestMess] = useState(false);
   useEffect(() => {
    if (toastTrue) {
      setTimeout(() => {
        setToestMess(true);
        setToestMessGreen(true);
        setToastMessage("Feedback submitted successfully");
      }, 500);

    }
  }, [toastTrue]);

  const dispatch = useDispatch();
  const handleLogoutConfirm = async () => {
     if (!token) {
      console.warn('⚠️ No token found');
      return;
    }
    const success = await logoutApi(token);

    if (success) {
 
      // logout()
      dispatch(logout());
      setLogoutModalVisible(false);
      if (logoutModalVisible) {
        navigation.reset({
          index: 0,
          routes: [{ name: ScreenNameEnum.LoginScreen }],
        });
      }
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: ScreenNameEnum.LoginScreen }], 
      // });
    }
  };



  const renderItem = ({ item }: { item: MenuItem }) => (


    <TouchableOpacity
      onPress={() => {
        if (item.label === 'Log Out') {
          setLogoutModalVisible(true); // Show modal
        } else {
          if (item.screenName === "FeatureRequest") {
            navigation.navigate(ScreenNameEnum[item.screenName], {
              // setFeedBAckSucc
            });
          } else {
            navigation.navigate(ScreenNameEnum[item.screenName]);
          }
        }
      }}
      style={styles.menuItem}
    >

      <Image source={item.icon} color={Color.whiteText} style={styles.icon} tintColor={Color.primary} />
      <Text allowFontScaling={false} style={styles.label}>{item?.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarCustom />
      <HeaderCustom
        title="Setting"
        backIcon={imageIndex.backArrow}
      // onBackPress={() => console.log('Back pressed')}
      // onRightPress={() => setBottomModal(true)}
      />
      {/* <View style={styles.container}> */}
      <View style={styles.menuBox}>
        <FlatList
          data={menuData}
          keyExtractor={(item) => item.label}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.separator} />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
        />
      </View>

      {toestMess && (
        <SuccessMessageCustom
          textColor={Color.whiteText}
          color={toestMessColorGreen ? Color.green : Color.red}
          message={toastMessage}
        />
      )}

      {/* </View> */}
      <LogoutModal
        title={"Logout"}
        details={"Log out of your account"}
        visible={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          handleLogoutConfirm()
          // TODO: Call logout logic here (e.g., clearing tokens, navigating to login screen)
         }}
      />
    </SafeAreaView>
  )
}

export default React.memo(MainSetting)

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Color.background,
    paddingTop: 15,
  },
  menuBox: {
    borderWidth: 2,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 16,
    // paddingVertical:10,
    backgroundColor: Color.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  icon: {
    resizeMode: 'contain',
    height: 24,
    width: 24,

    marginRight: 10,
  },
  label: {
    color: Color.whiteText,
    fontSize: 16,
    fontFamily: font.PoppinsMedium
  },
  separator: {
    height: 1,
    backgroundColor: Color.placeHolder,
  },
});
