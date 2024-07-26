import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTheme: 'default'
};

const grpahSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        setgraph: (state, action) => {
            state.currentTheme = action.payload;
        }
    },
});

export const { setgraph } = grpahSlice.actions;
export default grpahSlice.reducer;