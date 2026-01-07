import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import RankingScreen from '../screen/BottamTab/ranking/rankingScreen/RankingScreen';
import ScreenNameEnum from '../routes/screenName.enum';
import WoodsScreen from '../screen/BottamTab/ranking/woodsScreen/WoodsScreen';
import MovieDetailScreen from '../screen/BottamTab/discover/movieDetail/MovieDetailScreen';
import OtherProfile from '../screen/BottamTab/home/otherProfile/OtherProfile';
import SearchMovieDetail from '../screen/BottamTab/discover/movieDetail/SearchMovieDetail';
import YoutubePlayerScreen from '../component/card/feedCard/YoutubePlayerScreen';
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
