


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import styles from './style';
import imageIndex from '../../../../../assets/imageIndex';
import ScreenNameEnum from '../../../../../routes/screenName.enum';
import { CustomStatusBar } from '../../../../../component';
import RankingCard from '../../../../../component/ranking/RankingCard';
import ProfilePhotoCom from '../../../../../component/common/ProfilePhotoCom/ProfilePhotoCom';

import { getPendingGroupInvites, respondToGroupInvitation } from '../../../../../redux/Api/NotificationApi';
import { RootState } from '../../../../../redux/store';
import { BASE_IMAGE_URL } from '../../../../../redux/Api/axiosInstance';
import { Color } from '../../../../../theme/color';
import { appNotification } from '../../../../../redux/Api/authService';
import { SafeAreaView } from 'react-native-safe-area-context';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Type for each feed item
type FeedItem = {
  id: string;
  name: string;
  avatar: string;
  action: 'invited' | 'ranked';
  movie: string;
  timeAgo: string;
  online: boolean;
  rating?: number;
  groupId?: string;
};

const Notification = ({ visible, onClose, bgColor }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigation = useNavigation();
  const [pendingInvites, setPendingInvites] = useState<FeedItem[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [isNonNotification, setIsNonNotification] = useState(false);

  
  

  // Combine both
  const combinedFeed: FeedItem[] = [pendingInvites];

  // API Call
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        setIsloading(true)
        const data = await getPendingGroupInvites(token);
        const formatted: FeedItem[] = data?.results?.map((invite, index) => ({
          id: invite.group_id.group_id || `invite-${index}`,
          groupId: invite.group_id.group_id,  // ✅ Required for API call
          name: invite.invited_by.name,
          avatar: `${BASE_IMAGE_URL}${invite.invited_by.avatar}`,
          action: 'invited',
          movie: invite.group_id.name,
          timeAgo: 'Just now',
          online: false,
        })) || [];
        console.log(formatted, 'natification__data__dfsehyhfg')
        let emptyData = formatted.length

        if (formatted.length <= 0) setIsNonNotification(true)
        setPendingInvites(formatted);
      } catch (error) {
        console.log('Error loading invites:', error);
      } finally {
        setIsloading(false)
      }
    };

    if (token) {
      fetchInvites();
    }
  }, []);

useEffect(() => {
  const appNotification_call =  async () => {
const resp  = await appNotification(token)
console.log(resp,'appNotification_call  ')

  } ;
  appNotification_call()
},{token})


  const handleAccept = async () => {
    try {
      const res = await respondToGroupInvitation(token, groupId, true);
      console.log("Accepted:", res);
    } catch (err) {
      console.log("Error accepting invite:", err);
    }
  };

  const handleDecline = async () => {
    try {
      const res = await respondToGroupInvitation(token, groupId, false);
      console.log("Declined:", res);
    } catch (err) {
      console.log("Error declining invite:", err);
    }
  };


  // Single Feed Card
  const FeedCard = ({ item  }: { item: FeedItem }) => {
    const handleAccept = async () => {
      if (!item.groupId) return;
      try {
        const res = await respondToGroupInvitation(token, item.groupId, true);
        console.log("Accepted:", res);
        // Optionally remove the item from UI:
        setPendingInvites((prev) => prev.filter(i => i.groupId !== item.groupId));
      } catch (err) {
        console.log("Error accepting invite:", err);
      }
    };

    const handleDecline = async () => {
      if (!item.groupId) return;
      try {
        const res = await respondToGroupInvitation(token, item.groupId, false);
        console.log("Declined:", res);
        setPendingInvites((prev) => prev.filter(i => i.groupId !== item.groupId));
      } catch (err) {
        console.log("Error declining invite:", err);
      }
    };
    useEffect(() => {
      console.log('notification__screeen')
      handleDecline()
    })

    if (isLoading) {

      <View style={{ justifyContent: 'center', alignItems: 'center', }} >
        <ActivityIndicator size={'large'} color={Color.primary} />

      </View>
    }

    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {typeof item.avatar === 'string' ? (
            <ProfilePhotoCom imageUri={item.avatar} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={item.avatar} style={styles.avatar} />
              {item.online && <View style={styles.onlineIndicator} />}
            </View>
          )}
          <TouchableOpacity
            style={styles.content}
            onPress={() => navigation.navigate(ScreenNameEnum.MovieDetailScreen)}
          >
            <View style={styles.row}>
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.action}>
                {item?.action === 'invited' ? ' invited you to join' : ' ranked'}
              </Text>
            </View>
            <Text style={styles.movie}>{item?.movie}</Text>
            <Text style={styles.time}>{item?.timeAgo}</Text>
          </TouchableOpacity>
          <RankingCard ranked={item?.rating} />
        </View>
        {item.action === 'invited' && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.accept} onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.decline} onPress={handleDecline}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          {
            height: SCREEN_HEIGHT,
            backgroundColor: bgColor ? 'rgba(14, 13, 13, 0.9)' : Color.background,
          },
        ]}
      >
        <CustomStatusBar />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onClose}>
            <Image source={imageIndex.backArrow} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.title}>Notification</Text>
            <View style={{ width: 40 }} />

        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {isNonNotification ?


            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
              {/* <ActivityIndicator  size={'large'} color={Color.primary}  /> */}
              <Text style={styles.noNotiText} >No Notificartion yet</Text>


            </View> :

            <View>
              {combinedFeed.map((item) => (
                <FeedCard key={item?.id} item={item} />
              ))}

            </View>
          }
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(Notification);


