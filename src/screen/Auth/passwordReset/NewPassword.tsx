import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import styles from './style';
import {
  Button,
  CustomStatusBar,
  HeaderCustom,
  InputFieldCustom,
  SuccessMessageCustom,
} from '../../../component';
import { Color } from '../../../theme/color';
import { useNavigation, useRoute } from '@react-navigation/native';
import usePasswordReset from './usePasswordReset';
import useToastMessage from '../../../component/useToastMessage/useToastMessage';
import CustomText from '../../../component/common/CustomText';
import font from '../../../theme/font';
import ButtonCustom from '../../../component/common/button/ButtonCustom';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function NewPassword() {
  const route = useRoute();
  const { email } = route.params || {};

const {
  toastVisible,
  toastMessage,
  toastGreen,
  showToast,
} = useToastMessage(); //  Declare first

const {
  password,
  confirmPassword,
  handlePassText,
  handleConfirmPassText,
  passwordError,
  changeOldPassword,
  loading,
} = usePasswordReset({ showToast }); //  Now this is safe

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
const navigation = useNavigation();


const onBackPress  = () => {
navigation.navigate(ScreenNameEnum.LoginScreen);
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.background }}>
      <CustomStatusBar backgroundColor="transparent" translucent />
      {loading && <Loading />}
 <View style={{ marginTop: 60, marginLeft:16,}} >
    <TouchableOpacity onPress={onBackPress}>
          <Image source={imageIndex.backArrow} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        {/* <HeaderCustom
          backIcon={imageIndex.backArrow}
        /> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewCont}>
          {/* App Logo */}
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Image source={imageIndex.appLogo} style={styles.imgLogo} resizeMode="contain" />
              <CustomText

                 size={22}
              color={Color.whiteText}
              style={styles.txtHeading}
                           font={font.PoppinsRegular}
             
                >
              ReelRecs
                </CustomText>
          </View>

          {/* Headings */}
          <View style={{ marginTop: 40 }}>

              <CustomText

                size={24}
                color={Color.whiteText}
                style={styles.loginHeading}
                font={font.PoppinsBold}
              >
              Password Reset
              </CustomText>
            {/* <Text style={styles.loginHeading}>Password Reset</Text> */}
          </View>
          {/* <Text style={styles.titlSub}>Create a new password for your account.</Text> */}
          <CustomText
                 size={16}
              color={Color.whiteText}
            style={styles.titlSub}
                           font={font.PoppinsRegular}
                >
              Create a new password for your account.
                </CustomText>

          {/* Input Fields */}
          <View style={styles.inputView}>
            <InputFieldCustom
              lable={'Password'}
              text={password}
              onChangeText={handlePassText}
              placeholder={'Password'}
              showEye={true}
               hide={true}
              ref={passwordRef}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              returnKeyType="next"
            />

            <InputFieldCustom
              lable={'Confirm password'}
              text={confirmPassword}
              onChangeText={handleConfirmPassText}
              placeholder={'Confirm password'}
              showEye={true}
              ref={confirmPasswordRef}
              returnKeyType="done"
               hide={true}
            />
          </View>

          {/* Button */}
          <View style={{ marginTop: 35 }}>
             <ButtonCustom
                            title="Change Password"
                           onPress={() => {changeOldPassword(password,confirmPassword, email);
                            // console.log(passwordRef.current, confirmPasswordRef.current , confirmPassword ,password , "current____confirmPasswordRef.current")
                           }}
                            // buttonStyle={styles.saveButton}
                          />
          
            {passwordError ? (
              // <Text style={{ color: 'red', marginTop: 10 }}>{passwordError}</Text>
                 <CustomText

              size={16}
              color={'red'}
              style={[styles.loginHeading, { marginTop: 10 }]}
              font={font.PoppinsRegular}
            >
             {passwordError}
            </CustomText>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Success Message Toast */}
       {toastVisible && (
        <SuccessMessageCustom
          message={toastMessage}
          color={toastGreen ? Color.green : Color.red}
          textColor={Color.whiteText}
        />
      )}
    </SafeAreaView>
  );
}


