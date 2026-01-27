import React, { memo } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import imageIndex from '@assets/imageIndex';
import styles from '../style';

interface FooterNavProps {
  onEpisodesPress: () => void;
  onMoreLikeThisPress: () => void;
}

const FooterNav = ({ onEpisodesPress, onMoreLikeThisPress }: FooterNavProps) => {
  return (
    <View style={styles.footerNav}>
      <TouchableOpacity
        onPress={onEpisodesPress}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
      >
        <Text style={styles.linkText}>Episodes</Text>
        <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='cover' />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMoreLikeThisPress}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
      >
        <Text style={styles.linkText}>More like this</Text>
        <Image source={imageIndex.rightArrow} style={styles.arrowIcon} resizeMode='contain' />
      </TouchableOpacity>
    </View>
  );
};

export default memo(FooterNav);
