import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ai_verified: "bg-blue-100 text-blue-800 border-blue-200",
    bidding: "bg-blue-100 text-blue-800 border-blue-200",
    assigned: "bg-purple-100 text-purple-800 border-purple-200",
    in_progress: "bg-orange-100 text-orange-800 border-orange-200",
    done: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    duplicate: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const label: Record<string, string> = {
    pending: "Pending",
    ai_verified: "AI Verified",
    bidding: "Bidding Open",
    assigned: "Assigned",
    in_progress: "In Progress",
    done: "Resolved",
    rejected: "Rejected",
    duplicate: "⚠️ Duplicate",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
      {label[status] || status}
    </span>
  );
};

export default StatusBadge;
