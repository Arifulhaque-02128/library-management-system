import { configureStore } from "@reduxjs/toolkit";
import BookReducer from "@/lib/Redux/features/handleBooks";
import baseApi from "@/lib/Redux/features/handleApi";

export const store = configureStore({
  reducer: {
    bookData : BookReducer,
    [baseApi.reducerPath]: baseApi.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(baseApi.middleware), // Custom logger and RTK Query middleware
});