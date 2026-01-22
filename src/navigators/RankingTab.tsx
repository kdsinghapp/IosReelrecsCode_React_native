import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
 import YoutubePlayerScreen from '../component/card/feedCard/YoutubePlayerScreen';
import RankingScreen from '../screen/BottomTab/ranking/rankingScreen/RankingScreen';
import ScreenNameEnum from '../routes/screenName.enum';
import MovieDetailScreen from '../screen/BottomTab/discover/movieDetail/MovieDetailScreen';
import OtherProfile from '../screen/BottomTab/home/otherProfile/OtherProfile';
import WoodsScreen from '../screen/BottomTab/ranking/woodsScreen/WoodsScreen';
import SearchMovieDetail from '../screen/BottomTab/discover/movieDetail/SearchMovieDetail';
 const Stack = createNativeStackNavigator();



const RankingTab: FunctionComponent = () => {
  const _routes = [
    { name: ScreenNameEnum.RankingScreen, Component: RankingScreen },
    { name: ScreenNameEnum.MovieDetailScreen, Component: MovieDetailScreen },
    { name: ScreenNameEnum.OtherProfile, Component: OtherProfile },
    { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },
    { name: ScreenNameEnum.SearchMovieDetail, Component: SearchMovieDetail },
    { name: ScreenNameEnum.YoutubePlayerScreen, Component:YoutubePlayerScreen  },

    // more routes...
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',

      }}>
      {_routes.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.Component}
        />
      ))}

    </Stack.Navigator>
  );
};

export default RankingTab;
