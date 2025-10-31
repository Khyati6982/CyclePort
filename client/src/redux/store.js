import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import usersReducer from './slices/userSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import filterReducer from './slices/filterSlice'
import orderReducer from './slices/orderSlice'
import compareReducer from './slices/compareSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    cart: cartReducer,
    products: productReducer,
    filters: filterReducer,
    orders: orderReducer,
    compare: compareReducer,
  },
})

export default store