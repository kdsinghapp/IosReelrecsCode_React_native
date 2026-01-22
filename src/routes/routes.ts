
  // import WoodsScreen from "../../woodmovieseaach";
import imageIndex from "../assets/imageIndex";
import DiscoverTab from "../navigators/DiscoverTab";
import FeedTab from "../navigators/FeedTab";
import ProfileTab from "../navigators/ProfileTab";
import RankingTab from "../navigators/RankingTab";
import TabNavigator from "../navigators/TabNavigator";
import WatchTab from "../navigators/WatchTab";
import AddUsername from "../screen/Auth/addUsername/AddUsername";
import EmailVerify from "../screen/Auth/addUsername/EmailVerify";
// import AddUsername from "../screen/Auth/addUsername/AddUsername";
// import AddUsername from "../screen/Auth/AddUsername/AddUsername";

// import EmailVerify from "../screen/Auth/addUsername/EmailVerify";
import Login from "../screen/Auth/login/Login";
import OnboardingScreen from "../screen/Auth/onboardingScreen/OnboardingScreen";
import OnboardingScreen2 from "../screen/Auth/onboardingScreen/OnboardingScreen2";
import NewPassword from "../screen/Auth/passwordReset/NewPassword";
import PasswordReset from "../screen/Auth/passwordReset/PasswordReset";
import Signup from "../screen/Auth/signup/Signup";
import Welcome from "../screen/Auth/welcome/Welcome";
import Notification from "../screen/BottomTab/home/homeScreen/Notification/Notification";
import StreamService from "../screen/BottomTab/profile/setting/StreamService";
import WoodsScreen from "../screen/BottomTab/ranking/woodsScreen/WoodsScreen";
import CreateGroupScreen from "../screen/BottomTab/watch/watchScreen/CreateGroupScreen ";
import WatchScreen from "../screen/BottomTab/watch/watchScreen/WatchScreen";
 
 import ScreenNameEnum from "./screenName.enum";


const _routes = () => {

  return {
    REGISTRATION_ROUTE: [
      { name: ScreenNameEnum.WELCOME, Component: Welcome },
       { name: ScreenNameEnum.LoginScreen, Component: Login },
       { name: ScreenNameEnum.SignUpScreen, Component: Signup },
       { name: ScreenNameEnum.PasswordReset, Component: PasswordReset },
       { name: ScreenNameEnum.AddUsername, Component: AddUsername },
      { name: ScreenNameEnum.TabNavigator, Component: TabNavigator },
      { name: ScreenNameEnum.EmailVerify, Component: EmailVerify },
      { name: ScreenNameEnum.NewPassword, Component: NewPassword },
      { name: ScreenNameEnum.Notification, Component: Notification},
      { name: ScreenNameEnum.WoodsScreen, Component: WoodsScreen },
      { name: ScreenNameEnum.CreateGroupScreen, Component: CreateGroupScreen },
      { name: ScreenNameEnum.WatchScreen, Component: WatchScreen },
      { name: ScreenNameEnum.StreamService, Component: StreamService },
      { name: ScreenNameEnum.OnboardingScreen, Component: OnboardingScreen },
      { name: ScreenNameEnum.OnboardingScreen2, Component: OnboardingScreen2 },
      
      // { name: ScreenNameEnum.WatchWithFrind, Component: WatchWithFrind },
      
    ],

    BOTTOMTAB_ROUTE: [
      {
        name: ScreenNameEnum.FeedTab,
        Component: FeedTab,
        label: "Feed",
        logo: imageIndex.home,
        logo1: imageIndex.homeActive,
      },
      {
        name: ScreenNameEnum.DiscoverTab,
        Component: DiscoverTab,
        label: "Discover",
        logo: imageIndex.discover,
        logo1: imageIndex.discoverActive,
      },
      {
        name: ScreenNameEnum.RankingTab,
        Component: RankingTab,
        label: "Ranking",
        logo: imageIndex.rankingTab,
        logo1: imageIndex.rankingActive,
      },
     
      {
        name: ScreenNameEnum.WatchTab,
        Component: WatchTab,
        label: "Watch+",
        logo: imageIndex.usersGroup,
        logo1: imageIndex.usersGroupActive,
      },
      {
        name: ScreenNameEnum.ProfileTab,
        Component: ProfileTab,
        label: "Profile",
        logo: imageIndex.UserProfile,
        logo1: imageIndex.profileActive,
      },


    ],
  };
};

export default _routes;
