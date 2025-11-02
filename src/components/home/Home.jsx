import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import Statistics from "../Statistics";

const Home = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let q = supabase.from("orders").select("*").order("order_date", { ascending: false });
        if (!isAdminView && user?.id) q = q.eq("user_id", user.id);
        const { data, error } = await q;
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user, isAdminView]);

  if (!user) return <p className="card text-center">Please login to view your orders.</p>;

  const fmtUsd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

  return (
    <div className="container">
      <Statistics />
      <h2 style={{marginTop:20}}>📦 Orders {isAdminView ? "(Admin View)" : "(My Orders)"}</h2>
      <button className="ghost" onClick={() => setIsAdminView((p) => !p)}>{isAdminView ? "Switch to My Orders" : "Switch to Admin View"}</button>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : orders.map((order) => {
        const items = Array.isArray(order.cart_data) ? order.cart_data : [];
        const itemNames = Array.isArray(order.item_names) ? order.item_names : [];
        return (
          <div key={order.id} className="order-card">
            <p><b>Date:</b> {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}</p>
            <p><b>Total:</b> {fmtUsd(order.total_price)}</p>
            <p><b>Status:</b> {order.status || "-"}</p>
            {isAdminView && <p><b>Customer:</b> {order.user_email || "-"}</p>}
            <p><b>Items:</b> {itemNames.join(", ")}</p>
            <ul>{items.map((it, idx) => (<li key={it.id ?? idx}>{it.title} (x{it.quantity}) - {fmtUsd(it.price)}</li>))}</ul>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
