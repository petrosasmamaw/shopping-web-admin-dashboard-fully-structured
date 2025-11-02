import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/home/Home";
import AdminAddProduct from "./components/admin/AdminAddProduct";
import AdminComments from "./components/admin/AdminComments";
import ProductsList from "./components/admin/ProductsList";
import ProductDetail from "./components/admin/ProductDetail";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { supabase } from "./components/supabase/supabaseClient";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/admin/manage-product" element={<ProductsList />} />
        <Route path="/admin/product/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
};

export default App;
