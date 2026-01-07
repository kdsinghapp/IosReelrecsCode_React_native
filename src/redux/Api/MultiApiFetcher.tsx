// components/common/MultiApiFetcher.tsx

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Trending_without_Filter } from './movieApi';
import { Color } from '../../theme/color';


interface MultiApiFetcherProps {
  urls: { [key: string]: string }; // e.g. { trending: '/trending?country=US' }
  onDataFetched: (data: { [key: string]: any[] }) => void;
}
const MultiApiFetcher = ({ urls, onDataFetched }: MultiApiFetcherProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    setLoading(true);
console.log('screen___start')
    const fetchAll = async () => {
      try {
        const entries = Object.entries(urls); // [["trending", "..."], ["popular", "..."]]

        const responses = await Promise.all(
          entries.map(async ([key, url]) => {
            try {
              const res = await Trending_without_Filter({ token, url });
              console.log('Multiapi_Fetch__', res?.results , 'home__data_')
              return [key, res?.results ?? []]; // ✅ nullish coalescing
            } catch (error) {
              console.error(`Error fetching ${key}:`, error);
              return [key, []];
            }
          })
        );

        if (isMounted) {
          const results = Object.fromEntries(responses);
          console.log(results , 'results_home_KA_data')
          onDataFetched(results);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();

    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, [urls, token, onDataFetched]);


  // if (loading) {
  //   return <ActivityIndicator size="large" style={{ marginTop: 20 }} color={Color.primary} />;
  // }

  return null;
};

// export default MultiApiFetcher;
export default React.memo(MultiApiFetcher);
