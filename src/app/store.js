import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/profile/redux/profileSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

