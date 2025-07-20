import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [balances, setBalances] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editRow, setEditRow] = useState(null);
  const [newBalance, setNewBalance] = useState("");

  const handleResetBalances = async () => {
    const confirm = window.confirm(
      "This will reset leave balances for all users for the current year. Continue?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://leave-system-server.onrender.com/api/admin/reset-balances",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Leave balances reset successfully!");
      fetchData(); // refresh balance and logs
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset balances");
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const [balanceRes, logsRes] = await Promise.all([
        axios.get("https://leave-system-server.onrender.com/api/admin/leave-balances", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://leave-system-server.onrender.com/api/admin/audit-logs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Fetched Balances:", balanceRes.data);
      console.log("Fetched Logs:", logsRes.data);
      setBalances(balanceRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(
        "Fetch Admin Data Error:",
        err.response || err.message || err
      );
      alert(err.response?.data?.message || "Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBalance = async (item) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://leave-system-server.onrender.com/api/admin/leave-balances",
        {
          user_id: item.user_id,
          type: item.type,
          year: item.year,
          balance: parseInt(newBalance),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Balance updated");
      setEditRow(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <Sidebar role="admin" />
      <div className="admin-dashboard">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="section-title">Leave Balances</h2>
            <button onClick={handleResetBalances} className="reset-btn">
              🔁 Reset Yearly Leave Balances
            </button>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(balances) && balances.length > 0 ? (
                  balances.map((item, index) => (
                    <tr key={index}>
                      <td>{item.User?.name || "N/A"}</td>
                      <td>{item.User?.email || "N/A"}</td>
                      <td>{item.type}</td>
                      <td>{item.year}</td>
                      <td>
                        {editRow === index ? (
                          <input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                          />
                        ) : (
                          item.balance
                        )}
                      </td>
                      <td>
                        {editRow === index ? (
                          <>
                            <button onClick={() => handleUpdateBalance(item)}>
                              Save
                            </button>
                            <button onClick={() => setEditRow(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditRow(index);
                              setNewBalance(item.balance);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No leave balance data available.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Audit Logs Table */}
            <h2 className="section-title">Audit Logs</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(logs) && logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.User?.name || "N/A"}</td>
                      <td>{log.User?.email || "N/A"}</td>
                      <td>{log.action_type}</td>
                      <td>{log.action_target}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No audit logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
