import {configureStore} from '@reduxjs/toolkit';
import authReducer from './state/authStates';

const store=configureStore({
    reducer:{
        auth:authReducer
    }
});
export default store;