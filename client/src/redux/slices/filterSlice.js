import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [],
  priceRange: { min: 0, max: 10000 },
  maxPrice: 10000,
  filtersReady: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.selectedCategories = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setMaxPrice(state, action) {
      const value = Number(action.payload);
      state.maxPrice = isNaN(value) ? state.maxPrice : value;
    },
    setPriceRange(state, action) {
      const { min, max } = action.payload || {};
      state.priceRange = {
        min: typeof min === "number" ? min : state.priceRange.min,
        max: typeof max === "number" ? max : state.priceRange.max,
      };
    },
    setFiltersReady(state, action) {
      state.filtersReady = Boolean(action.payload);
    },
    resetFilters(state) {
      state.selectedCategories = [];
      state.priceRange = { min: 0, max: state.maxPrice };
      state.filtersReady = false;
    },
  },
});

export const {
  setCategories,
  setMaxPrice,
  setPriceRange,
  setFiltersReady,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;