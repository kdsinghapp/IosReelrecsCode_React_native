import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import imageIndex from '../../../assets/imageIndex';
import font from '../../../theme/font';
import { Button } from '../../../component';
import ScreenNameEnum from '../../../routes/screenName.enum';

const { width, height } = Dimensions.get('window');

/* ----------------------------------
   BACKGROUND POSTERS DATA
-----------------------------------*/
const moviePosters = [
  [
    imageIndex.welcomePost1,
    imageIndex.welcomePost2,
    imageIndex.welcomePost3,
    imageIndex.welcomePost4,
    imageIndex.welcomePost5,
    imageIndex.welcomePost6,
  ],
  [
    imageIndex.welcomePost7,
    imageIndex.welcomePost8,
    imageIndex.welcomePost9,
    imageIndex.welcomePost10,
    imageIndex.welcomePost11,
    imageIndex.welcomePost12,
  ],
  [
    imageIndex.welcomePost13,
    imageIndex.welcomePost14,
    imageIndex.welcomePost15,
    imageIndex.welcomePost16,
    imageIndex.welcomePost17,
    imageIndex.welcomePost18,
  ],
  [
    imageIndex.welcomePost19,
    imageIndex.welcomePost20,
    imageIndex.welcomePost21,
    imageIndex.welcomePost21,
    imageIndex.welcomePost22,
  ],
];

/* ----------------------------------
   ONBOARDING DATA
-----------------------------------*/
const data = [
  {
    id: '1',
    image: imageIndex.step1,
    title: 'Rate 5 titles',
    title1: 'to unlock Rec Scores',
    desc:
      'A Rec Score is the projected score of how much we think a user will like a title.',
    img: imageIndex.WatchNowButton,
  },
  {
    id: '2',
    image: imageIndex.step1,
       title: 'Rate 5 titles',
    title1: 'to unlock Rec Scores',
    desc:
      'Your ratings help us fine-tune recommendations just for you.',
    img: imageIndex.WatchNowButton2,
  },
  {
    id: '3',
    image: imageIndex.step3,
    title: 'The more you rate, the smarter it gets',
    desc: '',
    img: imageIndex.WatchNowButton2,
  },
];

/* ----------------------------------
   CONSTANTS FOR BACKGROUND
-----------------------------------*/
const columnWidth = 120;
const posterHeight = 170;
const posterGap = 12;
const horizontalGap = 14;

/* ----------------------------------
   FLOATING COLUMN COMPONENT
-----------------------------------*/
const FloatingColumn = ({ posters, columnIndex, isAtTop }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const direction = isAtTop ? -55 : 55;

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: direction,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY, isAtTop]);

  return (
    <Animated.View
      style={[
        styles.column,
        {
          left: columnIndex * (columnWidth + horizontalGap),
          top: isAtTop ? 100 : 0,
          transform: [{ translateY }],
        },
      ]}
    >
      {posters.map((poster: any, index: number) => (
        <Image
          key={index}
          source={poster}
          style={styles.bgPoster}
          resizeMode="cover"
        />
      ))}
    </Animated.View>
  );
};

/* ----------------------------------
   MAIN SCREEN
-----------------------------------*/
const OnboardingScreen = () => {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  const navigation = useNavigation();

  const onNext = () => {
    if (index < data.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation.navigate(ScreenNameEnum.OnboardingScreen2);
    }
  };
const translateX = useRef(new Animated.Value(-80)).current; // thoda hi left

useEffect(() => {
  translateX.setValue(-10); // reset LEFT only

  Animated.timing(translateX, {
    toValue: 0,
    duration: 1000, // slow
    useNativeDriver: true,
  }).start();
}, []); // 👈 sirf item change pe


  return (
    <View style={styles.root}>
      {/* 🔹 Animated Background */}
      <View style={styles.posterWrapper}>
        {moviePosters.map((column, i) => (
          <FloatingColumn
            key={i}
            posters={column}
            columnIndex={i}
            isAtTop={i % 2 === 0}
          />
        ))}
      </View>

      {/* 🔹 Gradient Overlay */}
<LinearGradient
  colors={[
    'rgba(0,108,157,0.35)',
    'rgba(0,24,35,0.75)',
  ]}
 
        locations={[0, 0.5, 0.2, 0]}
  style={StyleSheet.absoluteFill}
/>


      {/* 🔹 Foreground Content */}
      <View style={styles.content}>
        <FlatList
          ref={ref}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View style={styles.slide} 
 
            >
              <Animated.View
  style={[
    styles.slide,
    {
      transform: [{ translateX }],
    },
  ]}
>

              <Image source={item.image} 
               style={styles.poster} />

    </Animated.View>
    <View style={{
  alignItems:"center"
  }}>
              <Image source={item.img} style={styles.playBtn} />

              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.title}>{item.title1}</Text>
                {!!item.desc && (
                  <Text style={styles.desc}>{item.desc}</Text>
                )}
              </View>
               </View>
            </View>
          )}
        />
<LinearGradient
  colors={[
    'rgba(0,108,157,0.35)',
    'rgba(0,24,35,0.75)',
  ]}
      // colors={[
      //     "rgba(10, 22, 40, 0)",
      //     "rgba(10, 22, 40, 0.7)",
      //     "rgba(10, 22, 40, 0.95)",
      //     "rgba(10, 22, 40, 1)"
      //   ]}
        locations={[10, 0.9, 0.9, 10]}
 />



        <View style={styles.btnWrap}>
          <Button
            title="Next"
            onPress={onNext}
            buttonStyle={{
              backgroundColor: index === data.length - 1 ? '#35C75A' : '#00A8F5',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

/* ----------------------------------
   STYLES
-----------------------------------*/
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  posterWrapper: {
    position: 'absolute',
    width: width + columnWidth,
    height: '100%',
    top: -120,
    left: -(columnWidth / 2),
    flexDirection: 'row',
  },

  column: {
    position: 'absolute',
    width: columnWidth,
    alignItems: 'center',
  },

  bgPoster: {
    width: '100%',
    height: posterHeight,
    marginBottom: posterGap,
    borderRadius: 12,
  },

  content: {
    flex: 1,
    zIndex: 10,
  },

  slide: {
    width,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 90 : 90,
  },

  poster: {
    width: width * 0.9,
    height: height * 0.5,
    resizeMode: 'stretch',
  },

  playBtn: {
    width: 69,
    height: 69,
    },

  textBox: {
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
