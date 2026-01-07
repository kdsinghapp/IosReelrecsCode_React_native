// redux/slices/multiSelectSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMultiSelectMode: false,
};

const multiSelectSlice = createSlice({
  name: 'multiSelect',
  initialState,
  reducers: {
    setMultiSelectMode: (state, action) => {
      state.isMultiSelectMode = action.payload;
    },
    toggleMultiSelectMode: (state) => {
      state.isMultiSelectMode = !state.isMultiSelectMode;
    },
  },
});

export const { setMultiSelectMode, toggleMultiSelectMode } = multiSelectSlice.actions;
export default multiSelectSlice.reducer;
