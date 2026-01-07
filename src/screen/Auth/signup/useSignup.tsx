import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkEmailExists, checkUsernameAvailability, confirmEmailCodeApi, loginUser_Api, sendOTPToEmail_GET, signupWithUsername } from '../../../redux/Api/authService';
import { RootStackParamList } from './SignupTypes';
import ScreenNameEnum from '../../../routes/screenName.enum';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/feature/authSlice';
import { Alert, BackHandler } from 'react-native';
const useSignup = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [toestMess, setToestMess] = useState(false)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dispatch = useDispatch();
  console.log(email, "screen")


  const toestMessFunc = () => {
    setToestMess(true);
    setTimeout(() => {
      setToestMess(false);
    }, 2000);
  }


  const handleIdentityText = (value: string) => {
    setEmail(value.trim());
    if (!value.trim()) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value.trim())) {
      setEmailError('Please enter a valid Email Address');
    } else {
      setEmailError('');
    }
  };
  const handlePassText = (value: string) => {
    setPassword(value);
    if (!value.trim()) {
      setPasswordError('Password is required');
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPassText = (value: string) => {
    setConfirmPassword(value);
    if (!value.trim()) {
      setConfirmPasswordError('Confirm Password is required');
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleVerify = async (code, email, password) => {
    const enteredCode = code.join('');
console.log(code,'Please_enter_4_digit_code')
    if (enteredCode.length !== 4) {
      Toast.show({ type: 'error', text1: 'Please enter 4 digit code' });
      return;
    }

    try {
      // const result = await confirmEmailCodeApi("jk@yopmail.com", enteredCode); // ✅ Dynamic email
      const result = await confirmEmailCodeApi(email, enteredCode);


      if (result.success) {
        Toast.show({ type: 'success', text1: 'Email verified   -  ✅' });
        toestMessFunc()
        // ✅ Navigate to next step
        setTimeout(() => {
           navigation.navigate(ScreenNameEnum.AddUsername, {
          email: email,
          password: password,
        });
        }, 1000);
       
      } else {
        Toast.show({ type: 'error', text1: result.message || 'Invalid OTP' });
      }
    } catch (error) {
      console.log('Verification error:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };


  const SignupUser = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // ✅ Step 1: Validate fields
    if (!trimmedEmail) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Invalid email');
      return;
    }

    if (!trimmedPassword) {
      setPasswordError('Password is required');
      return;
    } else if (trimmedPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password is required');
      return;
    } else if (confirmPassword !== trimmedPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 2: Check if email already exists
      const emailTaken = await checkEmailExists(trimmedEmail);
      if (emailTaken) {
        setEmailError('Email already exists');
        return;
      }

      // ✅ Step 3: Send OTP using GET API
      const result = await sendOTPToEmail_GET(trimmedEmail);

      if (!result.success) {
        Toast.show({ type: 'error', text1: result.message || 'Failed to send OTP' });
        return;
      }
      setToestMess(true)

      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.EmailVerify, {
          email: trimmedEmail,
          password: trimmedPassword,
        });
      }, 900);
      // Toast.show({ type: 'success', text1: 'OTP sent successfully  -  -  - ' });

    } catch (error) {
      console.log("Signup Error:", error);
      // Toast.show({ type: 'error', text1: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (usernameValue, email, password) => {
    console.log("handleFinalSignup  -  -  user name  - ", usernameValue);
    const trimmedUsername = usernameValue.trim();

    if (!trimmedUsername) {
      setUsernameError('Username is required');
      return;
    }
    try {
      setLoading(true);

      const check = await checkUsernameAvailability(trimmedUsername);
      console.log("✅ Username availability check:", check);

      if (!check.success) {
        Toast.show({ type: 'error', text1: check.message || 'Failed to check username' });
        return;
      }

      if (!check.available) {
        setUsernameError('Username already taken');
        return;
      }

      const result = await signupWithUsername(email, password, trimmedUsername);
      console.log("✅ Signup result:", result);

      if (!result?.success) {
        Toast.show({ type: 'error', text1: result?.message || 'Signup failed' });
        return;
      }
      //  dispatch(loginSuccess({ token: token }));

      Toast.show({ type: 'success', text1: 'Account created 🎉' });
      const token = await loginUser_Api(email, password);
      console.log(token, "login token")
      dispatch(loginSuccess({ token: token }));

      navigation.reset({
        index: 0,
        routes: [
          {
            name: ScreenNameEnum.StreamService,
            params: { fromSignUp: true },
          },
        ],
      });

          // ✅ Disable hardware back button
    BackHandler.addEventListener("hardwareBackPress", () => true);

      // navigation.navigate(ScreenNameEnum.StreamService, {
      //   fromSignUp: true,
      // })
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: ScreenNameEnum.TabNavigator }],
      // });
    } catch (error) {
      console.log("❌ Final Signup Error:", error);
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };
  return {
    email, setEmail, password, setPassword, confirmPassword, setConfirmPassword,
    emailError, passwordError, confirmPasswordError,
    handleIdentityText, handlePassText, handleConfirmPassText,
    SignupUser,
    loading,
    navigation,
    handleVerify,
    handleFinalSignup,
    username,
    setUsername,
    setToestMess, toestMess,
    usernameError,
  };
};

export default useSignup;
