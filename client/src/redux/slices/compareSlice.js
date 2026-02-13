import { createSlice } from "@reduxjs/toolkit";

const loadCompareFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("compareItems")) || [];
  } catch {
    console.warn("Failed to parse compareItems from localStorage.");
    return [];
  }
};

const saveCompareToStorage = (items) => {
  try {
    localStorage.setItem("compareItems", JSON.stringify(items));
  } catch {
    console.warn("Unable to persist compareItems in localStorage.");
  }
};

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: loadCompareFromStorage(),
  },
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        saveCompareToStorage(state.items);
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCompareToStorage(state.items);
    },
    clearCompare: (state) => {
      state.items = [];
      try {
        localStorage.removeItem("compareItems");
      } catch {
        console.warn("Unable to clear compareItems from localStorage.");
      }
    },
    setCompareList: (state, action) => {
      state.items = action.payload || [];
      saveCompareToStorage(state.items);
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  setCompareList,
} = compareSlice.actions;

export default compareSlice.reducer;