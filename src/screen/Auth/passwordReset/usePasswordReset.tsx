import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} from '../../../redux/Api/authService';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { Alert } from 'react-native';

const usePasswordReset = (options = {}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeEmail = (route.params as any)?.email || '';
const { showToast = () => {} } = options;
  const [email, setEmail] = useState(routeEmail);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  // const [toestMess, setToestMess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 📩 Handle email input
  const handleIdentityText = (text: string) => {
    setEmail(text);
    setEmailError('');
  };

  // 🔐 Handle password input
  const handlePassText = (text: string) => {
    setPassword(text);
    setPasswordError('');
  };

  // 🔐 Confirm password input
  const handleConfirmPassText = (text: string) => {
    setConfirmPassword(text);
    setPasswordError('');
  };

  // 🔢 OTP input handler
  const handleOtpText = (text: string) => {
    setOtp(text);
    setOtpError('');
  };

  // ✅ Step 1: Send Reset OTP
 const handleSendResetOTP = async () => {
  const trimmedEmail = email.trim().toLowerCase();
console.log(trimmedEmail , 'trimmedEmail__usepasswordreset')
  if (!trimmedEmail) {
    setEmailError('Email is required');
    return;
  } else if (!emailRegex.test(trimmedEmail)) {
    setEmailError('Invalid email format');
    return;
  }
  try {
    setLoading(true);
    const response = await sendResetOTP(trimmedEmail);
console.log('ffffd_fsf')
    if (!response.success) {
      showToast({ message: response.message, green: false });
      return;
    }

    showToast({ message: 'OTP sent to your email', green: true });

    navigation.navigate(ScreenNameEnum.EmailVerify, {
      email: trimmedEmail,
      purpose: 'reset_password',
    });

  } catch (err) {
    console.error('OTP Send Error:', err);
    showToast({ message: 'Something went wrong', green: false });
  } finally {
    setLoading(false);
  }
};





  // ✅ Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
         setOtpError('Enter valid OTP');

      return;
    }

    try {
      setLoading(true);
      const res = await verifyResetOTP(email.trim(), otp);
      if (res.success) {
        showToast({ message: 'OTP verified successfully', green: true });

        navigation.navigate(ScreenNameEnum.NewPassword, { email });
      } else {
            showToast({ message: 'Something went wrong', green: false });
        console.log('fdfdffd_dfffff')
      }
    } catch (err) {
      console.error('OTP Verify Error:', err);
         showToast({ message: 'Something went wrong', green: false });
        console.log('fdfdffd_dfffrffrdefdff')

    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 3: Set New Password
  // const setNewPassword = async (emailToUse: string) => {
  //   // Alert.alert("🔍 Email Sent for Reset:", emailToUse);

  //   if (!password || !confirmPassword) {
  //     setPasswordError('Both fields are required');

  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     setPasswordError('Passwords do not match');

  //     return;
  //   }
  //   // Alert.alert("🔍 Email Sent for Reset:", emailToUse);
    
  //   try {
  //     setLoading(true);
  //     const res = await resetPassword(emailToUse, password);
  //   Alert.alert("🔍 Email Sent for Reset:", emailToUse, password);

  //     if (res.success) {
  //       Toast.show({ type: 'success', text1: 'Password updated successfully!' });
  //       navigation.navigate(ScreenNameEnum.LoginScreen);
  //     } else {
  //       Toast.show({ type: 'error', text1: res.message });
  //     }
  //   } catch (err) {
  //     console.log('Set Password Error:', err);
  //     Toast.show({ type: 'error', text1: 'Something went wrong' });
  //   } finally {
  //     setLoading(false);
  //   }

  // };

//  Password Reset 
const changeOldPassword = async (password ,confirmPassword ,emailToUse: string) => {
  // Input validation
  console.log(password , confirmPassword , 'newXChange_Password')
  if (!password || !confirmPassword) {
    setPasswordError('Both fields are required');
    return;
  }
  if (password !== confirmPassword) {
    setPasswordError('Passwords do not match');
    return;
  }

  try {
    setLoading(true);
    
    
    const res = await resetPassword(emailToUse, password);
    console.log(emailToUse , password , "passwordHere__from_user")
     if (res.success) {
      showToast({ message: res.success, green: true });

      setTimeout(() => {
      navigation.navigate(ScreenNameEnum.LoginScreen);
        
      }, 1000);
    } else {
      showToast({ message: res.message || 'Reset failed', green: false });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
    // Toast.show({ type: 'error', text1: 'Unexpected error occurred' });
    showToast({ message: 'Unexpected error occurred', green: false });


  } finally {
    setLoading(false);
  }
};  


  return {
  email,
  setEmail,
  handleIdentityText,
  emailError,
  loading,
  handleSendResetOTP,
  otp,
  handleOtpText,
  otpError,
  handleVerifyOTP,
  password,
  confirmPassword,
  handlePassText,
  handleConfirmPassText,
  passwordError,
  changeOldPassword,

  };
};

export default usePasswordReset;
