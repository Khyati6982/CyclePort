import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedCategories: [],
  priceRange: { min: 0, max: 10000 },
  maxPrice: 10000,
  filtersReady: false,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.selectedCategories = action.payload
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload
    },
    setFiltersReady(state, action) {
      state.filtersReady = action.payload
    },
    resetFilters(state) {
      state.selectedCategories = []
      state.maxPrice = state.priceRange.max
    },
  },
})

export const {
  setCategories,
  setMaxPrice,
  setPriceRange,
  setFiltersReady,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer