import {createSlice} from '@reduxjs/toolkit';
export const SettingsSlice = createSlice({
    name: 'settings',
    initialState: {
        loader: 'hidden'
    },
    reducers: {
        showLoader: (state) => {
            state.loader = '';
        },
        hideLoader: (state) => {
            state.loader = 'hidden';
        }
    }
});
export const {showLoader, hideLoader} = SettingsSlice.actions;
export default SettingsSlice.reducer;