import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Create a new order (called after payment success)
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const { data } = await axios.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.order; // return the order object
    } catch (err) {
      console.error("Create order error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// Fetch orders for logged-in user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const { data } = await axios.get("/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.orders; // return array of orders
    } catch (err) {
      console.error("Fetch user orders error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const { data } = await axios.get("/api/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.orders; // return array of orders
    } catch (err) {
      console.error("Fetch all orders error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    userOrders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.userOrders = [];
      state.allOrders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.userOrders.push(action.payload);
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create order";
      })

      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user orders";
      })

      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.orders)
          ? action.payload.orders
          : [];
        state.loading = false;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all orders";
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;