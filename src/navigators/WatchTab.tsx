import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
import WatchScreen from '../screen/BottomTab/watch/watchScreen/WatchScreen';
import OtherProfile from '../screen/BottomTab/home/otherProfile/OtherProfile';
import MovieDetailScreen from '../screen/BottomTab/discover/movieDetail/MovieDetailScreen';
import WoodsScreen from '../../woodmovieseaach';
import GroupSearchScreen from '../screen/BottomTab/watch/watchScreen/GroupSearchScreen';
import WatchWithFrind from '../screen/BottomTab/watch/watchScreen/WatchWithFrind';
import SearchMovieDetail from '../screen/BottomTab/discover/movieDetail/SearchMovieDetail';
 
const Stack = createNativeStackNavigator();

const WatchTab: FunctionComponent = () => {
  const _routess = [
    { name: ScreenNameEnum.WatchScreen, Component: WatchScreen },
    { name: ScreenNameEnum.OtherProfile, Component: OtherProfile },
    { name: ScreenNameEnum.MovieDetailScreen, Component: MovieDetailScreen },
    { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },
    { name: ScreenNameEnum.GroupSearch, Component: GroupSearchScreen },  
    { name: ScreenNameEnum.WatchWithFrind , Component:WatchWithFrind},  
    { name: ScreenNameEnum.SearchMovieDetail, Component: SearchMovieDetail },

    // { name: ScreenNameEnum.WatchWithFrind , Component:wa},  
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
 contentStyle: { backgroundColor: '#ff0404ff' }, 
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

export default WatchTab;
