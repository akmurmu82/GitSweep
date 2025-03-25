import { configureStore } from "@reduxjs/toolkit";
import repoReducer from "./features/slices/repoSlice";

export const store = configureStore({
    reducer: {
        repos: repoReducer,  // Attach repo reducer
    },
});

export default store;
