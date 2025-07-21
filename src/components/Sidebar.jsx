import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderLinksForRole = () => {
    switch (role) {
      case 'employee':
        return (
          <>
            <li><Link to="/employee">Employee Dashboard</Link></li>
            <li><Link to="/apply-leave">Apply Leave</Link></li>
            <li><Link to="/leave-history">Leave History</Link></li>
          </>
        );

      case 'manager':
        return (
          <>
            <li><Link to="/manager">Manager Dashboard</Link></li>
            <li><Link to="/manager">Manage Leave Requests</Link></li>
          </>
        );

      case 'admin':
        return (
          <>
            <li><Link to="/admin">Admin Dashboard</Link></li>
            <li><Link to="/all-employees">All Employees</Link></li>
          </>
        );

      default:
        return <li><Link to="/">Home</Link></li>;
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Leave System</h2>
      <nav className="sidebar-nav">
        <ul>
          {renderLinksForRole()}
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
