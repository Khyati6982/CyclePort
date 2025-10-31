import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Create a new order (called after payment success)
export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, thunkAPI) => {
  try {
    const { data } = await axios.post('/api/orders', orderData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

// Fetch orders for logged-in user
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/orders/user');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch user orders');
  }
});

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/orders/admin');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch all orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
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
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;