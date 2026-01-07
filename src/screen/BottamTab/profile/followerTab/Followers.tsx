import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet,  } from 'react-native';
import { HeaderCustom, SearchBarCustom } from '../../../../component';
import StatusBarCustom from '../../../../component/common/statusBar/StatusBarCustom';
import imageIndex from '../../../../assets/imageIndex';
import { Color } from '../../../../theme/color';
import { useRoute } from '@react-navigation/native';
import ProfilePhotoCom from '../../../../component/common/ProfilePhotoCom/ProfilePhotoCom';
import { followUser, getFollowers, getFollowing, getSuggestedFriends, unfollowUser } from '../../../../redux/Api/followService';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import font from '../../../../theme/font';
import { SafeAreaView } from 'react-native-safe-area-context';


const FollowersScreen = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const route = useRoute();
  const { tabToOpen, userName } = route.params || {};
  // const userName = useSelector((state: RootState) => state.auth.userGetData.name);
  console.log(userName, "___userName__")
  const initialData = {
    Followers: [],
    Following: [],
    Suggested: [],
  };
  const tabs = Object.keys(initialData);
  const [userData, setUserData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');


  // console.log(userData, '____userData')

  useEffect(() => {
    if (tabToOpen !== undefined && tabToOpen >= 0 && tabToOpen < tabs.length) {
      setActiveTab(tabToOpen);
    }
  }, [tabToOpen]);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const key = tabs[activeTab];
      if (key === 'Followers') {
        const res = await getFollowers(token, search);
        setUserData(prev => ({ ...prev, Followers: res.results }));
      } else if (key === 'Following') {
        const res = await getFollowing(token, search);
        setUserData(prev => ({ ...prev, Following: res.results }));
      } else if (key === 'Suggested') {
        const res = await getSuggestedFriends(token, search);
        setUserData(prev => ({ ...prev, Suggested: res.results }));
      }
    } catch (error) {
      console.log("❌ error user fetch:", error);
    }
  };
  const activeUsers = useMemo(() => {
    const key = tabs[activeTab];
    const users = userData[key] || [];

    if (key === 'Suggested') return users;
    if (!search.trim()) return users;
    return users.filter(user =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, search, userData]);

  const toggleFollow = useCallback(async (username: string) => {
    const key = tabs[activeTab];
    const updatedList = userData[key].map((u: any) =>
      u.username === username ? { ...u, following: !u.following } : u
    );

    try {
      const user = userData[key].find((u: any) => u.username === username);
      if (!user) return;

      if (user.following) {
        await unfollowUser(token, username);
      } else {
        await followUser(token, username);
      }

      setUserData(prev => ({ ...prev, [key]: updatedList }));
    } catch (error) {
      console.error('❌ Follow/Unfollow failed:', error);
    }
  }, [activeTab, userData, token]);
  useEffect(() => {
    if (tabs[activeTab] === 'Suggested') {
      const timeout = setTimeout(() => {
        fetchUsers();
      }, 300); // debounce

      return () => clearTimeout(timeout);
    }
  }, [search, activeTab, tabs]);
  const renderItem = useCallback(({ item }) => (
    <View style={styles.userRow}>
      <View style={styles.avatarContainer}>
        <ProfilePhotoCom item={item} imageUri={`${BASE_IMAGE_URL}${item.avatar}`} />
      </View>
      <Text style={styles.userName}>{item?.name}</Text>

      <TouchableOpacity
        style={[styles.followprimary, item.following && styles.followingprimary]}
        // onPress={() => toggleFollow(item.id)}
        onPress={() => toggleFollow(item.username)}
      >
        <Text style={[styles.followText, item.following && styles.followingText]}>
          {item.following ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  ), [toggleFollow]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.background }}>
      <StatusBarCustom />
      <View style={{ marginBottom: 10 }} />
      <HeaderCustom title={userName} backIcon={imageIndex.backArrow} />
      <View style={styles.container}>
        <View style={[styles.tabRow, { marginTop: 14 }]}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => setActiveTab(index)} style={styles.tabprimary}>
           
              <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
  {(tab === 'Followers' || tab === 'Following') ? userData[tab]?.length : ''} {tab}
</Text>

              {activeTab === index && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.marginH15}>
          {/* <SearchBarCustom
            placeholder="Search Followers"
            value={search}
            onSearchChange={setSearch}
          /> */}

          <SearchBarCustom
            placeholder={
              tabs[activeTab] === 'Suggested'
                ? 'Search Suggested Friends'
                : tabs[activeTab] === 'Following'
                  ? 'Search Following'
                  : 'Search Followers'
            }
            value={search}
            onSearchChange={setSearch}
          />

        </View>
        <View style={styles.marginH15}>
          <FlatList
            data={activeUsers}
            keyExtractor={item => item.username}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 15 }}
            contentContainerStyle={{ paddingBottom: 130 }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews

          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  tabRow: { flexDirection: 'row', marginBottom: 20 },
  tabprimary: { flex: 1, alignItems: 'center' },

  tabText: { color: Color.placeHolder, fontSize: 14, fontFamily: font.PoppinsMedium },

  tabTextActive: { color: Color.whiteText, fontWeight: 'bold' },
  tabUnderline: { height: 3, backgroundColor: Color.primary, width: '60%', marginTop: 4, },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  userName: { flex: 1, color: Color.whiteText, fontSize: 14, fontFamily: font.PoppinsMedium },
  followprimary: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Color.primary,
    borderRadius: 8,
    width: 116,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  followingprimary: {
    backgroundColor: Color.background,
    borderColor: Color.whiteText,
    borderWidth: 0.5,
  },
  followText: {
    color: Color.whiteText,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: font.PoppinsBold
  },
  followingText: {
    color: Color.whiteText,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: font.PoppinsMedium,
  },
  marginH15: {
    marginHorizontal: 15
  }
});

export default React.memo(FollowersScreen);