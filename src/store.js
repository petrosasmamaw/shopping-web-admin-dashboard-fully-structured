import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import commentsReducer from "./slices/commentsSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    comments: commentsReducer,
  },
  devTools: true,
});

export default store;
