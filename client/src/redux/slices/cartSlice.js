import { createSlice } from "@reduxjs/toolkit";

// Helpers
const loadCartFromStorage = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedUserId = localStorage.getItem("cartUserId");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

    if (!storedUserId || storedUserId !== currentUserId) {
      localStorage.removeItem("cart"); // mismatch → purge
      localStorage.removeItem("cartUserId"); // optional double-check
      return [];
    }

    return storedCart;
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.items.push({ ...action.payload, quantity: 1 });
        saveCartToStorage(state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
      localStorage.removeItem("cartUserId"); // reset binding
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
    mergeGuestCart: (state) => {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart.forEach((guestItem) => {
        const exists = state.items.find((item) => item._id === guestItem._id);
        if (!exists) {
          state.items.push(guestItem);
        }
      });
      saveCartToStorage(state.items);
      localStorage.removeItem("guestCart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  mergeGuestCart,
} = cartSlice.actions;

export default cartSlice.reducer;