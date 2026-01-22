import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import watchTogetherGroups from '../../../../../watchdata';
import WatchGroupCom from '../../../../component/common/WatchGroupCom/WatchGroupCom';
import { useRoute } from '@react-navigation/native';
import font from '../../../../theme/font';
const GroupSearch = ({ groupData }) => {
  console.log(groupData?.length, "----4-4-4-44--44-")
console.log(groupData ,"groupData________groupData_____")
  // const [searchText, setSearchText] = useState('');

  // Filtered groups
  // const filteredGroups = watchTogetherGroups.filter(group =>
  //   group.groupName.toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <View style={styles.container}>

      {groupData?.length > 0 ? (
        <WatchGroupCom groups={groupData} />
      ) : (
        <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20  
,
fontFamily:font.PoppinsMedium ,
fontSize:16

        }}>
          No groups found.
        </Text>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // change as needed
    paddingHorizontal: 16,
    paddingTop: 20
  },
  searchBox: {
    height: 50,

    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: 'white',
    marginBottom: 16,
  },
});

export default React.memo(GroupSearch);
