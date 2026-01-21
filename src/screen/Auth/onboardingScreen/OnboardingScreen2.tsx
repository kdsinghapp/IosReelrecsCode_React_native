import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Dimensions, StyleSheet, ImageBackground } from "react-native";
import imageIndex from "../../../assets/imageIndex";
 import useWelcome from "../../../screen/Auth/welcome/useWelcome";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { Button, CustomStatusBar } from "../../../component";
import CustomText from "../../../component/common/CustomText";
import font from "../../../theme/font";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

// Calculate sizes for 3 columns
const HORIZONTAL_PADDING = 15;
const POSTER_GAP = 9;
const totalAvailableWidth = width - (HORIZONTAL_PADDING * 2);
const columnWidth = (totalAvailableWidth - (POSTER_GAP * 2)) / 3;
const posterHeight = columnWidth * 1.45; // Movie poster aspect ratio
// SingleMovie7 2
// Movie Posters - 3 columns with 4 posters each
const moviePosters = [
  [imageIndex.SingleMovi,  imageIndex.SingleMovie4    ,imageIndex.SingleMovie7   ,imageIndex.LargePortraitPoster ],
  [ imageIndex.SingleMovieSlide2   ,  imageIndex.SingleMovie5  ,   imageIndex.SingleMovie8   , imageIndex.LargePortraitPoster1 ],
  [imageIndex.SingleMovieSlide3   ,   imageIndex.SingleMovie6    ,  imageIndex.SingleMovie9  , imageIndex.LargePortraitPoster2],
];

const OnboardingScreen2 = () => {
  const { navigation } = useWelcome();
  const token = useSelector((state: RootState) => state.auth.token);

  const goToInitialScreen = () => {
     
      navigation.navigate(ScreenNameEnum.LoginScreen);
    
  };

  return (
    <ImageBackground 
    source={imageIndex.Introduction}
    
    style={styles.container}>
      <CustomStatusBar backgroundColor="#0A1628" barStyle="light-content" />
      
       <View style={styles.posterWrapper}>
        {moviePosters.map((column, columnIndex) => {
          const isUpward = columnIndex === 0; // Only middle column goes up
          return (
            <FloatingColumn
              key={`column-${columnIndex}`}
              posters={column}
              columnIndex={columnIndex}
              isUpward={isUpward}
            />
          );
        })}
      </View>
       <LinearGradient
        colors={[
          "rgba(10, 22, 40, 0)",
          "rgba(10, 22, 40, 0.7)",
          "rgba(10, 22, 40, 0.95)",
          "rgba(10, 22, 40, 1)"
        ]}
        locations={[0, 0.8, 0.99, 1]}
        style={styles.gradientOverlay}
      />

      {/* Large Center Play Button */}
      <View style={{
          position: 'absolute',
     left: 0,
    right: 0,
    bottom:220,
       zIndex: 5, 
       alignItems:"center"
      }}>
  <View style={styles.playButtonShadow}>
          <Image 
            source={imageIndex.WatchNowButton2} 
            style={styles.largePlayIcon}
            resizeMode="contain"
          />
        </View>
</View>
      <View style={{
          position: 'absolute',
     left: 0,
    right: 0,
    bottom:100,
       zIndex: 5, 
       alignItems:"center"
      }}>
  <View style={styles.playButtonShadow}>
          <CustomText
          size={18}
          color="#FFFFFF"
          style={styles.heading}
          font={font.PoppinsBold}
        >
          The more you rate, the sharper your recommendations get
        </CustomText>
        </View>
</View>
      {/* Bottom Content */}
      <View style={styles.bottomContent}>
             
       

 
        <Button
          textStyle={{ color: '#FFFFFF', fontFamily: font.PoppinsBold }}
          title="Next"
          onPress={goToInitialScreen}
          buttonStyle={styles.button}
        />
        </View>
    
    </ImageBackground>
  );
};

// Floating Column Component with Animation
interface FloatingColumnProps {
  posters: any[];
  columnIndex: number;
  isUpward: boolean;
}

const FloatingColumn: React.FC<FloatingColumnProps> = ({ posters, columnIndex, isUpward }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const direction = isUpward ? -5 : 5;

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
           toValue: direction,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY, isUpward]);

  return (
    <Animated.View
      style={[
        styles.column,
        {
          left: HORIZONTAL_PADDING + (columnIndex * (columnWidth + POSTER_GAP)),
          transform: [{ translateY }],
        },
      ]}
    >
      {posters.map((poster: any, posterIndex: number) => (
        <View key={`poster-${columnIndex}-${posterIndex}`} style={styles.posterContainer}>
          <Image
            source={poster}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   },
  posterWrapper: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    height: height * 0.68,
    overflow: "hidden",
  },
  column: {
    position: "absolute",
    width: columnWidth,
    flexDirection: "column",
    top: 0,
  },
  posterContainer: {
    position: 'relative',
    marginBottom: POSTER_GAP,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a2a3a',
  },
  poster: {
    width: columnWidth,
    height: posterHeight,
  },
  playIconOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(53, 199, 90, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPlayIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFFFFF',
  },
  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 10,
    bottom:115,
    left: 0,
  },
  centerPlayButton: {
    position: 'relative',
    top: 0,
    alignSelf: 'center',
    zIndex: 10, 
    bottom:0
  },
  playButtonShadow: {
    shadowColor: '#35C75A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  largePlayIcon: {
    width: 68,
    height: 68,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
     zIndex: 5,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#35C75A',
    borderRadius: 8,
    paddingVertical: 16,
  },
});

export default OnboardingScreen2;
