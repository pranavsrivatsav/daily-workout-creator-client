import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import rootReducer from "./reducers";
import { workoutService } from "../services/querier";

// Store configuration will go here
// You can import your reducers here
// import userReducer from '../features/user/userSlice';
// import workoutReducer from '../features/workouts/workoutSlice';

export const store = configureStore({
  reducer: rootReducer,
  // Optional: configure middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workoutService.middleware),
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: create typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
