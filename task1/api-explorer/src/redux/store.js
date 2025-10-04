import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice"; // We'll create this next

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;
