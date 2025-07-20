import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves } from '../redux/slices/leaveSlice';
import Sidebar from '../components/Sidebar';
import '../styles/LeaveStatusPage.css';

const LeaveStatusPage = () => {
  const dispatch = useDispatch();
  const { myLeaves, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  return (
    <div className="leave-status-wrapper">
      <Sidebar />
      <div className="leave-status">
        <h1 className="leave-status-title">Leave Application Status</h1>

        {loading ? (
          <p className="info-text">Loading leave statuses...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : myLeaves.length === 0 ? (
          <p className="info-text">No leave applications found.</p>
        ) : (
          <table className="status-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.fromDate}</td>
                  <td>{leave.toDate}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>{leave.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveStatusPage;
