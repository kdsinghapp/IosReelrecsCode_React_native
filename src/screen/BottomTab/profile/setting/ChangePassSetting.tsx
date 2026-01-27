import { Alert, Image,  StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
 
 import { Color } from '@theme/color'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { changePassword, loginUser_Api } from '@redux/Api/authService'
import font from '@theme/font'
import { SafeAreaView } from 'react-native-safe-area-context'
import StatusBarCustom from '@components/common/statusBar/StatusBarCustom'
import { Button, HeaderCustom, SuccessMessageCustom } from '@components/index'
import imageIndex from '@assets/imageIndex'


const ChangePassSetting = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const email = useSelector((state: RootState) => state.auth.userGetData?.email_id);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [toestMess, setToestMess] = useState(false)
  const [toestMessColorGreen, setToestMessGreen] = useState(false)
  const [toastMessage, setToastMessage] = useState('');

  const navigation = useNavigation();


  const toestMessFunc = ({ green = false, message = '' }) => {
    setToestMess(true);
    setToastMessage(message);

    if (green) setToestMessGreen(true);

    setTimeout(() => {
      setToestMess(false);
      setToestMessGreen(false);
      setToastMessage('');
    }, 2000);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toestMessFunc({ green: false, message: "Please check Password field" });
      return;
    }

    if (newPassword !== confirmPassword) {
           toestMessFunc({ green: false, message: "Confirm new password not match" });

      return;
    }

    try {
      // 1. Current password verify (Login API)
      const tokenCheck = await loginUser_Api(email, currentPassword.trim());
      if (!tokenCheck) {
                  toestMessFunc({ green: false, message: "Current password not match" });

        return;
      }

      // 2. Change Password API
      const res = await changePassword(tokenCheck, newPassword.trim());
      if (res?.password_reset === "success") {

                          toestMessFunc({ green: true, message: "Pasword change SuccessFully" });

        navigation.goBack(); 
      } else {
        // Alert.alert("Error", "Password change failed");
      }

    } catch (error) {
      console.log("Password Change Error:", error);
      // Alert.alert("Error", "कुछ गड़बड़ है, कृपया दोबारा कोशिश करें");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarCustom />
      <HeaderCustom
        title="Change Password"
        backIcon={imageIndex.backArrow}
      />

      {/* Current Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Current password"
          placeholderTextColor={Color.placeHolder}
          secureTextEntry={secureCurrent}
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
          <Image style={styles.hideImage} source={secureCurrent ? imageIndex.eyes : imageIndex.view} />
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New password"
          placeholderTextColor={Color.placeHolder}
          secureTextEntry={secureNew}
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
          <Image style={styles.hideImage} source={secureNew ? imageIndex.eyes : imageIndex.view} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirm new password"
          placeholderTextColor={Color.placeHolder}
          secureTextEntry={secureConfirm}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
          <Image style={styles.hideImage} source={secureConfirm ? imageIndex.eyes : imageIndex.view} />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <View style={{ paddingHorizontal: 18, marginTop: 10 }}>
        <Button title='Save' onPress={handleSave} />
      </View>


      {toestMess && (
        <SuccessMessageCustom
          textColor={Color.whiteText}
          color={toestMessColorGreen ? Color.green : Color.red}
          message={toastMessage}
        />
      )}
    </SafeAreaView>
  )
}

export default ChangePassSetting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    paddingTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Color.grey700,
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 48,
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    color: Color.whiteText,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: font.PoppinsRegular,
    height: 50,
  },
  hideImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    tintColor: Color.whiteText
  }
});




// import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import StatusBarCustom from '@components/common/statusBar/StatusBarCustom'
// import { Button, HeaderCustom } from '@components'
// import imageIndex from '@assets/imageIndex'
// import { Color } from '@theme/color'
// import ScreenNameEnum from '@routes/screenName.enum'
// import { useNavigation } from '@react-navigation/native'
// import { useSelector } from 'react-redux'
// import { RootState } from '@redux/store'
// import { changePassword, loginUser_Api, resetPassword, setNewPassword as setNewPasswordData} from '@redux/Api/authService'
// import font from '@theme/font'
// const ChangePassSetting = () => {
//     const token = useSelector((state: RootState) => state.auth.token);
//     const email = useSelector((state: RootState) => state.auth.userGetData);
//   console.log(email, "email_____")
//       const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [secureCurrent, setSecureCurrent] = useState(true);
//   const [secureNew, setSecureNew] = useState(true);
//   const [secureConfirm, setSecureConfirm] = useState(true);
//   const navigation =  useNavigation();
// const [passError , setPassError] = useState('')
//   const handleSave = async (token:string , currentPassword:string , confirmPassword:string) => {
//     const trimmedCurrentPassword = currentPassword.trim()
//     const currentPassowrd = await resetPassword( , confirmPassword)
//     const tokenCheck = await loginUser_Api('sunny.2309@yahoo.in', trimmedCurrentPassword);

// if (confirmPassword === newPassword) {
// if (tokenCheck) {
//   const res = await changePassword(tokenCheck, confirmPassword);
//   console.log(token , tokenCheck , 'tokebCheckBOth__Here')
//   console.log(res , 'set_new_password_data')
//   // Alert.alert('set_new_passWord')


//     } else {
//       // Alert.alert('curent password not match')

//     }
// } else  {
//   // Alert.alert('new password and conform password not match')
// }

    
//   const res = await setNewPasswordData(token, confirmPassword);
//   if (res) {
//     // Alert.alert("Password changed");
//   } else {
//     // Alert.alert("Error", res?.message);
//   }
// };

//   return (

//   <SafeAreaView style={styles.container}>
//       <StatusBarCustom />
//       <HeaderCustom
//         title="Change Password"
//         backIcon={imageIndex.backArrow}
//       // onBackPress={() => console.log('Back pressed')}
//       // onRightPress={() => setBottomModal(true)}
//       />
//     <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Current password"
//           placeholderTextColor={Color.placeHolder}
//           secureTextEntry={secureCurrent}
//           style={styles.input}
//           value={currentPassword}
//           onChangeText={setCurrentPassword}
//         />
//         <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
//             {secureCurrent ?  <Image style={styles.hideImage} source={imageIndex.eyes} />
//           : <Image style={[styles.hideImage]} source={imageIndex.view} />}

//         </TouchableOpacity>
//       </View>

//       {/* New Password */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="New password"
//           placeholderTextColor={Color.placeHolder}
//           secureTextEntry={secureNew}
//           style={styles.input}
//           value={newPassword}
//           onChangeText={setNewPassword}
//         />
//         <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
//                 {secureNew ?  <Image style={styles.hideImage} source={imageIndex.eyes} />
//           : <Image style={[styles.hideImage]} source={imageIndex.view} />}

//         </TouchableOpacity>
//       </View>

//       {/* Confirm New Password */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Confirm new password"
//           placeholderTextColor={Color.placeHolder}
//           secureTextEntry={secureConfirm}
//           style={styles.input}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />
//         <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
//           {secureConfirm ?  <Image style={styles.hideImage} source={imageIndex.eyes} />
//           : <Image style={[styles.hideImage]} source={imageIndex.view} />}
           
            
//         </TouchableOpacity>
//       </View>

//       {/* Save Button */}
//   <View  style={{paddingHorizontal:18, marginTop:10,}} >
//           <Button title='Save'
//               // onPress={() => navigation.navigate(ScreenNameEnum.MainSetting)}
//               onPress={() => handleSave(token ,currentPassword ,confirmPassword )}
             
//             />
//   </View>
//       </SafeAreaView>

//   )
// }

// export default ChangePassSetting
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.background, // Dark background
//     paddingTop: 15,
//     // justifyContent: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     backgroundColor: Color.grey700,
//     alignItems: 'center',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 14,
//     height: 48,
//     justifyContent: 'space-between',
//     marginHorizontal:15,
    
//   },
//   input: {
//     flex: 1,
//     color: Color.whiteText,
//     fontSize: 16,
//     lineHeight:20,
//     fontFamily:font.PoppinsRegular,
//     height:50,

//   },
//   saveButton: {
//     height: 45,
//     borderColor: '#00BFFF',
//     borderWidth: 1,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     marginHorizontal:15,

//   },
//   hideImage:{
//     height:18,
//     width:18,
//     resizeMode:'contain',
//     tintColor: Color.whiteText
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 16,
//     // fontWeight: '600',
//   },
// });