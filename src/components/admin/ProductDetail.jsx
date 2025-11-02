import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateProduct, deleteProduct, selectProductSelected } from "../../slices/productsSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectProductSelected);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => { if (product) setForm(product); }, [product]);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    try {
      await dispatch(updateProduct({ id, updates: { ...form, price: Number(form.price) } })).unwrap();
      setEditing(false);
      alert("Saved");
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  const del = async () => {
    if (!confirm("Delete product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      navigate("/admin/manage-product");
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <h2 className="page-title">Manage Product</h2>
        <div className="product-content">
          <img src={product.image_url || product.image || "https://via.placeholder.com/300"} alt={product.title} className="product-image" />
          <div className="product-info">
            {editing ? (
              <>
                <div className="form-group"><label>Title</label><input name="title" value={form.title || ""} onChange={change} className="input-box" /></div>
                <div className="form-group"><label>Price</label><input name="price" value={form.price || ""} onChange={change} className="input-box" /></div>
                <div className="form-group"><label>Category</label><input name="category" value={form.category || ""} onChange={change} className="input-box" /></div>
                <div className="form-group"><label>Description</label><textarea name="description" value={form.description || ""} onChange={change} className="textarea-box" /></div>
                <div className="button-group">
                  <button className="btn btn-save" onClick={save}>💾 Save Changes</button>
                  <button className="btn btn-cancel" onClick={() => setEditing(false)}>❌ Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-meta">💰 Price: ETB {product.price}</p>
                <p className="product-meta">📦 Category: {product.category}</p>
                <div className="button-group">
                  <button className="btn btn-edit" onClick={() => setEditing(true)}>✏️ Edit</button>
                  <button className="btn btn-delete" onClick={del}>🗑 Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
