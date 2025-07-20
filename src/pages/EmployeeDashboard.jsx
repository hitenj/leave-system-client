import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves } from '../redux/slices/leaveSlice';
import LeaveCard from '../components/LeaveCard';
import Sidebar from '../components/Sidebar';
import '../styles/EmployeeDashboard.css';
import axios from 'axios';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myLeaves, loading, error } = useSelector((state) => state.leave);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    dispatch(fetchMyLeaves());
    fetchMyBalances();
  }, [dispatch]);

  const fetchMyBalances = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/leaves/my-balances', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBalances(res.data);
  } catch (err) {
    console.error('Failed to load balances');
  }
};


  

  return (
    <div className="employee-dashboard-wrapper">
      <Sidebar />
      <div className="employee-dashboard">
        <h1 className="dashboard-title">Welcome, {user?.name}</h1>

        <div className="quick-links">
          <a href="/apply-leave" className="quick-link-btn">Apply for Leave</a>
          <a href="/history" className="quick-link-btn">Leave History</a>
        </div>

        <h2 className="section-title">Your Leave Balances</h2>
        {balances.length === 0 ? (
          <p className="info-text">No balance records found.</p>
        ) : (
          <table className="balance-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Year</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((b, i) => (
                <tr key={i}>
                  <td>{b.type}</td>
                  <td>{b.year}</td>
                  <td>{b.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="section-title">My Leave History</h2>
        {loading ? (
          <p className="info-text">Loading...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : myLeaves.length === 0 ? (
          <p className="info-text">No leave records found.</p>
        ) : (
          myLeaves.map((leave) => <LeaveCard key={leave.id} leave={leave} />)
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
