import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../slices/productsSlice";

const AdminAddProduct = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ title: "", price: "", category: "", description: "", image_url: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return setMsg({ type: "error", text: "Title and price required" });
    setLoading(true);
    setMsg(null);
    try {
      await dispatch(addProduct({ ...form, price: Number(form.price) })).unwrap();
      setMsg({ type: "success", text: "Product added" });
      setForm({ title: "", price: "", category: "", description: "", image_url: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Add Product</h2>
      {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={change} required />
        </div>
        <div className="form-group">
          <label>Price *</label>
          <input name="price" type="number" value={form.price} onChange={change} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input name="category" value={form.category} onChange={change} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={change} />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input name="image_url" value={form.image_url} onChange={change} />
          {form.image_url && <img src={form.image_url} alt="preview" className="product-preview" />}
        </div>

        <button type="submit" className="primary" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
