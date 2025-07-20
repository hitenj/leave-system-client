import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/ApplyLeavePage.css';

const ApplyLeavePage = () => {
  const [form, setForm] = useState({
    from_date: '',
    to_date: '',
    type: '',
    reason: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/leaves', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Leave applied successfully!');
      setForm({
        from_date: '',
        to_date: '',
        type: '',
        reason: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying leave');
    }
  };

  return (
    <div className="apply-leave-page">
      <Sidebar />
      <div className="apply-leave-content">
        <h1 className="apply-title">Apply for Leave</h1>
        <form onSubmit={handleSubmit} className="leave-form">
          <label>
            From Date:
            <input
              type="date"
              name="from_date"
              value={form.from_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            To Date:
            <input
              type="date"
              name="to_date"
              value={form.to_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Type:
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Type --</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
            </select>
          </label>

          <label>
            Reason:
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="submit-button">
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
