import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, 
  RefreshControl,
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../../assets/imageIndex';
import { CustomStatusBar } from '../../../../component';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import styles from './style';
import useDiscover from './useDiscover';
import { sortByData, contentType } from './DisCoverData';
import { useRoute } from '@react-navigation/native';
import { Color } from '../../../../theme/color';
import font from '../../../../theme/font';
import SortByModal from '../../../../component/modal/SortbyModal/SortbyModal';
import FilterBar from './FilterBar';
import { Trending_without_Filter } from '../../../../redux/Api/movieApi';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import CustomText from '../../../../component/common/CustomText';
import RankingWithInfo from '../../../../component/ranking/RankingWithInfo';
import SortbyModal from '../../../../component/modal/SortbyModal/SortbyModal';


const TabPaginationScreen = () => {
  // State (same as before)
  const [items, setItems] = useState<any[]>([]);
  // Refs
 const flatListRef = useRef<FlatList>(null);

  // Initial load
  useEffect(() => {
    fetchMovies(1, true)
  }, []);


  const handleEndReached = () => {
    if (!loadingMore && hasMore && !isFetchingRef.current) {
      fetchMovies(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchMovies(1, true);
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.footerText}>Loading...</Text>
        </View>
      );
    }
    
    if (!hasMore && items.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.endText}>All loaded: {items.length} items</Text>
        </View>
      );
    }
    
    return null;
  };

    const { 
    navigation,
    sortByModal, 
    setSortByModal,
    contantFilter, 
    contentSelect,
    trending, 
    setTrending,
    selectedSortId, 
    setSelectedSortId
  } = useDiscover();

  const route = useRoute();
  const token = useSelector((state: RootState) => state?.auth?.token);
  
