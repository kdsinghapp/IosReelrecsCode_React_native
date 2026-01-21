import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Platform,
} from 'react-native';

import imageIndex from '../../../assets/imageIndex';
import font from '../../../theme/font';
import { Button } from '../../../component';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';

const { width, height } = Dimensions.get('window');

const data = [
   {
    id: '1',
    image: imageIndex.step1,
    title: 'Rate 5 titles to unlock Rec Scores',
    desc: 'a Rec Score is the projected score of how much we think a user will like a title.',
          img: imageIndex.WatchNowButton

  },
   {
    id: '2',
    image: imageIndex.step2,
    title: 'Rate 5 titles to unlock Rec Scores',
    desc: 'a Rec Score is the projected score of how much we think a user will like a title.',
          img: imageIndex.WatchNowButton2

  },
   {
    id: '3',
    image: imageIndex.step3,
    title: 'The more you rate, the sharper your recommendations get',
    desc: '',
          img: imageIndex.WatchNowButton2

  },
 
];

const OnboardingScreen = () => {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
const nav  = useNavigation()
  const onNext = () => {
    if (index < data.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
    }
    nav.navigate(ScreenNameEnum.OnboardingScreen2)
  };

  return (
         
      <ImageBackground
        source={imageIndex.Introduction}
        style={styles.container}
      >
        <FlatList
          ref={ref}
          data={data}
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(e) => {
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {/* Poster */}
              <Image source={item.image} style={styles.poster} />

         

              {/* Play Button */}
              <Image
                source={item.img}
                style={styles.playBtn}
              />

              {/* Text */}
              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                {!!item.desc && <Text style={styles.desc}>{item.desc}</Text>}
              </View>
            </View>
          )}
        />

        {/* Button */}
        <View style={styles.btnWrap}>
          <Button
            title={index === 2 || index === 3  ? 'Next' : 'Next'}
            onPress={onNext}
             buttonStyle={{
              backgroundColor:
      index === 2 || index === 3 ? '#35C75A' : '#00A8F5',
            }}
          />
        </View>
      </ImageBackground>
   );
};

export default OnboardingScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
   },

  container: {
    flex: 1,
  },

  slide: {
    width,
    alignItems: 'center',
    paddingTop: Platform.OS === "ios" ? 70 : 58,
  },

  poster: {
    width: width * 0.9,
    height: height * 0.5,
    resizeMode: 'stretch',
  },
  playBtn: {
    width: 68,
    height: 68,
   },

  textBox: {
    marginTop: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  title: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: font.PoppinsBold,
  },

  desc: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: font.PoppinsRegular,
  },

  btnWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
