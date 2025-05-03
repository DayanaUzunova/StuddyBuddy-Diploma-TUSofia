import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    language: ''
};

const generalSlice = createSlice({
    name: 'general',
    initialState: initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { setLanguage } = generalSlice.actions;
export default generalSlice.reducer;