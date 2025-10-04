import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk function to fetch API data
export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (apiUrl, { rejectWithValue }) => {
    try {
      console.log(`Fetching data from: ${apiUrl}`);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      console.error("API fetch error:", err);
      return rejectWithValue(err.message || "An error occurred while fetching data");
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearData } = dataSlice.actions;
export default dataSlice.reducer;
