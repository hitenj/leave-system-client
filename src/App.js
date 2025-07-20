import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LeaveStatusPage from './pages/LeaveStatusPage';
import LeaveHistoryPage from './pages/LeaveHistoryPage';
import ApplyLeavePage from './pages/ApplyLeavePage';
import AllEmployeesPage from './pages/AllEmployeesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/status" element={<LeaveStatusPage />} />
        <Route path="/history" element={<LeaveHistoryPage />} />
        <Route path="/apply-leave" element={<ApplyLeavePage />} />
        <Route path="/all-employees" element={<AllEmployeesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
