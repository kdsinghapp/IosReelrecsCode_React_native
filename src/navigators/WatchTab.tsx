import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
import OtherProfile from '../screen/BottamTab/home/otherProfile/OtherProfile';
 import MovieDetailScreen from '../screen/BottamTab/discover/movieDetail/MovieDetailScreen';
 import WatchScreen from '../screen/BottamTab/watch/watchScreen/WatchScreen';
import GroupSearch from '../screen/BottamTab/watch/watchScreen/GroupSearch';
import WatchWithFrind from '../screen/BottamTab/watch/watchScreen/WatchWithFrind';
 import WoodsScreen from '../screen/BottamTab/ranking/woodsScreen/WoodsScreen';
import SearchMovieDetail from '../screen/BottamTab/discover/movieDetail/SearchMovieDetail';
const Stack = createNativeStackNavigator();

const WatchTab: FunctionComponent = () => {
  const _routess = [
    { name: ScreenNameEnum.WatchScreen, Component: WatchScreen },
    { name: ScreenNameEnum.OtherProfile, Component: OtherProfile },
    { name: ScreenNameEnum.MovieDetailScreen, Component: MovieDetailScreen },
    { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },
    { name: ScreenNameEnum.GroupSearch, Component: GroupSearch },  
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
