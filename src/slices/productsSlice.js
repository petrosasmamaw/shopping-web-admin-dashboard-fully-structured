import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;

const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const res = await fetch(AIRTABLE_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await res.json();
  if (!data.records) throw new Error("No products found");
  // Map Airtable image to first URL
  return data.records.map((r) => ({
    id: r.id,
    ...r.fields,
    image: r.fields.image?.[0]?.url || null,
  }));
});

// Fetch product by ID
export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id) => {
  const res = await fetch(`${AIRTABLE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await res.json();
  if (!data.id) throw new Error("Product not found");
  return { id: data.id, ...data.fields, image: data.fields.image?.[0]?.url || null };
});

// Add product
export const addProduct = createAsyncThunk("products/addProduct", async (product) => {
  // Convert image_url string to Airtable attachment format
  const payload = { ...product };
  if (product.image_url) payload.image = [{ url: product.image_url }];
  delete payload.image_url;

  const res = await fetch(AIRTABLE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: payload }),
  });
  const data = await res.json();
  if (!data.id) throw new Error("Failed to add product");
  return { id: data.id, ...data.fields, image: data.fields.image?.[0]?.url || null };
});

// Update product
// ✅ Update product (clean and compatible)
// ✅ FINAL FIXED: updateProduct for Airtable attachment format
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, updates }) => {
  // Define which fields can be updated
  const allowedFields = ["title", "price", "category", "description", "image", "image_url"];
  const payload = {};

  // Only include allowed fields that have values
  for (const key of allowedFields) {
    if (updates[key] !== undefined && updates[key] !== null && updates[key] !== "") {
      payload[key] = updates[key];
    }
  }

  // ✅ Convert image_url or image string into Airtable attachment array
  if (updates.image_url) {
    payload.image = [{ url: updates.image_url }];
    delete payload.image_url;
  } else if (typeof updates.image === "string") {
    payload.image = [{ url: updates.image }];
  }

  const res = await fetch(`${AIRTABLE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: payload }),
  });

  const data = await res.json();

  if (!data.id) {
    console.error("Airtable error:", data);
    throw new Error(data.error?.message || "Failed to update product");
  }

  // ✅ Return normalized structure
  return {
    id: data.id,
    ...data.fields,
    image: data.fields.image?.[0]?.url || null,
  };
});


// Delete product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  const res = await fetch(`${AIRTABLE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await res.json();
  if (data.deleted !== true) throw new Error("Failed to delete product");
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], selected: null, status: "idle", error: null },
  reducers: {
    clearSelected: (state) => { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

      .addCase(fetchProductById.pending, (s) => { s.status = "loading"; s.selected = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.status = "succeeded"; s.selected = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

      .addCase(addProduct.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.items = s.items.map((p) => (p.id === a.payload.id ? a.payload : p));
        if (s.selected && s.selected.id === a.payload.id) s.selected = a.payload;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.items = s.items.filter((p) => p.id !== a.payload); });
  },
});

export const { clearSelected } = productsSlice.actions;
export const selectAllProducts = (state) => state.products.items;
export const selectProductSelected = (state) => state.products.selected;
export default productsSlice.reducer;
