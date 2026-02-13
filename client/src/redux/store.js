import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import filterReducer from "./slices/filterSlice";
import orderReducer from "./slices/orderSlice";
import compareReducer from "./slices/compareSlice";

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
  // Optional: add middleware for debugging or async handling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings for non‑serializable values (like localStorage)
    }),
  devTools: process.env.NODE_ENV !== "production", // enable Redux DevTools only in dev
});

export default store;