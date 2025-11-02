import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectAllProducts } from "../../slices/productsSlice";
import { Link } from "react-router-dom";
import SearchBar from "../ui/SearchBar";

const ProductsList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const [searchItem, setSearchItem] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const filtered = searchItem
    ? products.filter((p) => p.title?.toLowerCase().includes(searchItem.toLowerCase()))
    : products.filter((p) => (category ? p.category === category : true));

  return (
    <div>
      <SearchBar setSearchItem={setSearchItem} />
      {!searchItem && (
        <div className="group-buttons" style={{textAlign: "center", marginBottom: 12}}>
          <button onClick={() => setCategory("")}>All Products</button>
          <button onClick={() => setCategory("Electronics")}>Electronics</button>
          <button onClick={() => setCategory("Jewelry")}>Jewelry</button>
          <button onClick={() => setCategory("Mens clothing")}>Mens Clothing</button>
          <button onClick={() => setCategory("Womens clothing")}>Womens Clothing</button>
        </div>
      )}

      <div className="products-grid">
        {filtered.length ? filtered.map((p) => (
          <div key={p.id} className="product-card">
            <h2>{p.title}</h2>
            <img src={p.image_url || p.image || "https://via.placeholder.com/200"} alt={p.title} style={{width:"100%", height:"200px", objectFit:"cover", borderRadius: 10}}/>
            <h3>Price: ETB {p.price}</h3>
            <p>{p.category}</p>
            <Link to={`/admin/product/${p.id}`}><button>Manage Product</button></Link>
          </div>
        )) : <p style={{textAlign:"center"}}>No products found.</p>}
      </div>
    </div>
  );
};

export default ProductsList;
