import { configureStore } from '@reduxjs/toolkit';

import generalReducer from './slices/generalSlice'

export const store = configureStore({
    reducer: {
        general: generalReducer
    },
});