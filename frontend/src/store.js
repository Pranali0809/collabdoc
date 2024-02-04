import {configureStore} from '@reduxjs/toolkit';
import authReducer from './state/authStates';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
  } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig={key:"root",storage,version:1}
const persistedReducer= persistReducer(persistConfig,authReducer);
const store=configureStore({
    reducer:{
        auth:persistedReducer
    },
    middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
    },
}),
});
export default store;