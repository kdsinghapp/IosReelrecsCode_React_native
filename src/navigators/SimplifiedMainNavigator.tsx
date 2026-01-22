import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import ScreenNameEnum from '../routes/screenName.enum';

// Auth screens
import Welcome from '../screen/Auth/welcome/Welcome';
import Login from '../screen/Auth/login/Login';
import Signup from '../screen/Auth/signup/Signup';

// Main tab navigator
import SimplifiedTabNavigator from './SimplifiedTabNavigator';

// Additional screens that stack on top of tabs
import MovieDetailScreen from '../screen/BottamTab/discover/movieDetail/MovieDetailScreen';
import OtherProfile from '../screen/BottamTab/home/otherProfile/OtherProfile';
import WoodsScreen from '../screen/BottamTab/ranking/woodsScreen/WoodsScreen';
import EditProfile from '../screen/BottamTab/profile/editProfile/EditProfile';
import MainSetting from '../screen/BottamTab/profile/setting/MainSetting';
import Notification from '../screen/BottamTab/home/homeScreen/Notification/Notification';

const Stack = createNativeStackNavigator();

const SimplifiedMainNavigator = React.memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNameEnum.WELCOME}
      screenOptions={{
        headerShown: false,
        // Simple animations
        animation: Platform.select({
          ios: 'slide_from_right',
          android: 'slide_from_right',
        }),
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Auth Flow */}
      <Stack.Screen name={ScreenNameEnum.WELCOME} component={Welcome} />
      <Stack.Screen name={ScreenNameEnum.LoginScreen} component={Login} />
      <Stack.Screen name={ScreenNameEnum.SignUpScreen} component={Signup} />

      {/* Main App - Tabs */}
      <Stack.Screen
        name={ScreenNameEnum.TabNavigator}
        component={SimplifiedTabNavigator}
        options={{
          gestureEnabled: false, // Disable swipe back from tabs
        }}
      />

      {/* Modal/Detail Screens - Stack on top of tabs */}
      <Stack.Screen
        name={ScreenNameEnum.MovieDetailScreen}
        component={MovieDetailScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={ScreenNameEnum.OtherProfile}
        component={OtherProfile}
      />
      <Stack.Screen
        name={ScreenNameEnum.WoodsScreen}
        component={WoodsScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name={ScreenNameEnum.EditProfile}
        component={EditProfile}
      />
      <Stack.Screen
        name={ScreenNameEnum.MainSetting}
        component={MainSetting}
      />
      <Stack.Screen
        name={ScreenNameEnum.Notification}
        component={Notification}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
});

SimplifiedMainNavigator.displayName = 'SimplifiedMainNavigator';

export default SimplifiedMainNavigator;