import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Color } from '@theme/color';

const SuccessMessageCustom = ({ message, heading, screen, profile }: any) => {
  if (!message) return null;

  return (
    <>
      {screen === 'PasswordReset' && (
        <View style={[styles.container,{marginBottom:20}]}>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}

      {/* {screen === 'invited' && (
        <View style={styles.container}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.text}>{message}</Text>
        </View>
      )} */}


      {screen === 'Accept' && (
        <View style={styles.acceptContainier}>
          {profile && <Image source={profile} style={styles.profileImage} />}
          <Text style={[styles.heading, {textAlign:'center'}]}>{heading}</Text>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}  

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.green, // Green background
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    // marginBottom: 18,
    // alignItems: 'center', // Ensures everything is centered
  },
  heading: {
    color: Color.whiteText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5, // Space between heading and text
  },
    text: {
    color: Color.whiteText,
    fontSize: 14,
    // textAlign: 'center', // Center the text
  },
  acceptContainier:{
    backgroundColor:'#f0d241',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    // bottom:20,
    // marginBottom: 18,
    height:70,
    // top:30


  },
  profileImage: {
    width: 60, // Example size for profile image
    height: 60,
    position:'absolute',
    // height:70,
    bottom:35,
    left:10,
    // top:20
    backgroundColor:'red',
    borderWidth:3,
    borderColor:"rgba(45, 45, 46, 1)",
    borderRadius: 30, // Circle shape
    // marginBottom: 10, // Space between image and text
  },
});

export default SuccessMessageCustom;
