import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface DummyState {
  value: number;
  loading: boolean;
  error: string | null;
  items: string[];
}

// Initial state
const initialState: DummyState = {
  value: 0,
  loading: false,
  error: null,
  items: [],
};

// Create slice
const dummySlice = createSlice({
  name: "dummy",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item !== action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
});

// Export actions
export const {
  increment,
  decrement,
  setValue,
  setLoading,
  setError,
  addItem,
  removeItem,
  clearItems,
} = dummySlice.actions;

// Export reducer
export default dummySlice.reducer;
