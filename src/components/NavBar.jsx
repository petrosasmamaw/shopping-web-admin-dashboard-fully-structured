import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../components/supabase/supabaseClient";

const NavBar = ({ user, setUser }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="navbar card">
      <h1>Shopping App Admin</h1>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/"><button className="ghost">Home</button></Link>
            <Link to="/admin/add-product"><button className="ghost">Add Product</button></Link>
            <Link to="/admin/comments"><button className="ghost">Manage Comments</button></Link>
            <Link to="/admin/manage-product"><button className="ghost">Manage Products</button></Link>
            <button className="primary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register"><button className="ghost">Register</button></Link>
            <Link to="/login"><button className="primary">Login</button></Link>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
