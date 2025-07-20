import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchMyLeaves } from '../redux/slices/leaveSlice';
import Sidebar from '../components/Sidebar';
import '../styles/LeaveHistoryPage.css';

const LeaveHistoryPage = () => {
  const dispatch = useDispatch();
  const { myLeaves, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const handleCancelLeave = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this leave?');
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://leave-system-server.onrender.com/api/leaves/${id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Leave cancelled successfully');
      dispatch(fetchMyLeaves()); // Refresh leave list
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling leave');
    }
  };

  return (
    <div className="leave-history-wrapper">
      <Sidebar />
      <div className="leave-history">
        <h1 className="leave-history-title">My Leave History</h1>

        {loading ? (
          <p className="info-text">Loading...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : myLeaves.length === 0 ? (
          <p className="info-text">No leave records found.</p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.from_date}</td>
                  <td>{leave.to_date}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    {leave.status === 'pending' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancelLeave(leave.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveHistoryPage;
