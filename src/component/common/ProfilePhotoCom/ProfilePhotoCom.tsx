// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import ScreenNameEnum from '@routes/screenName.enum'
// import { Color } from '@theme/color'
// import { useNavigation } from '@react-navigation/native'

// const ProfilePhotoCom = ({ item , navigationScreen , uri , imageUri }) => {
// const navigation = useNavigation();
//  const renderImageSource = () => {
//     if (imageUri) {
//       return { uri: imageUri };
//     } else if (uri) {
//       return { uri: item.avatar };
//     } else {
//       return item.avatar;
//     }
//   };
//   return (
//    <TouchableOpacity style={{ marginRight: 12,}}
//   onPress={() => {
//     if (navigationScreen) {
//       navigation.navigate(navigationScreen);
//     } else {
//       navigation.navigate(ScreenNameEnum.OtherProfile);
//     }
//   }}
// >
//   <View style={styles.avatarContainer}>
//     {/* {uri ?

//     <Image source={{ uri :  item.avatar}} style={styles.avatar} />
//      :   <Image source={item.avatar} style={styles.avatar} />
//     } */}

// <Image source={renderImageSource()} style={styles.avatar} />


//     {item.online && <View style={styles.onlineIndicator} />}
//   </View>
// </TouchableOpacity>
//   )
// }

// export default ProfilePhotoCom

// const styles = StyleSheet.create({
//       avatarContainer: {
//     position: 'relative',

//     // Adjust width/height if needed to match your avatar size
//   },
//     avatar: {
//     width: 60,  // adjust as needed
//     height: 60, // adjust as needed
//     borderRadius: 35, // half of width/height to make it circular
//   },
//    onlineIndicator: {
//      position: 'absolute',
//      right: 0,
//      top: 2,
//      width: 14,  // size of the indicator
//      height: 14, // size of the indicator
//      borderRadius: 8, // half of width/height to make it circular
//      backgroundColor: 'lightgreen',
//      borderWidth: 2.5,
//      borderColor: Color.background, // or whatever your background color is
//    },
// })



import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '@routes/screenName.enum';
import { Color } from '@theme/color';
import FastImage from 'react-native-fast-image';

interface Props {
  item?: any;
  navigationScreen?: string;
  imageUri?: string; // Use this if directly passing full URL
}

const ProfilePhotoCom: React.FC<Props> = ({ item, navigationScreen, imageUri }) => {
  const navigation = useNavigation();

  const renderImageSource = () => {
    if (imageUri) {
      return { uri: imageUri };
    } else if (item?.avatar && typeof item.avatar === 'string') {
      return { uri: item.avatar };
    } else {
      return item?.avatar; // In case it's a static require()
    }
  };
  return (
    <TouchableOpacity
      style={{ marginRight: 0 }}
      onPress={() => {
        navigation.navigate(navigationScreen || ScreenNameEnum.OtherProfile, { item: item });
      }}
    >
      <View style={styles.avatarContainer}>

        {/* <Image source={renderImageSource()} style={styles.avatar} />
         */}
         <FastImage
          style={styles.avatar}
          source={{
            ...renderImageSource(),
            priority: FastImage.priority.low, // 👈 Low priority (since profile image small)
            cache: FastImage.cacheControl.web // 👈 Cache permanently
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        {item?.online && <View style={styles.onlineIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

export default ProfilePhotoCom;

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'lightgreen',
    borderWidth: 2.5,
    borderColor: Color.background,
  },
});
