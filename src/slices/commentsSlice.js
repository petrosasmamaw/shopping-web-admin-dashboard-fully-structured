import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../components/supabase/supabaseClient";

/* fetch comments (all or for productId) */
export const fetchComments = createAsyncThunk("comments/fetchComments", async (productId = null) => {
  let q = supabase.from("comments").select("*").order("created_at", { ascending: false });
  if (productId) q = q.eq("product_id", productId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
});

/* add comment */
export const addComment = createAsyncThunk("comments/addComment", async (comment) => {
  const { data, error } = await supabase.from("comments").insert([comment]).select();
  if (error) throw new Error(error.message);
  return data[0];
});

/* delete comment */
export const deleteComment = createAsyncThunk("comments/deleteComment", async (id) => {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return id;
});

const commentsSlice = createSlice({
  name: "comments",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (s) => { s.status = "loading"; })
      .addCase(fetchComments.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
      .addCase(fetchComments.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

      .addCase(addComment.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteComment.fulfilled, (s, a) => { s.items = s.items.filter((c) => c.id !== a.payload); });
  },
});

export const selectComments = (state) => state.comments.items;
export default commentsSlice.reducer;
