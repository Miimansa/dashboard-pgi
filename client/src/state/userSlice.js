import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    user: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        },
        clearUser: (state) => {
            state.token = null;
            state.user = "";
        },
        setuserTheme: (state, action) => {
            if (state.user) {
                state.user.theme = action.payload;
            }
        }
    },
});

export const { setUser, setToken, clearToken, clearUser, setuserTheme } = userSlice.actions;
export default userSlice.reducer;
