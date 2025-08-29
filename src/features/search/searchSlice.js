import { createSlice } from "@reduxjs/toolkit";
import { searchUser, searchGroup } from "./searchServices";

const initialState = {
  hits: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.hits = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hits = [];
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.hits = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hits = [];
      })
      .addCase(searchGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.hits = action.payload.data;
      })
      .addCase(searchGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