//   const route = useRoute();
  const { type, isSelectList } = route?.params || {};

  const [filterGenreString, setFilterGenreString] = useState('');
  const [platformFilterString, setPlatformFilterString] = useState('');
  const [selectedSimpleFilter, setSelectedSimpleFilter] = useState('1');
  
  // Pagination states
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Refs to prevent multiple API calls
  const isFetchingRef = useRef(false);
  const shouldLoadMoreRef = useRef(true);
  const filterFingerprintRef = useRef('');

  type MovieItem = {
    imdb_id: string;
    title: string;
    release_date: string;
    release_year: number;
    cover_image_url: string;
    rec_score: number;
  };

  const goToSearchScreen = useCallback(() => {
    navigation.navigate(ScreenNameEnum.WoodsScreen, {
      type: 'movie',
    });
  }, [navigation]);

  const getFilterTitle = useCallback((id: number | null) => {
    const filter = sortByData.find(f => f.id === id);
    return filter ? filter.label : "Rec Score";
  }, []);

  const getSortParam = useCallback((id: number | null) => {
    const filter = sortByData.find(f => f.id === id);
    return filter?.param || 'rec_score';
  }, []);

  const goToDetail = useCallback((item: MovieItem) => {
    navigation.navigate(ScreenNameEnum.MovieDetailScreen, { 
      imdb_idData: item.imdb_id, 
      token: token 
    });
  }, [navigation, token]);

  const getMediaTypeParam = useCallback((id: number | null) => {
    const typeObj = contentType.find(f => f.id === id);
    return typeObj?.params || null;
  }, []);

  // Build URL with filters
  const buildUrl = useCallback((page: number) => {
    let baseEndpoint = '';
    // if (selectedSimpleFilter === '1') baseEndpoint = '/rated-movies';
    if (selectedSimpleFilter === '1') baseEndpoint = '/recommend-movies?sort_by=rec_score';
    else if (selectedSimpleFilter === '2') baseEndpoint = '/trending';
    else if (selectedSimpleFilter === '5') baseEndpoint = '/bookmarks';
    
    let url = selectedSimpleFilter === '1' ?  `${baseEndpoint}&country=US&page=${page}` : `${baseEndpoint}?country=US&page=${page}`;
    if (filterGenreString) url += `&genres=${filterGenreString}`;
    if (platformFilterString) url += `&platforms=${platformFilterString}`;
    
    const sortParam = getSortParam(selectedSortId);
    if (sortParam) url += `&sort_by=${sortParam}`;
    
    const mediaTypeParam = getMediaTypeParam(contentSelect);
    if (mediaTypeParam) url += `&media_type=${mediaTypeParam}`;
    
    return url;
  }, [
    selectedSimpleFilter,
    filterGenreString,
    platformFilterString,
    selectedSortId,
    contentSelect,
    getSortParam,
    getMediaTypeParam,
  ]);

  // Main fetch function with proper pagination
  const fetchMovies = useCallback(async (page: number = 1, reset: boolean = false) => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log('⏸️ Already fetching, skipping...');
      return;
    }
    
    if (!token) {
      console.error('❌ No token available');
      return;
    }
    
    console.log(`🚀 Fetching page ${page}, reset: ${reset}`);
    
    // Set loading states
    if (reset) {
      setLoading(true);
      setTrending([]); // Clear existing data immediately for better UX
    } else {
      setLoadingMore(true);
    }
    
    isFetchingRef.current = true;
    shouldLoadMoreRef.current = false; // Prevent loadMore during fetch
    
    try {
      const url = buildUrl(page);
      console.log('📡 API URL:', url);
      
      const params = { token, url };
      const result = await Trending_without_Filter(params);
      
      console.log('✅ API Response:', {
        page: result?.current_page,
        totalPages: result?.total_pages,
        itemsCount: result?.results?.length,
        hasMore: result?.current_page < result?.total_pages
      });
      
      if (result?.results) {
        if (reset) {
          setTrending(result.results);
        } else {
          // Prevent duplicates
          setTrending(prev => {
            const existingIds = new Set(prev.map(m => m?.imdb_id));
            const newResults = result.results.filter(m => !existingIds.has(m.imdb_id));
            return [...prev, ...newResults];
          });
        }
        
        const currentPageNum = result.current_page || page;
        const totalPagesNum = result.total_pages || 1;
        const hasMoreData = currentPageNum < totalPagesNum;
        
        setCurrentPage(currentPageNum);
        setTotalPages(totalPagesNum);
        setHasMore(hasMoreData);
        
        console.log(`📊 Updated state - Page: ${currentPageNum}, Has More: ${hasMoreData}, Total Items: ${trending.length + result.results.length}`);
      }
    } catch (error) {
      console.error('❌ Error fetching movies:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
      shouldLoadMoreRef.current = true; // Allow loadMore again
      console.log('🏁 Fetch complete');
    }
  }, [token, buildUrl, setTrending, trending.length]);

  // Handle filter changes
  useEffect(() => {
    // Create fingerprint of current filter state
    const currentFingerprint = `${selectedSimpleFilter}-${filterGenreString}-${platformFilterString}-${selectedSortId}-${contentSelect}`;
    
    // Only fetch if filters changed
    if (filterFingerprintRef.current !== currentFingerprint) {
      console.log('🔄 Filters changed, fetching new data...');
      filterFingerprintRef.current = currentFingerprint;
      
      // Reset pagination and fetch first page
      setCurrentPage(1);
      setHasMore(true);
      fetchMovies(1, true);
    }
  }, [
    selectedSimpleFilter,
    filterGenreString,
    platformFilterString,
    selectedSortId,
    contentSelect,
    fetchMovies
  ]);

  // Handle end reached - with proper checks
  // const handleEndReached = useCallback(() => {
  //   console.log('📏 onEndReached triggered', {
  //     loading,
  //     loadingMore,
  //     currentPage,
  //     totalPages,
  //     hasMore,
  //     isFetching: isFetchingRef.current,
  //     shouldLoadMore: shouldLoadMoreRef.current
  //   });
    
  //   // Don't load if initial data is still loading
  //   if (loading) {
  //     console.log('⏸️ Skipping - Initial data still loading');
  //     return;
  //   }
    
  //   // Check all conditions
  //   if (isFetchingRef.current || loadingMore || !hasMore || !shouldLoadMoreRef.current) {
  //     console.log('⏸️ Skipping - Condition not met');
  //     return;
  //   }
    
  //   // Load next page
  //   const nextPage = currentPage + 1;
  //   console.log(`⬇️ Loading next page: ${nextPage}`);
  //   fetchMovies(nextPage, false);
  // }, [loading, loadingMore, currentPage, hasMore, fetchMovies]);

  // Pull to refresh
 
  // Render movie item
  const renderItem = useCallback(({ item }: { item: MovieItem }) => {
    return (
      <TouchableOpacity 
        onPress={() => goToDetail(item)} 
        style={styles.card}
        activeOpacity={0.7}
      >
        <FastImage
          style={styles.image}
          source={{
            uri: item?.cover_image_url,
            priority: FastImage.priority.low,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <View style={styles.rating}>
          <RankingWithInfo
            score={item?.rec_score}
            title="Rec Score"
            description="This score predicts how much you'll enjoy this movie/show, based on your ratings and our custom algorithm."
          />
        </View>
      </TouchableOpacity>
    );
  }, [goToDetail]);

  // Render footer with loading indicator
  // const renderFooter = useCallback(() => {
  //   if (loadingMore) {
  //     return (
  //       <View style={{ paddingVertical: 20, alignItems: 'center' }}>
  //         <ActivityIndicator size="large" color={Color.primary} />
  //         <Text style={{ color: Color.textGray, marginTop: 10 }}>
  //           Loading page {currentPage + 1}...
  //         </Text>
  //       </View>
  //     );
  //   }
    
  //   if (!hasMore && trending.length > 0) {
  //     return (
  //       <View style={{ paddingVertical: 20, alignItems: 'center' }}>
  //         <Text style={{ color: Color.textGray }}>
  //           No more movies available
  //         </Text>
  //       </View>
  //     );
  //   }
    
  //   return null;
  // }, [loadingMore, hasMore, currentPage, trending.length]);

  // Render empty state
  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 300 
        }}>
          <ActivityIndicator size="large" color={Color.primary} />
          <Text style={{ color: Color.textGray, marginTop: 20 }}>
            Loading movies...
          </Text>
        </View>
      );
    }
    
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 300 
      }}>
        <Text style={{ color: Color.textGray, fontSize: 16 }}>
          No movies found
        </Text>
      </View>
    );
  }, [loading]);

  // ✅ IMPORTANT: Yeh fixed height wala solution use karein
  return (
       <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <Image source={imageIndex.appLogo} style={{ height: 24, width: 24 }} /> */}
             <Image source={imageIndex.reelRecsHome}  
                    resizeMode='cover'
                    style={{
                      height: 43,
                      width: 130,
                      right:4.2
                    }} />
          {/* <Text style={styles.logo}>ReelRecs</Text> */}
        </View>

        <TouchableOpacity onPress={goToSearchScreen}>
          <Image source={imageIndex.search} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 16 }}>
        {/* Filter Bar */}
        <View style={{ marginBottom: 10, width: "100%" }}>
          <FilterBar
            isSelectList={isSelectList}
            setFilterGenreString={setFilterGenreString}
            filterGenreString={filterGenreString}
            setPlatformFilterString={setPlatformFilterString}
            platformFilterString={platformFilterString}
            selectedSimpleFilter={selectedSimpleFilter}
            setSelectedSimpleFilter={setSelectedSimpleFilter}
            token={token}
          />
        </View>

        {/* Content Type and Sort By */}
        <View style={styles.rowWrapper}>
          {/* Content Type Filter */}
          <View style={styles.contentTypeWrapper}>
            {contentType?.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => contantFilter(item)}
                style={[
                  styles.contentTypeButton,
                  contentSelect === item?.id && styles.contentTypeButtonActive,
                ]}
              >
                <CustomText
                  size={12}
                  color={Color.whiteText}
                  style={[
                    styles.contentTypeText,
                    contentSelect === item.id && styles.contentTypeTextActive,
                  ]}
                  font={font.PoppinsRegular}
                >
                  {item.type}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort By */}
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setSortByModal(true)} 
            style={styles.sortByWrapper}
          >
            <Image
              source={imageIndex.sortBy}
              style={[styles.sortIcon, styles.sortByIcon]}
              resizeMode="contain"
            />
            <CustomText
              size={12}
              color={Color.whiteText}
              style={styles.sortByLabel}
              font={font.PoppinsRegular}
            >
              Sort by:
            </CustomText>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.sortByValueWrapper} 
              onPress={() => setSortByModal(true)}
            >
              <CustomText
                size={12}
                color={Color.whiteText}
                style={styles.sortByValueText}
                font={font.PoppinsRegular}
              >
                {getFilterTitle(selectedSortId)}
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
{sortByModal &&
        <SortByModal
          visible={sortByModal}
          onClose={() => setSortByModal(false)}
          Data={sortByData}
          selectedSortId={selectedSortId}
          onSelectSort={(id) => {
            setSelectedSortId(id);
            setSortByModal(false);
          }}
        />
}      
      {/* Main Content */}
      <View style={{marginTop:15}}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={trending}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListFooterComponent={renderFooter}
            // ✅ Performance optimizations
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            // ✅ Extra data for re-renders
            extraData={{ loadingMore, hasMore }}
          />
        )}
      </View>
      
      {/* Bottom Controls */}
    </View>
    </SafeAreaView>
  );
};


export default TabPaginationScreen;