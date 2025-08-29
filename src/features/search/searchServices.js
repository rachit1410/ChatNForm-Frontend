import { searchApiCalls } from "./searchApiCalls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const searchUser = createAsyncThunk("search/user", async (query) => {
    const results = await searchApiCalls.searchUser(query);
    return results.data;
});

export const searchGroup = createAsyncThunk("search/group", async (query) => {
    const result = await searchApiCalls.searchGroup(query);
    return result
})
