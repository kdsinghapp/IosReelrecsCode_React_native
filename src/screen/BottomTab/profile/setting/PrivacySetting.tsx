import {  StyleSheet, Switch, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Color } from '@theme/color';
 import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '@routes/screenName.enum';
import useToggleFlag from './useToggleFlag';
import CustomSwitch from '@components/common/CustomSwitch/CustomSwitch ';
import font from '@theme/font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomStatusBar, HeaderCustom } from '@components/index';
import imageIndex from '@assets/imageIndex';
const PrivacySetting = () => {
  const navigation = useNavigation();

  // const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  // const [requireGroupApproval, setRequireGroupApproval] = useState(false);
  // const [optOutDataSharing, setOptOutDataSharing] = useState(false); 
  // const togglePrivateAccount = () => setIsPrivateAccount(prev => !prev);
  // const toggleGroupApproval = () => setRequireGroupApproval(prev => !prev);
  // const toggleDataSharing = () => setOptOutDataSharing(prev => !prev);


  const { flagValue: isPrivateAccount, handleToggle: handlePriveToggle } = useToggleFlag("is_private");
  const { flagValue: optOutDataSharing, handleToggle: handleOptOutDataToggle } = useToggleFlag("opt_out_third_party_data_sharing");
  const { flagValue: requireGroupApproval, handleToggle: handleGroupApprovalToggle } = useToggleFlag("group_add_approval_required");

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <HeaderCustom
        title="Privacy"
        backIcon={imageIndex.backArrow}
        onRightPress={() => navigation.goBack()}
      />

      {/* Private Account */}
      <View style={styles.detailContainer}>
        <View style={{ flex: 1, maxWidth: '90%', paddingRight: 10 }}>
          <Text style={styles.headingText}>Private Account</Text>
          <Text style={styles.detailText}>
            When your account is private, your approved profile and activities cannot be seen by everyone.
          </Text>
        </View>
        {/* <Switch
          trackColor={{ false: '#767577', true: '#004565' }}
          thumbColor={isPrivateAccount ? '#008AC9' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={togglePrivateAccount}
          value={isPrivateAccount}
        /> */}

        <CustomSwitch
          value={isPrivateAccount}
          onValueChange={handlePriveToggle}
        />
      </View>

      {/* Require Watch+ Group Approval */}
      <View style={styles.detailContainer}>
        <View style={{ flex: 1, maxWidth: '90%', paddingRight: 10 }}>
          <Text style={styles.headingText}>Require Watch+ Group Approval</Text>
          <Text style={styles.detailText}>
            If enabled, people must send an invite before adding you to Watch+ groups.
          </Text>
        </View>
        <CustomSwitch
          value={requireGroupApproval}
          onValueChange={handleGroupApprovalToggle}
        />
      </View>

      {/* Require Watch+ Group Approval */}
      <View style={styles.detailContainer}>
        <View style={{ flex: 1, maxWidth: '90%', paddingRight: 10 }}>
          <Text style={styles.headingText}>Opt Out of Third-Party Data Sharing</Text>
          <Text style={styles.detailText}>
            We may share anonymized data for analytics and ads to improve ReelRecs. Opting out keeps your data private and won't affect your app experience.
          </Text>
        </View>
        {/* <Switch
          trackColor={{ false: '#767577', true: '#004565' }}
          thumbColor={optOutDataSharing ? '#008AC9' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDataSharing}
          value={optOutDataSharing}
        /> */}
        <CustomSwitch
          value={optOutDataSharing}
          onValueChange={handleOptOutDataToggle}
        />
      </View>



    </SafeAreaView>
  );
};

export default React.memo(PrivacySetting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    paddingTop: 12,
  },
  detailContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 16,
    fontFamily: font.PoppinsMedium,
    lineHeight: 20,
    color: Color.whiteText,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: font.PoppinsRegular,
    lineHeight: 19,
    color: Color.placeHolder,
    marginBottom: 6,
  },
});
