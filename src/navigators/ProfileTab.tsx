import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
import ProfileScreen from '../screen/BottomTab/profile/profileScreen/ProfileScreen';
import EditProfile from '../screen/BottomTab/profile/editProfile/EditProfile';
import Followers from '../screen/BottomTab/profile/followerTab/Followers';
import MainSetting from '../screen/BottomTab/profile/setting/MainSetting';
import AccountSetting from '../screen/BottomTab/profile/setting/AccountSetting';
import PlaybackSetting from '../screen/BottomTab/profile/setting/PlaybackSetting';
import HelpSetting from '../screen/BottomTab/profile/setting/HelpSetting';
import SettingLogOut from '../screen/BottomTab/profile/setting/SettingLogOut';
import ChangePassSetting from '../screen/BottomTab/profile/setting/ChangePassSetting';
import PrivacySetting from '../screen/BottomTab/profile/setting/PrivacySetting';
import HelpMessage from '../component/settingHelp/helpMessage';
import WatchSaveUser from '../screen/BottomTab/home/watchSaveUser/WatchSaveUser';
import OtherWantPrfofile from '../screen/BottomTab/home/otherTaingPrfofile/OtherWantPrfofile';
import OtherTaingPrfofile from '../screen/BottomTab/home/otherTaingPrfofile/OtherTaingPrfofile';
import GroupSearch from '../screen/BottomTab/watch/watchScreen/GroupSearch';
import StreamService from '../screen/BottomTab/profile/setting/StreamService';
import FeatureRequest from '../screen/BottomTab/profile/setting/FeatureRequest';
import MovieDetailScreen from '../screen/BottomTab/discover/movieDetail/MovieDetailScreen'
import WoodsScreen from '../screen/BottomTab/ranking/woodsScreen/WoodsScreen';
import SearchMovieDetail from '../screen/BottomTab/discover/movieDetail/SearchMovieDetail';
import OtherProfile from '../screen/BottomTab/home/otherProfile/OtherProfile';
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
