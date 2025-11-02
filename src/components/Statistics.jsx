import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabase/supabaseClient";

const Statistics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data: ordersData, error } = await supabase.from("orders").select("user_email, total_price");
        if (error) throw error;

        setTotalOrders(ordersData.length);
        setTotalRevenue(ordersData.reduce((sum, o) => sum + Number(o.total_price || 0), 0));
        setTotalUsers([...new Set(ordersData.map((o) => o.user_email))].length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatistics();
  }, []);

  const fmtUsd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="statistics">
      <h2>📊 Shop Statistics</h2>
      <div className="stats">
        <div className="stat-card"><h3>Total Users</h3><p>{totalUsers}</p></div>
        <div className="stat-card"><h3>Total Orders</h3><p>{totalOrders}</p></div>
        <div className="stat-card"><h3>Total Revenue</h3><p>{fmtUsd(totalRevenue)}</p></div>
      </div>
    </div>
  );
};

export default Statistics;
