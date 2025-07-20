import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { saveToken, parseJWT } from '../../../../client/src/utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch all users (admin)
export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

// Login user
export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
  saveToken(res.data.token);
  return { user: res.data.user, token: res.data.token };
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUserFromToken: (state, action) => {
      state.token = action.payload;
      state.user = parseJWT(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      });
  },
});

export const { logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
