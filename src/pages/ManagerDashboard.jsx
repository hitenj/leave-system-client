import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeaves } from '../redux/slices/leaveSlice';
import LeaveCard from '../components/LeaveCard';
import Sidebar from '../components/Sidebar';
import '../styles/ManagerDashboard.css';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { allLeaves, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate('/');
    } else {
      dispatch(fetchAllLeaves());
    }
  }, [dispatch, user, navigate]);

  return (
    <div className="manager-dashboard-wrapper">
      <Sidebar role={user?.role} />
      <div className="manager-dashboard">
        <h1 className="dashboard-title">Manager Dashboard - Welcome, {user?.name}</h1>

        <h2 className="section-title">Team Leave Requests</h2>

        {loading ? (
          <p className="info-text">Loading...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : allLeaves.length === 0 ? (
          <p className="info-text">No leave records found.</p>
        ) : (
          allLeaves.map((leave) => (
            <LeaveCard key={leave.id} leave={leave} isManagerView={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
