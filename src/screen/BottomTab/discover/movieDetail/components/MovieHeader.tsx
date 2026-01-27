import React, { memo } from 'react';
import { HeaderCustom, CustomStatusBar } from '@components';
import imageIndex from '@assets/imageIndex';
import ScreenNameEnum from '@routes/screenName.enum';

interface MovieHeaderProps {
  navigation: any;
}

const MovieHeader = ({ navigation }: MovieHeaderProps) => {
  return (
    <>
      <CustomStatusBar />
      <HeaderCustom
        backIcon={imageIndex.backArrow}
        rightIcon={imageIndex.search}
        onRightPress={() => navigation.navigate(ScreenNameEnum.WoodsScreen, { type: 'movie' })}
        onBackPress={() => navigation.goBack()}
      />
    </>
  );
};

export default memo(MovieHeader);
