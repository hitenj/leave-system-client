import React, { useState } from "react";
import axios from "axios";
import "../styles/LeaveCard.css";

const LeaveCard = ({ leave, isManagerView = false, onActionComplete }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this leave?`))
      return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const mappedStatus = action === "approve" ? "approved" : "rejected";
      await axios.patch(
        `https://leave-system-server.onrender.com/api/leaves/${leave.id}/${action}`,
        {
          status: mappedStatus, // 'approve' or 'reject'
          manager_comment: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Leave ${action}d successfully`);
      setComment("");
      if (onActionComplete) onActionComplete(); // refresh list in parent
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} leave`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-card">
      <p>
        <strong>Employee:</strong> {leave.User?.name || "You"}
      </p>
      <p>
        <strong>From:</strong> {leave.from_date}
      </p>
      <p>
        <strong>To:</strong> {leave.to_date}
      </p>
      <p>
        <strong>Type:</strong> {leave.type}
      </p>
      <p>
        <strong>Reason:</strong> {leave.reason}
      </p>
      <p>
        <strong>Status:</strong> {leave.status}
      </p>
      <p>
        <strong>Manager Comment:</strong> {leave.manager_comment || "-"}
      </p>

      {isManagerView && leave.status === "pending" && (
        <div className="manager-actions">
          <input
            type="text"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="manager-comment-input"
          />
          <button
            onClick={() => handleAction("approve")}
            disabled={loading}
            className="btn-approve"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={loading}
            className="btn-reject"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
