import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import watchTogetherGroups from '../../../../../watchdata';
import WatchGroupCom from '@components/common/WatchGroupCom/WatchGroupCom';
const GroupSearchScreen = () => {
  const [searchText, setSearchText] = useState('');

  // Filtered groups
  const filteredGroups = watchTogetherGroups.filter(group =>
    group.groupName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search groups..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Reusable Component */}
      <WatchGroupCom groups={filteredGroups} />
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
     height:50,

    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: 'white',
    marginBottom: 16,
  },
});

export default React.memo(GroupSearchScreen);
