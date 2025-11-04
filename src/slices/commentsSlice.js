// src/slices/commentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ===== Airtable Configuration ===== */
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const COMMENTS_TABLE = import.meta.env.VITE_AIRTABLE_COMMENTS_TABLE;
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${COMMENTS_TABLE}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

/* ===== Fetch comments (all or for specific productId) ===== */
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (productId = null) => {
    try {
      let url = AIRTABLE_URL;
      if (productId) {
        const filter = encodeURIComponent(`{product_id}='${productId}'`);
        url += `?filterByFormula=${filter}`;
      }

      const res = await axios.get(url, { headers });
      return res.data.records.map((r) => ({
        id: r.id,
        ...r.fields,
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }
);

/* ===== Add comment ===== */
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ product_id, user_id, content }) => {
    try {
      const payload = {
        records: [
          {
            fields: { product_id, user_id, content },
          },
        ],
      };

      const res = await axios.post(AIRTABLE_URL, payload, { headers });
      return { id: res.data.records[0].id, ...res.data.records[0].fields };
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }
);

/* ===== Delete comment ===== */
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id) => {
    try {
      await axios.delete(`${AIRTABLE_URL}/${id}`, { headers });
      return id;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }
);

/* ===== Slice Definition ===== */
const commentsSlice = createSlice({
  name: "comments",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

/* ===== Selectors ===== */
export const selectComments = (state) => state.comments.items;

/* ===== Export Reducer ===== */
export default commentsSlice.reducer;
