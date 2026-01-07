// components/SuggestedFriendCard.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import ProfilePhotoCom from '../ProfilePhotoCom/ProfilePhotoCom';
import { Color } from '../../../theme/color';
import font from '../../../theme/font';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { followUser, unfollowUser } from '../../../redux/Api/followService';
import { getUserProfile } from '../../../redux/Api/authService';
import { setUserProfile } from '../../../redux/feature/authSlice';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

interface Props {
    item: {
        avatar: string;
        name?: string | null;
        username: string;
        is_following?: boolean; // ✅ Add this line
    };
    BASE_IMAGE_URL: string;
}
const SuggestedFriendCard: React.FC<Props> = ({ item, onFollow, BASE_IMAGE_URL }) => {
    const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
    const [isFollowing, setIsFollowing] = useState(!!item.is_following);
const navigation = useNavigation();
    const [loading, setLoading] = useState(false)

// console.log('item_movie_data',item)
    const handleFollowToggle = async () => {
        if (!token || loading) return;

        try {
            setLoading(true);
            if (isFollowing) {
                await unfollowUser(token, item?.username);
            } else {
                await followUser(token, item?.username);
            }

            // Toggle follow state
            setIsFollowing(!isFollowing);

        } catch (error: any) {
            console.log("❌ Failed to toggle follow:", error);
            if (error?.response?.status === 409) {
                // Already followed/unfollowed
            }
        } finally {
            setLoading(false);
        }
    };

// const fetchUserProfile = useCallback(async () => {
//   try {
//     if (token) {
//       setLoading(true);
//       const res = await getUserProfile(token);
      
//       // setUserProfileDate(res);

//       dispatch(setUserProfile({ userGetData: res }));
//     }
//   } catch (error) {
//     console.error('❌ Profile fetch error', error);
//   } finally {
//     setLoading(false);
//   }
// }, [token, dispatch, isFollowing]);

// console.log(item, "itemuserSuggestion")
    return (
        <View style={styles.cardContainer}>
            <ProfilePhotoCom item={item} imageUri={`${BASE_IMAGE_URL}${item.avatar}`} />

            <TouchableOpacity onPress={() => {
        navigation.navigate(ScreenNameEnum.OtherProfile, { item: item });
      }}>
                <Text  allowFontScaling={false}  style={styles.name} numberOfLines={1}>
                {item?.name || item?.username}
            </Text>

            <Text  allowFontScaling={false}  style={styles.username} numberOfLines={1}>
                @{item?.username}
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleFollowToggle}
                disabled={loading}
                style={[
                    styles.followButton,
                    isFollowing && styles.followingButton,
                ]}
            >
                {loading ? (
                   <View style={{marginHorizontal:10,}} >
                     <ActivityIndicator color={Color.primary} size="small" />
                   </View>
                ) : (
                    <Text  allowFontScaling={false}  style={styles.followText}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                )}
            </TouchableOpacity>

        </View>
    );
};
// export default SuggestedFriendCard;
export default React.memo(SuggestedFriendCard);
const styles = StyleSheet.create({
    cardContainer: {
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 2,
        paddingVertical: 10,
        // paddingHorizontal:20,
        marginRight: 10,
        width: 120,
        backgroundColor: Color.background,
    },
    name: {
        color: Color.whiteText,
        fontFamily: font.PoppinsMedium,
        fontSize: 14,
        lineHeight:16,
        textAlign: 'center',
        marginTop:6,
    },
    username: {
        color: Color.placeHolder,
        fontSize: 12,
        lineHeight:14,

        fontFamily: font.PoppinsRegular,
        marginBottom: 10,
    },
    followButton: {
        backgroundColor: Color.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        width:98,
        justifyContent:'center',
        alignItems:'center',
    },
    followText: {
        color: Color.whiteText,
        fontFamily: font.PoppinsBold,
        fontSize: 12,

        lineHeight:16,
    },
    followingButton: {
        backgroundColor: Color.background,
        borderRadius: 8,
        borderColor: Color.whiteText,
        borderWidth: 0.5
    },
});
