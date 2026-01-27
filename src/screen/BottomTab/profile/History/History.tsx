
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity,   } from 'react-native';
import imageIndex from '@assets/imageIndex';
import { BottomSheet,   CustomStatusBar,   HeaderCustom, ProfileOther,  } from '@components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenNameEnum from '@routes/screenName.enum';
import styles from './style';
import { Color } from '@theme/color';
  import LayeredShadowText from '@components/common/LayeredShadowText/LayeredShadowText';
import CompareModals from '../../ranking/rankingScreen/CompareModals';
import { useCompareComponent } from '../../ranking/rankingScreen/useCompareComponent';
import { useBookmarks } from '@hooks/useBookmark';
import RankingWithInfo from '@components/ranking/RankingWithInfo';
import {   getRatedMovies } from '@redux/Api/movieApi';
import FastImage from 'react-native-fast-image';


const OtherTaingPrfofile = () => {
  const [bottomModal, setBottomModal] = useState(false)
  const [lovedImageMap, setLovedImageMap] = useState<{ [key: string]: boolean }>({});

  const route = useRoute();
  const { title, datamovie, username, imageUri, token, disableBottomSheet = false } = route.params
  const navigation = useNavigation();
  const { isBookmarked, toggleBookmark } = useBookmarks(token);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [movies, setMovies] = useState([])

  const BottomData = useMemo(() => {
    return isFollowing
      ? [
        { name: "Unfollow", action: () => { setIsFollowing(false); setBottomModal(false); } },
        { name: "Cancel", action: () => setBottomModal(false) }
      ]
      : [
        { name: "Follow", action: () => { setIsFollowing(true); setBottomModal(false); } },
        { name: "Cancel", action: () => setBottomModal(false) }
      ];
  }, [isFollowing]);


  const bothBookMovie = async () => {
    try {
      const response = await getRatedMovies(token);
      setMovies(response?.results)
      } catch (error) {
      console.error('getCommonBookmarks', error)
    };
  }

  useEffect(() => {
    bothBookMovie()
   }, [token, username])

  const handleToggleLovedImage = useCallback((movieId: string) => {
    setLovedImageMap(prev => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  }, [])

  const handleToggleBookmark = async (imdb_id: string) => {
    try {
      const status = await toggleBookmark(imdb_id); // true = added, false = removed

      setMovies(prev =>
        prev.map(m =>
          m.imdb_id === imdb_id ? { ...m, is_bookmarked: status } : m
        )
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };


   const compareHook = useCompareComponent(token);
  const handleRankingPress = (movie) => {
    compareHook.openFeedbackModal(movie);
    console.log(movie, "movie in handleRankingPress");
  };


const handleNavigation = (imdb_id: string, token: string) => {
    navigation.navigate(ScreenNameEnum.MovieDetailScreen, { imdb_idData: imdb_id, token: token })
    // Alert.alert(imdb_id, token)
  };


  const renderMovie = useCallback(({ item, index }) => {
    setIsSaved(item?.is_bookmarked ?? false)
    console.log('ranking__data__here', item)

    return (
      <View style={[styles.movieCard, { paddingHorizontal: 0 }]} >
        <TouchableOpacity  activeOpacity={0.8}   onPress={() => handleNavigation(item?.imdb_id, token)} >
          {/* <Image source={{ uri: item?.cover_image_url }} style={styles.poster} /> */}
 <FastImage
            style={styles.poster}
            source={{
              uri: item?.cover_image_url,
              priority: FastImage.priority.low,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>

        <TouchableOpacity  activeOpacity={0.8}    onPress={() => handleNavigation(item?.imdb_id, token)}  style={styles.info}>
          <View style={{ flexDirection: "row", }}>
            <Text numberOfLines={2} style={[styles.title]}>{item?.title}</Text>
            {/* <Text  style={[styles.title]}>"ffgefrgdf gdf gdfg dfffeffffaffsdfsfff gdf g df gdfgdf g df</Text> */}


          </View>
          <Text style={styles.year}>{item?.release_year}</Text>

          {title == "History" ?
            null
            :
            <View style={{ alignItems: 'flex-start' }} >
              {/* <LayeredShadowText fontSize={60} text={item?.index} /> */}
              <LayeredShadowText fontSize={60} text={`${index + 1}`} />

            </View>
          }
        </TouchableOpacity>


        <View style={styles.icons}>
          <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }} >
            {/* <RankingCard ranked={item?.rec_score} /> */}/
            <RankingWithInfo
              score={item?.rec_score}
              title={"Friend Score"}
              description={

                "This score shows the rating from your friend for this title."
              }
            />
          </View>

          <View style={{ flexDirection: 'row', marginTop: 18, }} >
            {/* <TouchableOpacity style={styles.iconprimary}
            onPress={() => { setIsVisible(true) }}
          > */}
            <TouchableOpacity style={styles.iconprimary}
              onPress={() =>
                handleRankingPress({
                  imdb_id: item?.imdb_id,
                  title: item?.title,
                  release_year: item?.release_year, // or dynamic if available
                  cover_image_url: item?.cover_image_url || '', // ensure string URL is passed
                })
              }
            >
              <Image source={imageIndex.mdRankings} style={{ height: 20, width: 20, right: 10 }}
                resizeMode='contain'
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconprimary, {
              justifyContent: "space-between",
              alignItems: "center",
            }]}
              onPress={() => handleToggleBookmark(item?.imdb_id)}
            >
              <Image
                source={isBookmarked(item.imdb_id) ? imageIndex.save : imageIndex.saveMark}
                // source={isSaved ? imageIndex.save : imageIndex.saveMark}
                style={{ height: 20, width: 20 }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }, [token, handleToggleLovedImage, lovedImageMap, isSaved, movies]);

  return (
    <SafeAreaView style={styles.maincontainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <HeaderCustom
          title={username}
          backIcon={imageIndex.backArrow}
          rightIcon={title === "History" ? null : imageIndex.menu}
          onRightPress={() => !disableBottomSheet && setBottomModal(true)}
          headerColor={Color.headerTransparent}
        // onBackPressW={() => navigation.goBack()}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={movies}
          keyExtractor={(item, index) => `${item?.imdb_id}-${index}`}
          renderItem={renderMovie}
          // initialScrollIndex={5}
          // windowSize={5}
          ListHeaderComponent={() => (
            <>
              <View style={{
                marginTop: 8,
                paddingBottom: 30,
              }}>
                <ProfileOther
                  imageSource={imageUri}
                  label={title}
                  // onPress={() => console.log('Pressed Rankings')}
                  onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen)}

                />
              </View>

              {title == "History" ?
                <Text style={styles.todayText} >Today</Text>
                :
                null
              }
            </>
          )}
          initialNumToRender={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: 70, marginHorizontal: 18, marginTop: 50 }}
        />
      </View>
      <CompareModals token={token} useCompareHook={compareHook} />
      {!disableBottomSheet && (
        <BottomSheet
          visible={bottomModal}
          options={BottomData}
          onClose={() => setBottomModal(false)}
          // onSelect={() => setBottomModal(false)}
          onSelect={(option) => option.action()}
        // onSelect={(option: any) => setBottomModal(option)}
        />
      )}
      {/* <CompareModals token={token} useCompareHook={compareHook} /> */}
    </SafeAreaView>
  );
};
export default memo(HIstory);

// PROFILE1 MOVOIE 1





