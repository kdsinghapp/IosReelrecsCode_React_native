import { Image,  ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CustomStatusBar, HeaderCustom, SearchBarCustom } from '../../../../component'
import imageIndex from '../../../../assets/imageIndex'
import { useNavigation } from '@react-navigation/native'
import { Color } from '../../../../theme/color'
import font from '../../../../theme/font'
import { SafeAreaView } from 'react-native-safe-area-context'

const HelpSetting = () => {
  const navigation = useNavigation();
const troubleshootingSteps = [
  {
    id: 1,
    title: "Check Your Internet Connection",
    description:
      "Ensure you have a stable internet connection. Try loading a webpage or another app to verify connectivity.",
  },
  {
    id: 2,
    title: "Refresh the App",
    description:
      "Close the app completely and reopen it. Then, try to play the movie again.",
  },
  {
    id: 3,
    title: "Update the App",
    description:
      "Make sure you’re using the latest version of the app. Check for updates in your device’s app store.",
  },
  {
    id: 4,
    title: "Clear Cache (if applicable)",
    description:
      "If you're using a device that allows it, clearing the app's cache can help resolve playback issues. Go to your device settings, find the app, and clear the cache.",
  },
  {
    id: 5,
    title: "Restart Your Device",
    description:
      "Sometimes a simple restart can fix playback issues. Turn your device off and back on.",
  },
  {
    id: 6,
    title: "Try a Different Device",
    description:
      "If possible, try playing the movie on another device to see if the issue persists.",
  },
  {
    id: 7,
    title: "Check for Server Issues",
    description:
      "Occasionally, server issues can affect playback. Check our status page or our social media channels for any reports of outages.",
  },
  {
    id: 8,
    title: "Contact Support",
    description:
      "If you’ve tried all the above steps and the movie still won’t play, please contact our support team for further assistance. Include details about your device and the specific movie you’re trying to watch.",
  },
];

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <HeaderCustom
        title="Help"
        backIcon={imageIndex.backArrow}
        // rightIcon={imageIndex.menu}
        // onBackPress={() => console.log('Back pressed')}
        onRightPress={() => navigation.goBack()}
      />
         <View style={{marginBottom:12,paddingHorizontal:16}} >
               <SearchBarCustom />
           
           
           </View>   
      <ScrollView style={{ paddingHorizontal: 18 }} >
  


        {/* <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", {data=troubleshootingSteps})} > */}
          <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

          <View style={styles.detailContainer}  >
            <Text style={styles.headingText}>Account</Text>
                     <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

              <Image source={imageIndex.rightArrow} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailText} >Why can’t I find a specific movie or show?</Text>
          <Text style={styles.detailText} >How often is new content added?</Text>
          <Text style={styles.detailText} >What’s the process for requesting a movie or show?</Text>
          <Text style={styles.detailText} >Are there any regional restrictions on content?</Text>
        </TouchableOpacity>

        {/* watch */}
                 <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

          <View style={styles.detailContainer}  >
            <Text style={styles.headingText}>Watching Movies</Text>
                      <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

              <Image source={imageIndex.rightArrow} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailText} >How do I start watching a movie?</Text>
          <Text style={styles.detailText} >What to do if the movie won’t play?</Text>
          <Text style={styles.detailText} >Can I watch movies offline?</Text>
          <Text style={styles.detailText} >Are there subtitles and language options available?</Text>
        </TouchableOpacity>


 {/* Subscriptions */}
                 <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

          <View style={styles.detailContainer}  >
            <Text style={styles.headingText}>Subscriptions & Payments</Text>
                <TouchableOpacity onPress={() => navigation.navigate("HelpMessage", { data: troubleshootingSteps })} >

              <Image source={imageIndex.rightArrow} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailText} >How do I subscribe to a plan?</Text>
          <Text style={styles.detailText} >What payment methods are accepted?</Text>
          <Text style={styles.detailText} >Can I change my subscription plan?</Text>
          <Text style={styles.detailText} >Will I get a refund if I cancel my subscription?</Text>
        </TouchableOpacity>


      </ScrollView>
    </SafeAreaView>
  )
}

export default React.memo(HelpSetting)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    paddingTop: 12,
  },
  detailContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',


  },
  icon: {
    width: 18,
    height: 16,
    resizeMode:'contain',
    tintColor:Color.lightGrayText,
    // marginBottom:8,


    // backgroundColor:'pink',

  },
  headingText: {
    fontSize: 16,
    fontFamily:font.PoppinsBold,
    color: Color.whiteText,
    marginBottom: 8,
    lineHeight:20,
  },
  detailText: {
    marginVertical: 3,
    fontSize: 14,
    lineHeight:18,
    fontFamily:font.PoppinsRegular,
    // fontWeight:"700",
    color: Color.whiteText,
    marginBottom: 6,
    maxWidth: "90%",
    // lineHeight:30,
    // letterSpacing:-1
  },
})