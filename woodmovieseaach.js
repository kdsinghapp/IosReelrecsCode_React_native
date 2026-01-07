import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  TouchableWithoutFeedback,

} from 'react-native';
import imageIndex from '../../../../assets/imageIndex';
import { Color } from '../../../../theme/color';
import { ComparisonModal, CustomStatusBar, FeedbackModal, SearchBarCustom, SlideInTooltipModal, StepProgressModal } from '../../../../component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { movieData } from '../../discover/movieDetail/MovieDetailData';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import useWoodScreen from './useWoodScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import font from '../../../../theme/font';
import SearchMovieCom from '../../../../component/searchmovieCom/searchmovieCom';

const WoodsScreen = () => {
const { navigation,
    togglePlatform,
    isVisible, setIsVisible,

    modalVisible, setModalVisible,
    lovedImge, setlovedImge,
    selectedPlatforms, 
 } = useWoodScreen()

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movieData);
  const handleSearch = (query) => {
    const queryString = query ? query.toString().toLowerCase() : '';
    const results = movieData.filter((movie) => {
      const titleMatch = movie.title.toLowerCase().includes(queryString);
      const typeMatch = movie.type.toLowerCase().includes(queryString);
      return titleMatch || typeMatch; // Filter by either title or type
    });
    setFilteredMovies(results);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // 300ms delay to debounce the search
    return () => clearTimeout(timer); // Cleanup the timer
  }, [searchQuery]);


  const formattedQuery = searchQuery 
    ? searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase()
    : '';





  return (
    <SafeAreaView style={styles.maincontainer}>
      <CustomStatusBar />
      
 <SearchMovieCom
  navigation={navigation}
  togglePlatform={togglePlatform}
  isVisible={isVisible}
  setIsVisible={setIsVisible}
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  lovedImge={lovedImge}
  setlovedImge={setlovedImge}
  selectedPlatforms={selectedPlatforms}
/>


     
    {/* <SearchMovieCom  /> */}


      {/* <SlideInTooltipModal visible={TooltipModal}
        onClose={() => setTooltipModal(false)}
      /> */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: Color.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  resultsText: {
    color: Color.whiteText,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  queryText: {
    color: Color.whiteText,
  },
  placeholderText: {
    color: Color.whiteText,
    fontFamily:font.PoppinsBold,
    fontSize: 16,
    marginBottom: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: Color.textGray,
    fontSize: 16,
  },
 
});

export default WoodsScreen;
