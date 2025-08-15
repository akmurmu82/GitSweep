import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Fetch Repos from Backend
export const fetchRepos = createAsyncThunk("repos/fetchRepos", async (_, thunkAPI) => {
    try {
        const response = await api.get('/repos');
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch repos:", error);

        let errorMessage = "Failed to fetch repositories";
        
        if (error.response) {
            // Server responded with error status
            if (error.response.status === 401) {
                errorMessage = "Authentication failed. Please log in again.";
            } else if (error.response.status === 403) {
                errorMessage = "Access forbidden. Please check your permissions.";
            } else if (error.response.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            } else {
                errorMessage = error.response.data?.error || errorMessage;
            }
        } else if (error.request) {
            // Network error
            errorMessage = "Network error. Please check your connection.";
        }

        return thunkAPI.rejectWithValue(errorMessage);
    }
});

const repoSlice = createSlice({
    name: "repos",
    initialState: {
        list: [],
        filteredList: [],
        status: "idle", // idle, loading, succeeded, failed
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
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepos.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchRepos.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
                state.filteredList = action.payload;
                state.error = null;
            })
            .addCase(fetchRepos.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.list = [];
                state.filteredList = [];
            });
    },
});

export const { setFilterType, setSearchQuery, deleteRepo, clearError } = repoSlice.actions;
export default repoSlice.reducer;