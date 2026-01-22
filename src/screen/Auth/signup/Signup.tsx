import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  
  Dimensions,
} from 'react-native';
import React from 'react';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import Styles from './style';
import { Button, CustomStatusBar, InputFieldCustom } from '../../../component';
import styles from './style';
import useSignup from './useSignup';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from '../../../theme/color';
export default function Signup() {
  const {
    navigation,
    SignupUser,
    loading,
    handleIdentityText,
    // handleUsernameText,
    handlePassText,
    handleConfirmPassText,
    // setConfirmPassword,
    confirmPasswordError,
    // setConfirmPasswordError,
    emailError,
    passwordError,
    email, password } = useSignup()
  console.log(email)
  const navigating = useNavigation()

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "black"
    }}>
      <CustomStatusBar backgroundColor="transparent" translucent />

      {loading ? <Loading /> : null}
      <ScrollView showsVerticalScrollIndicator={false} >
        
        <View
          style={[styles.viewCont, {marginTop:50,}]}>
            <TouchableOpacity onPress={() => navigating.goBack()} >
          <Image source={imageIndex.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
          <View style={[styles.appLogoContainer,{marginTop: 36}]}>

            <Image
              source={imageIndex.appLogo}
              style={styles.imgLogo} resizeMode='contain'
            />
            <Text style={styles.txtHeading}>ReelRecs</Text>

          </View>
          <View style={{ marginTop:36}}>
            <Text style={styles.loginHeading}>Create an Account</Text>

          </View>
          <View style={styles.inputView}>
            <InputFieldCustom
              text={email}
              onChangeText={handleIdentityText}
              placeholder={'Email '}
            />
            {emailError ? <Text style={Styles.redText}>{emailError}</Text> : null}


            {/* <InputFieldCustom
               text={username}
              onChangeText={handleUsernameText}
              placeholder={'UserName'}
            />
            {usernameError ? <Text style={Styles.redText}>{usernameError}</Text> : null} */}

            <InputFieldCustom
              text={password}
              onChangeText={handlePassText}
              placeholder={'Password'}
              showEye={false}
            />
            <InputFieldCustom
              placeholder={'Confirm password'}
              onChangeText={handleConfirmPassText}

              showEye={false}
            />
            {confirmPasswordError ? <Text style={Styles.redText}>{confirmPasswordError}</Text> : null}

          </View>
          <View style={{
            marginTop:36,
          }}>
            {/* <Button title='Sign up' onPress={SignupUser} /> */}
            <Button title='Sign up' onPress={SignupUser} 
               textStyle={{
                          color:Color.whiteText
                        }}
            />

            {/* <Button title='Sign up' onPress={() => navigation.navigate(ScreenNameEnum.AddUsername)} /> */}
          </View>
          <Text style={styles.subTitle}>or continue with</Text>
          <View style={styles.otherLoginContainer}>
            <TouchableOpacity style={Styles.iconButton}>
              <Image
                source={imageIndex.fb}
                style={Styles.iconImage}
              />
            </TouchableOpacity>

            {/* Button 2 */}
            <TouchableOpacity style={Styles.iconButton}>

              <Image
                source={imageIndex.google}
                style={Styles.iconImage}
              />
            </TouchableOpacity> 
            {/* Button 3 */}
            <TouchableOpacity style={Styles.iconButton}>

              <Image
                source={imageIndex.apple}
                style={Styles.iconImage}
              />
            </TouchableOpacity>
          </View>
          <View
            style={Styles.titlView}>
            <Text style={styles.tite}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.navigate(ScreenNameEnum.LoginScreen)
              }}>
              <Text style={Styles.text}> Sign in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}




