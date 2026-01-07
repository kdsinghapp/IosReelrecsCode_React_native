import React, { FunctionComponent, useEffect, useRef } from 'react';
import { LogBox, NativeModules, Text, TextInput,  } from 'react-native';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigators/AppNavigator'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

LogBox.ignoreAllLogs(true);
// https://reelrecs.s3.us-east-1.amazonaws.com/static/movies/trailers/compressed/tt1645170/tt1645170.m3u8
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.underlineColorAndroid = "transparent";
LogBox.ignoreLogs(["HorizontalScrollView can host only one direct child"]);
const App: FunctionComponent<any> = () => {

  const { AndroidExoPlayerCache } = NativeModules;
  useEffect(() => {
    // Suppress specific warning messages
    (async () => {
      await AndroidExoPlayerCache.trimCache(100 * 1024 * 1024);
    })
  }, [])


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

  return (
      <QueryClientProvider client={queryClient}> 
      <AppNavigator />
     </QueryClientProvider>
  );
}

export default App;
      // setRatedMovie(res_All_Rated?.results?.slice(0,9) ?? []);
