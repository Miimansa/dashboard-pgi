import { createSlice } from '@reduxjs/toolkit';
//set by default values here
const initialState = {
  from_date: "01/01/2010",
  to_date: "12/31/2019",
  group: "Monthly",
  department: "",
  loading: false
};
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    setFrom_date: (state, action) => {
      state.from_date = action.payload;
    },
    setTo_date: (state, action) => {
      state.to_date = action.payload;
    },
    setloading_text: (state, action) => {
      state.loading = action.payload;
    },
    clearFilters: (state) => {
      return initialState; // Reset state to initial values
    },
  },
});

export const { setDepartment, setGroup, setFrom_date, setTo_date, setloading_text, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
