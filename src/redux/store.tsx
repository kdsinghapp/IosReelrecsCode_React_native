import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from './feature/authSlice';   // work
import userReducer from './feature/userSlice';
import multiSelectReducer  from './feature/multiSelectSlice';
import modalReducer  from '../redux/feature/modalSlice/modalSlice';
import videoAudioReducer from '../redux/feature/videoAudioSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  multiSelect: multiSelectReducer,  
  // multiSelect: modalReducer,  
   modal: modalReducer, 
    videoAudio: videoAudioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
