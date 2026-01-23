import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
 import Styles from './style';
import {
   CustomStatusBar,
  HeaderCustom,
  InputFieldCustom,
  SuccessMessageCustom,
} from '../../../component';
import styles from './style';
import { Color } from '../../../theme/color';
import usePasswordReset from './usePasswordReset';
import useToastMessage from '../../../component/useToastMessage/useToastMessage';
import font from '../../../theme/font';
import CustomText from '../../../component/common/CustomText';
import ButtonCustom from '../../../component/common/button/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PasswordReset() {
  const {
    email,
    handleIdentityText,
    emailError,
    loading,
    handleSendResetOTP, // use updated function from hook
  } = usePasswordReset();
  const {
    toastVisible,
    toastMessage,
    toastGreen,
    showToast,
  } = useToastMessage();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.background, paddingTop: 15 }}>
      <CustomStatusBar backgroundColor="transparent" translucent />

      {loading && <Loading />}
      <View style={{ marginTop: 20, }} >
        <HeaderCustom
          backIcon={imageIndex.backArrow}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewCont}>
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Image
              source={imageIndex.appLogo}
              style={styles.imgLogo}
              resizeMode="contain"
            />
            <CustomText
              size={22}
              color={Color.whiteText}
              style={[styles.txtHeading, { marginTop: 6 }]}
              font={font.PoppinsRegular}
            >
              ReelRecs
            </CustomText>
            {/* <Text style={styles.txtHeading}>ReelRecs</Text> */}
          </View>

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


          <CustomText

            size={16}
            color={Color.whiteText}
            style={styles.titlSub}
            font={font.PoppinsRegular}
          >
            Enter your email address and we will send you a link to reset your
            password.
          </CustomText>

          {/* <Text style={styles.titlSub}>
           
          </Text> */}

          <View style={styles.inputView}>
            <InputFieldCustom
              text={email}
              onChangeText={handleIdentityText}
              placeholder={'Email '}
            />
            {emailError ? (
              <Text style={Styles.redText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: 20 }}>

            <ButtonCustom
              title="Request password reset"
                 textStyle={{
                            color:Color.whiteText
                          }}
              onPress={() => {
                handleSendResetOTP();

              }}
            // buttonStyle={styles.saveButton}
            />




          </View>
        </View>
      </ScrollView>

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
