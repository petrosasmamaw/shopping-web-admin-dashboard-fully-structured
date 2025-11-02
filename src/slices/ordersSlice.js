import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../components/supabase/supabaseClient";

/* fetch orders (all or by user) */
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (userId = null) => {
  let q = supabase.from("orders").select("*").order("order_date", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
});

/* add order */
export const addOrder = createAsyncThunk("orders/addOrder", async (order) => {
  const { data, error } = await supabase.from("orders").insert([order]).select();
  if (error) throw new Error(error.message);
  return data[0];
});

/* delete order */
export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (orderId) => {
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw new Error(error.message);
  return orderId;
});

/* logout clears orders in store (no server action) */
export const logoutOrders = createAsyncThunk("orders/logoutOrders", async () => {
  // optional: sign out handled elsewhere; here we just return empty array
  return [];
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.status = "loading"; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

      .addCase(addOrder.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteOrder.fulfilled, (s, a) => { s.items = s.items.filter((o) => o.id !== a.payload); })

      .addCase(logoutOrders.fulfilled, (s) => { s.items = []; s.status = "idle"; });
  },
});

export const selectOrders = (state) => state.orders.items;
export default ordersSlice.reducer;
