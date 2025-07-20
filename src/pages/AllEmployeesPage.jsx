import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../redux/slices/authSlice';
import Sidebar from '../components/Sidebar';
import '../styles/AllEmployeesPage.css';

const AllEmployeesPage = () => {
  const dispatch = useDispatch();
  const { allUsers = [], loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="all-employees-wrapper">
      <Sidebar role="admin" />
      <div className="all-employees-page">
        <h1 className="page-title">All Employees</h1>

        {loading ? (
          <p className="info-text">Loading employees...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : allUsers.length === 0 ? (
          <p className="info-text">No employees found.</p>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {allUsers
                .filter((user) => user.role === 'employee')
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllEmployeesPage;
