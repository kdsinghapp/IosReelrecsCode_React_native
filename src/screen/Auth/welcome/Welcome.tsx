import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Dimensions, StyleSheet } from "react-native";
import imageIndex from "../../../assets/imageIndex";
import { Color } from "../../../theme/color";
import useWelcome from "../../../screen/Auth/welcome/useWelcome";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { Button, CustomStatusBar } from "../../../component";
import CustomText from "../../../component/common/CustomText";
import font from "../../../theme/font";
import LinearGradient from "react-native-linear-gradient";
const { width } = Dimensions.get("window");
const columnWidth = 120;
const posterHeight = 170;
const posterGap = 12;
const horizontalGap = 14;

// Dummy Posters
const moviePosters = [
  [imageIndex.welcomePost1, imageIndex.welcomePost2, imageIndex.welcomePost3, imageIndex.welcomePost4, imageIndex.welcomePost5, imageIndex.welcomePost6],
  [imageIndex.welcomePost7, imageIndex.welcomePost8, imageIndex.welcomePost9, imageIndex.welcomePost10, imageIndex.welcomePost11, imageIndex.welcomePost12],
  [imageIndex.welcomePost13, imageIndex.welcomePost14, imageIndex.welcomePost15, imageIndex.welcomePost16, imageIndex.welcomePost17, imageIndex.welcomePost18],
  [imageIndex.welcomePost19, imageIndex.welcomePost20, imageIndex.welcomePost21, imageIndex.welcomePost22, imageIndex.welcomePost23, imageIndex.welcomePost24],
];
const Welcome = () => {
  const { navigation } = useWelcome()
  const token = useSelector((state: RootState) => state.auth.token)
  const userProfile = useSelector((state: RootState) => state.auth.userGetData);

  const goToInitialScreen = () => {
    if (token) {
      navigation.replace(ScreenNameEnum.TabNavigator, {
        screen: ScreenNameEnum.RankingTab,
      });
    } else {
      navigation.navigate(ScreenNameEnum.LoginScreen);
    }
  };
  return (
    <View style={styles.container}>
      <CustomStatusBar backgroundColor="transparent" translucent />
      {/* Poster Columns */}
      <View style={styles.posterWrapper}>
        {moviePosters.map((column, columnIndex) => {
          const isAtTop = columnIndex % 2 === 0;
          return (
            <FloatingColumn
              key={`column-${columnIndex}`}
              posters={column}
              columnIndex={columnIndex}
              isAtTop={isAtTop}
            />
          );
        })}
      </View>
      <View style={styles.container}>
        {/* Overlays */}
        <View style={styles.overlayLeft} />
        {/* <View style={styles.overlayColorCenter} /> */}
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.11)",
            "rgba(0, 0, 0, 0.9)",
            "rgba(0, 0, 0, 0.9)"
          ]}
          locations={[0, 0.4, 0.7]}
          style={styles.gradientOverlay}
        />
        <View style={styles.overlayColor} />
        {/* <LinearGradient
  colors={["rgba(0,0,0,0.1)", "rgba(0, 0, 0, 1)"]}
   style={styles.overlayColor} 
/> */}
        {/* <View style={styles.overlayBottom} />\ */}
        {/* <View style={styles.overlayRight} /> */}
        <LinearGradient
          colors={["rgba(0, 108, 157,0.2)", "rgba(0, 108, 157,0.25)",]}
          style={styles.overlayRight}
        />
        <View style={styles.contentWrapper}>
          <View style={styles.contentWrapp}>
            <Image source={imageIndex.appLogo} style={styles.logo} resizeMode='stretch' />
            <CustomText
              size={28}
              color={Color.primary}
              style={styles.heading}
              font={font.PoppinsBold}
            >
              Find Great Shows and Movies in Seconds
            </CustomText>
            {/* <Text style={styles.heading}>Find Great Shows and Movies in Seconds</Text> */}
            <CustomText  
              size={16}
              color={Color.primary}
              style={styles.subHeading}
              font={font.PoppinsRegular}
            >
              Delivering personalized recommendations in seconds using advanced AI and your unique preferences.
            </CustomText>
            {/* <Text style={styles.subHeading}>
                    </Text> */}
          </View>
          {/* <Button title="Get Started" onPress={goToInitialScreen} /> */}

          {/* <Button title='Get Started' onPress={() => navigation.navigate(ScreenNameEnum.LoginScreen)} /> */}
          <Button
          textStyle={{color:'#FFFFFF'}}
            title="Get Started"
            onPress={() => { goToInitialScreen() }}
          />
        </View>

      </View>
    </View>
  );
};

// Floating Column Component
const FloatingColumn = ({ posters, columnIndex, isAtTop }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const direction = isAtTop ? -130 : 130;

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
      ])
    ).start();
  }, [translateY, isAtTop]);

  return (
    <Animated.View
      style={[
        styles.column,
        {
          left: columnIndex * (columnWidth + horizontalGap),
          top: isAtTop ? 104 : 0,
          transform: [{ translateY }],
        },
      ]}
    >
      {posters.map((poster, posterIndex) => (
        <Image
          key={`poster-${columnIndex}-${posterIndex}`}
          source={poster}
          style={styles.poster}
          resizeMode="cover"
        />
      ))}


    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: "hidden",
      // backgroundColor:Color.background,
  },
  posterWrapper: {
    position: "relative",
    width: width + columnWidth,
    height: "100%",
    top: -124,
    left: -(columnWidth / 2),
    flexDirection: "row",
  },
  column: {
    position: "absolute",
    width: columnWidth,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  poster: {
    width: "100%",
    height: posterHeight,
    marginBottom: posterGap, // vertical gap
    borderRadius: 12,
  },
  overlayLeft: {
    position: "absolute",
    width: columnWidth / 2,
    height: "100%",
    top: 0,
    left: 0,
    // backgroundColor: "rgba(0,0,0,0.8)", // first column half hide
  },
  overlayRight: {
    position: "absolute",
    width: "100%",
    // width: columnWidth / 2,
    height: "100%",
    top: 0,
    right: 0,
    // backgroundColor: "rgba(0, 108, 157,0.23)", // last column half hide
  },
  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "28%",
    bottom: '17%',
    left: 0,
  },
  // last opecity
  overlayColor: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "80%",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.99)"
  },
  overlayColorCenter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "70%",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  overlayBottom: {
    position: "absolute",
    width: "100%",
    height: "40%",
    top: "60%",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  logo: {
  width: 60,         // make width = height for square
  height: 72,        // same as width
  marginBottom: 10,    // reduced bottom margin to move it up
  marginTop: 5,       // smaller top margin to move it higher
  borderRadius: 8,    // optional: slightly rounded corners    
  // width: 90,          // make width = height for a square
  // height: 100,         // same as width
  // marginBottom: 15,    // reduce bottom margin to move it up
  // marginTop: 10,      // optional: add top margin if needed
  // borderRadius: 8,    // optional: slightly rounded corners
   },
  heading: {
    fontSize: 28,
    // fontFamily: font.PoppinsBold,
    color: Color.whiteText,
    textAlign: 'center',
    // marginBottom: 6,
  },
  subHeading: {
    fontSize: 16,
    // fontFamily: font.PoppinsRegular,
    color: Color.whiteText,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 18,
    lineHeight: 22
  },
  contentWrapper: {
    marginHorizontal: 16,
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  contentWrapp: {
    alignItems: 'center',
  },
});

export default Welcome;









