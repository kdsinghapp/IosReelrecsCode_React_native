

import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { Color } from '../../../theme/color';
import RankingCard from '../../ranking/RankingCard';
import font from '../../../theme/font';
import { getMatchingMovies } from '../../../redux/Api/ProfileApi';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import CustomText from '../../common/CustomText';

interface Movie {
  id: string;
  imdb_id: string;
  cover_image_url: string;
  rec_score: number;
  title: string;
}

interface MoreSheetModalProps {
  visible: boolean;
  onClose: () => void;
  token: string;
  imdb_idData: string;
}

const MoreSheetModal: React.FC<MoreSheetModalProps> = ({
  visible,
  onClose,
  token,
  imdb_idData,
}) => {
  const [moreMovie, setMoreMovie] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const goToDetail = useCallback(
    (item: Movie) => {
      console.log('Pressed movie:', item?.title);
      console.log('Pressed movie:', item?.title);
      onClose();
      setTimeout(() => {
        navigation.replace(ScreenNameEnum.MovieDetailScreen, {
          imdb_idData: item?.imdb_id,
          token,
        });
      }, 250);
    },
    [navigation, token, onClose]
  );

  useEffect(() => {
    if (visible && imdb_idData) {
      const seeMoreLikeMovie = async () => {
        console.log('imdb_idData___', imdb_idData)
        // Alert.alert(imdb_idData);
        try {
          setLoading(true);
          const response = await getMatchingMovies(token, imdb_idData);
          setMoreMovie(response?.results || []);
          // console.log('Similar movies fetched:', response?.results);
        } catch (error) {
          console.error('Error fetching similar movies:', error);
        } finally {
          setLoading(false);
        }
      };
      seeMoreLikeMovie();
    }
  }, [visible, imdb_idData, token]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay} pointerEvents="box-none">
           
        <View style={styles.contentContainer} pointerEvents="auto">
          <View style={styles.header}>
           
              <View style={{
                    height: 24,
    width: 24,
              }}></View>
               <CustomText
                          size={16}
                          color={Color.whiteText}
                          style={{
                            color:Color.whiteText
                          }}
                          font={font.PoppinsBold}
                        >
                          More Like This
                        </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image source={imageIndex.closeimg} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Color.primary} />
              <Text style={styles.loadingText}>Loading similar movies...</Text>
            </View>
          ) : moreMovie.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              <View style={styles.rowWrap}>
                {moreMovie.map((item, index) => (
                  <TouchableOpacity
                    key={item.imdb_id || index.toString()}
                    activeOpacity={0.7}
                    onPress={() => goToDetail(item)}
                    style={styles.cardContainer}
                  >
                    <FastImage
                      source={{
                        uri: item?.cover_image_url,
                        priority: FastImage.priority.low,
                        cache: FastImage.cacheControl.immutable,
                      }}
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.stretch}
                    />

                    <View style={styles.ratingBadge} pointerEvents="none">
                      <RankingCard ranked={item?.rec_score} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={imageIndex.emptyState}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No similar movies found</Text>
              <Text style={styles.emptySubText}>
                We couldn't find any movies similar to this one.
              </Text>
            </View>
          )}
        </View>
  
      </View>
    </Modal>
  );
};

// export default memo(MoreSheetModal);
export default MoreSheetModal;

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // 3 columns with margin

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: Color.modalBg,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height:  Dimensions.get('window').height * 0.7,
    maxHeight: Dimensions.get('window').height * 0.63,
    height: Dimensions.get('window').height * 0.66,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 12,
    alignItems:"center" ,
   },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: font.PoppinsBold,
    color: Color.whiteText,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    height: 24,
    width: 24,
    tintColor: Color.whiteText,
  },
  listContent: {
    paddingBottom: 20,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ratingBadge: {
   position: 'absolute',
    bottom: 1,
    left: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    color: Color.lightGrayText,
    fontSize: 14,
    marginTop: 12,
    fontFamily: font.PoppinsRegular,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    tintColor: Color.lightGrayText,
    opacity: 0.7,
  },
  emptyText: {
    color: Color.whiteText,
    fontSize: 16,
    fontFamily: font.PoppinsMedium,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    color: Color.lightGrayText,
    fontSize: 14,
    fontFamily: font.PoppinsRegular,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});



