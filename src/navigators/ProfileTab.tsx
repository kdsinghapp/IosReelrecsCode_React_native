import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
import ProfileScreen from '../screen/BottamTab/profile/profileScreen/ProfileScreen';
import EditProfile from '../screen/BottamTab/profile/editProfile/EditProfile';
import Followers from '../screen/BottamTab/profile/followerTab/Followers';
import MainSetting from '../screen/BottamTab/profile/setting/MainSetting';
import AccountSetting from '../screen/BottamTab/profile/setting/AccountSetting';
import PlaybackSetting from '../screen/BottamTab/profile/setting/PlaybackSetting';
import HelpSetting from '../screen/BottamTab/profile/setting/HelpSetting';
import SettingLogOut from '../screen/BottamTab/profile/setting/SettingLogOut';
import ChangePassSetting from '../screen/BottamTab/profile/setting/ChangePassSetting';
import PrivacySetting from '../screen/BottamTab/profile/setting/PrivacySetting';
import HelpMessage from '../component/settingHelp/helpMessage';
import WatchSaveUser from '../screen/BottamTab/home/watchSaveUser/WatchSaveUser';
import OtherWantPrfofile from '../screen/BottamTab/home/otherTaingPrfofile/OtherWantPrfofile';
import OtherTaingPrfofile from '../screen/BottamTab/home/otherTaingPrfofile/OtherTaingPrfofile';
import GroupSearch from '../screen/BottamTab/watch/watchScreen/GroupSearch';
import StreamService from '../screen/BottamTab/profile/setting/StreamService';
import FeatureRequest from '../screen/BottamTab/profile/setting/FeatureRequest';
import MovieDetailScreen from '../screen/BottamTab/discover/movieDetail/MovieDetailScreen'
import WoodsScreen from '../screen/BottamTab/ranking/woodsScreen/WoodsScreen';
import SearchMovieDetail from '../screen/BottamTab/discover/movieDetail/SearchMovieDetail';
import OtherProfile from '../screen/BottamTab/home/otherProfile/OtherProfile';
const Stack = createNativeStackNavigator();

const ProfileTab: FunctionComponent = () => {
  const _routess = [
    { name: ScreenNameEnum.ProfileScreen, Component: ProfileScreen },
    { name: ScreenNameEnum.EditProfile, Component: EditProfile },
    { name: ScreenNameEnum.Followers, Component: Followers },
    { name: ScreenNameEnum.MainSetting, Component: MainSetting },
    { name: ScreenNameEnum.AccountSetting, Component: AccountSetting },
    { name: ScreenNameEnum.PlaybackSetting, Component: PlaybackSetting },
    { name: ScreenNameEnum.PrivacySetting, Component: PrivacySetting },
    { name: ScreenNameEnum.HelpSetting, Component: HelpSetting },
    { name: ScreenNameEnum.SettingLogOut, Component: SettingLogOut },
    { name: ScreenNameEnum.ChangePassSetting, Component: ChangePassSetting },
    { name: ScreenNameEnum.HelpMessage, Component: HelpMessage },
    { name: ScreenNameEnum.GroupSearch, Component: GroupSearch },
    { name: ScreenNameEnum.StreamService, Component: StreamService },
    { name: ScreenNameEnum.FeatureRequest, Component: FeatureRequest },
    { name: ScreenNameEnum.MovieDetailScreen, Component: MovieDetailScreen },
    { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },
    { name: ScreenNameEnum.OtherTaingPrfofile, Component: OtherTaingPrfofile },
    { name: ScreenNameEnum.WatchSaveUser, Component: WatchSaveUser },  
    { name: ScreenNameEnum.OtherWantPrfofile, Component: OtherWantPrfofile }, 
    { name: ScreenNameEnum.SearchMovieDetail, Component: SearchMovieDetail },
    { name: ScreenNameEnum.OtherProfile, Component: OtherProfile },
    
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

export default ProfileTab;
