import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { RootState } from '../../../../redux/store';
import { getUserProfile, uploadAvatarImage } from '../../../../redux/Api/authService';
import { updateUserData } from '../../../../redux/feature/userSlice';
import { setUserProfile } from '../../../../redux/feature/authSlice';

const useProfile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const userProfile = useSelector((state: RootState) => state.auth.userGetData);
 
  const [getAgain, setGetAgain] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [userProfileDate, setUserProfileDate] = useState<any>({});

const fetchUserProfile = useCallback(async () => {
  try {
    if (token) {
      setLoading(true);
      const res = await getUserProfile(token);
      console.log(res , 'user_profile_data-Save_IN_redux')
      // setUserProfileDate(res);
      dispatch(setUserProfile({ userGetData: res }));
    }
  } catch (error) {
    console.error('❌ Profile fetch error', error);
  } finally {
    setLoading(false);
  }
}, [token, getAgain, dispatch]);


  useEffect(() => {
    fetchUserProfile();
   }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) setLoading(false);
  }, [userProfile]);

  const uploadProfileAvatar = useCallback(
    async (image: any, resetImageCallback?: () => void) => {
      if (!image?.path || !token) return;

      setUploading(true);
      try {
        const response = await uploadAvatarImage(token, image);
        console.log("🟢 Upload Response", response);

        // if (!response || response?.status !== 200) {
        //   throw new Error("Upload failed at response level");
        // }

        // Alert.alert('Avatar uploaded successfully');

        const updatedProfile = await getUserProfile(token);
        dispatch(setUserProfile({ userGetData: updatedProfile }));


        setGetAgain(prev => prev + 1);
      } catch (error) {
        console.error("❌ Upload Failed", error);
        resetImageCallback?.();
        // Alert.alert('Failed to upload avatar');
      } finally {
        setUploading(false);
      }
    },
    [token, dispatch, setUserProfile]
  );

  return {
    loading,
    uploading,
    userProfile,
    userProfileDate,
    refetchUserProfile: fetchUserProfile,
    uploadProfileAvatar,
    setGetAgain,
    getAgain,
  };
};

export default useProfile;
