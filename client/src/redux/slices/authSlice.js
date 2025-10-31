import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { clearCart } from './cartSlice';

// Thunk: Fetch logged-in user's profile
export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/users/profile');
    return data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Profile fetch failed');
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cartUserId', user._id);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('cartUserId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('cartUserId', action.payload._id);
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        localStorage.removeItem('cartUserId');
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;