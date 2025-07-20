import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch current user's leaves (employee)
export const fetchMyLeaves = createAsyncThunk('leaves/fetchMyLeaves', async (_, thunkAPI) => {
  try {
    const res = await axios.get('https://leave-system-server.onrender.com/api/leaves/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Unable to fetch leaves');
  }
});

// ✅ Fetch all leaves (manager)
export const fetchAllLeaves = createAsyncThunk('leaves/fetchAllLeaves', async (_, thunkAPI) => {
  try {
    const res = await axios.get('https://leave-system-server.onrender.com/api/leaves', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Unable to fetch all leaves');
  }
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    myLeaves: [],
    allLeaves: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // My Leaves (Employee)
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // All Leaves (Manager)
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.allLeaves = action.payload;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;
