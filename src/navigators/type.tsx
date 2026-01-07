import ScreenNameEnum from "../routes/screenName.enum";

// navigation/types.ts
export type DiscoverTabParamList = {
  [ScreenNameEnum.DiscoverScreen]: { isSelectList: string; type: string };
};

export type RootStackParamList = {
  [ScreenNameEnum.DiscoverTab]: {
    screen: keyof DiscoverTabParamList;
    params?: DiscoverTabParamList[keyof DiscoverTabParamList];
  };
   [ScreenNameEnum.MovieDetailScreen]: { item: any };
    [ScreenNameEnum.OtherProfile]: { item: any };
    [ScreenNameEnum.WoodsScreen]: never;

  // other root stack screens...
};
