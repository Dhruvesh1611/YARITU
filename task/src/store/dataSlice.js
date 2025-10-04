import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_ENDPOINTS = {
  pokemon: 'https://pokeapi.co/api/v2/pokemon',
  github: 'https://api.github.com/users',
  weather: 'https://api.openweathermap.org/data/2.5/weather',
};

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async ({ apiType, query = '' }, { rejectWithValue }) => {
    try {
      const queryPrefix = query && !query.startsWith('?') && !query.startsWith('/') ? '/' : '';
      const response = await axios.get(`${API_ENDPOINTS[apiType]}${queryPrefix}${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  selectedApi: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSelectedApi: (state, action) => {
      state.selectedApi = action.payload;
    },
    clearData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedApi, clearData } = dataSlice.actions;
export default dataSlice.reducer; 