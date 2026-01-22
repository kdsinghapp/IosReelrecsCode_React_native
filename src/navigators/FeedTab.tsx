import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
import OtherProfile from '../screen/BottomTab/home/otherProfile/OtherProfile';
import HomeScreen from '../screen/BottomTab/home/homeScreen/HomeScreen'
import OtherTaingPrfofile from '../screen/BottomTab/home/otherTaingPrfofile/OtherTaingPrfofile';
import WatchSaveUser from '../screen/BottomTab/home/watchSaveUser/WatchSaveUser';
import OtherWantPrfofile from '../screen/BottomTab/home/otherTaingPrfofile/OtherWantPrfofile';
import Followers from '../screen/BottomTab/profile/followerTab/Followers';
import MovieDetailScreen from '../screen/BottomTab/discover/movieDetail/MovieDetailScreen';
import WoodsScreen from '../screen/BottomTab/ranking/woodsScreen/WoodsScreen';
import SearchMovieDetail from '../screen/BottomTab/discover/movieDetail/SearchMovieDetail';
const Stack = createNativeStackNavigator();



const FeedTab: FunctionComponent = () => {
  const _routess = [
    { name: ScreenNameEnum.HOME_SCREEN, Component: HomeScreen },
    { name: ScreenNameEnum.OtherProfile, Component: OtherProfile },
    { name: ScreenNameEnum.Followers, Component: Followers },
    { name: ScreenNameEnum.OtherTaingPrfofile, Component: OtherTaingPrfofile },  //PROFILE1
    { name: ScreenNameEnum.WatchSaveUser, Component: WatchSaveUser },   // PROFILE3
    { name: ScreenNameEnum.OtherWantPrfofile, Component: OtherWantPrfofile },   // PROFILE2
    { name: ScreenNameEnum.MovieDetailScreen, Component: MovieDetailScreen },
    { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },

    { name: ScreenNameEnum.SearchMovieDetail, Component: SearchMovieDetail },


    // more routes...
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',

      }}>
      {_routess.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.Component}
        />
      ))}

    </Stack.Navigator>
  );
};

export default FeedTab;
