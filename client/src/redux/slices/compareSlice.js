import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('compareItems')) || [],
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.find((item) => item._id === action.payload._id)
      if (!exists) {
        state.items.push(action.payload)
        localStorage.setItem('compareItems', JSON.stringify(state.items))
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
      localStorage.setItem('compareItems', JSON.stringify(state.items))
    },
    clearCompare: (state) => {
      state.items = []
      localStorage.removeItem('compareItems')
    },
    setCompareList: (state, action) => {
      state.items = action.payload || []
      localStorage.setItem('compareItems', JSON.stringify(state.items))
    },
  },
})

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  setCompareList,
} = compareSlice.actions

export default compareSlice.reducer