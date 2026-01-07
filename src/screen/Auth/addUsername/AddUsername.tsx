import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  
} from 'react-native';
import React from 'react';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import Styles from './style';
import { Button, CustomStatusBar, InputFieldCustom } from '../../../component';
import styles from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import useSignup from '../signup/useSignup';
import CustomText from '../../../component/common/CustomText';
import { Color } from '../../../theme/color';
import font from '../../../theme/font';
import ButtonCustom from '../../../component/common/button/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function AddUsername() {
  const {
    loading,
    handleFinalSignup,
    username,
    setUsername,
    usernameError,
    // email, password 
  } = useSignup()
  const route = useRoute();
  const { email, password } = route.params || {};
    const navigating = useNavigation()
  
  console.log(email, password , 'AddUsername___')
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "black"
    }}>
      <CustomStatusBar backgroundColor="transparent" translucent />

      {loading ? <Loading /> : null}
      <ScrollView showsVerticalScrollIndicator={false} >
        
        <View
          style={styles.viewCont}>
            <TouchableOpacity onPress={() => navigating.goBack()} >
          <Image source={imageIndex.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
          {/* Logo & App Name */}
          <View style={styles.logoContainer}>
            <Image
              source={imageIndex.appLogo}
              style={styles.imgLogo}
              resizeMode="contain"
            />
            <CustomText
              size={24}
              color={Color.whiteText}
              style={[styles.txtHeading, { marginTop: 1 }]}
              font={font.PoppinsBold}
            >
              ReelRecs
            </CustomText>
          </View>
          <View style={{ marginTop: 30}}>

            <CustomText
              size={24}
              color={Color.whiteText}
              style={styles.loginHeading}
              font={font.PoppinsBold}
            >
              Your username
            </CustomText>
            {/* <Text style={styles.loginHeading}>Your username</Text> */}
          </View>
          <CustomText
            size={16}
            color={Color.whiteText}
            style={styles.titlSub}
            font={font.PoppinsRegular}

          >
            What name should represent you on ReelRecs?

          </CustomText>


          <View style={styles.inputView}>

            <InputFieldCustom
              text={username}
              onChangeText={setUsername}
              placeholder="@ username"
            />
            {usernameError ?
              // <Text style={Styles.redText}></Text> 

              <CustomText
                size={16}
                color={Color.whiteText}
                style={Styles.redText}
                font={font.PoppinsRegular}

              >
                {usernameError}

              </CustomText>

              : null}

          </View>

          <CustomText

            size={14}
            color={Color.placeHolder}
          style={styles.subTitle}
            font={font.PoppinsRegular}
          >
            You can always change it later.
          </CustomText>

          <View style={{
            marginTop: 30
          }}>

        <ButtonCustom
                            title="Next"
                        onPress={() => {
                console.log("Pressed Next");
                handleFinalSignup(username, email, password);
              }}
                            // buttonStyle={styles.saveButton}
                          />

        
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

