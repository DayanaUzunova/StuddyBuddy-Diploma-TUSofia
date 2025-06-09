import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    language: 'en',
    isFooterVisible: null
};

const generalSlice = createSlice({
    name: 'general',
    initialState: initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setIsFooterVisible: (state, action) => {
            state.isFooterVisible = action.payload
        }
    },
});

export const { setLanguage, setIsFooterVisible } = generalSlice.actions;
export default generalSlice.reducer;