import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userSlice';
import expenseReducer from './expenseSlice';
import paramsReducer from '../reducer/paramsSlice';
import banksReducer from '../reducer/banksSlice';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  user: userReducer,
  expense: expenseReducer,
  params:paramsReducer,
  banks:banksReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

const persistor = persistStore(store);
export { store, persistor };