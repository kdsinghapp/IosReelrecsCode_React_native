import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import { RootStackParamList } from './LoginTypes';
 import { loginSuccess } from '@redux/feature/authSlice';
 import NetInfo from "@react-native-community/netinfo";
import { loginUser_Api } from '@redux/Api/authService';
const useLogin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('sunny.2309@yahoo.in');
  const [password, setPassword] = useState<string>('test12345');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toestMess, setToestMess] = useState(false)
  const [toestMessColorGreen, setToestMessGreen] = useState(false)
  const [toastMessage, setToastMessage] = useState('');

  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Email Input Validation
  const handleIdentityText = (value: string): void => {
    setEmail(value.trim());
    if (!value.trim()) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value.trim())) {
      setEmailError('Please enter a valid Email Address');
    } else {
      setEmailError('');
    }
  };

  // Password Input Validation
  const handlePassText = (value: string): void => {
    setPassword(value);
    if (!value.trim()) {
      setPasswordError('Password is required');
    } else if (value.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };
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

  // ✅ LOGIN FUNCTION
  const LoginFunction = async (): Promise<void> => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
     // 🔴 Basic Validation
    if (!trimmedEmail || !trimmedPassword) {
      // Alert.alert('Error', 'Email AND  Password SEND BOTH are required');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid Email Address');
      return;
    }

    if (trimmedPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
 const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      toestMessFunc({ message: 'No Internet Connection ❌' });
      setLoading(false);
      return;
    }
       const token = await loginUser_Api(trimmedEmail, trimmedPassword);
      console.log(token, "login token")
      dispatch(loginSuccess({ token: token }));
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        toestMessFunc({ green: true, message: 'Login Success ' });

        // ✅ Navigate only when login is successful
        setTimeout(() => {
          navigation.replace('TabNavigator');

        }, 2000);
        // Reset
        setEmail('');
        setPassword('');
      } else {
        toestMessFunc({ message: 'Invalid Credentials ❌' });

        setEmailError('Invalid Email or Password');
        setPasswordError('Invalid Email or Password');  
      }
    } catch (error) {
      //     
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };



  return {
    navigation,
    LoginFunction,
    loading,
    handleIdentityText,
    handlePassText,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    email,
    setEmail,
    password,
    setPassword,
    toestMess, setToestMess,
    toestMessColorGreen, setToestMessGreen,
    toastMessage, setToastMessage,
  };
};

export default useLogin;
