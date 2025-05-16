import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Fetch Repos from Backend
export const fetchRepos = createAsyncThunk("repos/fetchRepos", async () => {
    const response = await axios.get(`${backendUrl}/repos`, { withCredentials: true });
    return response.data;
});

const repoSlice = createSlice({
    name: "repos",
    initialState: {
        list: [],
        filteredList: [],
        status: "idle",
        error: null,
        filterType: "all", // all, private, forked, public
        searchQuery: "",
    },
    reducers: {
        setFilterType: (state, action) => {
            state.filterType = action.payload;
            state.filteredList = state.list.filter((repo) => {
                if (state.filterType === "private") return repo.private;
                if (state.filterType === "forked") return repo.fork;
                if (state.filterType === "public") return !repo.private;
                return true;
            });
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredList = state.list.filter((repo) =>
                repo.name.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        deleteRepo: (state, action) => {
            state.list = state.list.filter((repo) => repo.full_name !== action.payload);
            state.filteredList = state.filteredList.filter((repo) => repo.full_name !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepos.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchRepos.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
                state.filteredList = action.payload;
            })
            .addCase(fetchRepos.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const { setFilterType, setSearchQuery, deleteRepo } = repoSlice.actions;
export default repoSlice.reducer;
