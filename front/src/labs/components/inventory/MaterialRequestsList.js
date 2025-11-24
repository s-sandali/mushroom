import React, { useEffect, useState } from 'react';
import { getMaterialRequests } from '../../api/inventoryApi'; // Use real API
import { FaClipboardList } from 'react-icons/fa';

// Map backend status to badge classes
const statusBadge = {
  PENDING: 'bg-warning',
  APPROVED: 'bg-success',
  REJECTED: 'bg-danger',
  FULFILLED: 'bg-info'
};

const materialTypeLabels = {
  SEED: 'Seed',
  COTTON: 'Cotton',
  NUTRIENT_MIX: 'Nutrient Mix',
  POLYTHENE_BAG: 'Polythene Bag',
  STERILIZER: 'Sterilizer'
};

const listStyles = `
  .badge.bg-warning   { background: #ffe066 !important; color: #b45309 !important; }
  .badge.bg-success   { background: #e6f9f0 !important; color: #1b9c85 !important; }
  .badge.bg-danger    { background: #ffeaea !important; color: #b91c1c !important; }
  .badge.bg-info      { background: #e0f2fe !important; color: #2563eb !important; }
  .card { border-radius: 1rem; border: none; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
`;

const MaterialRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMaterialRequests()
      .then(res => setRequests(res.data))
      .catch(() => setError('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card shadow-sm p-3 mb-4">
      <style>{listStyles}</style>
      <div>Loading requests...</div>
    </div>
  );
  if (error) return (
    <div className="card shadow-sm p-3 mb-4">
      <style>{listStyles}</style>
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <div className="card shadow-sm p-3 mb-4">
      <style>{listStyles}</style>
      <h5><FaClipboardList className="me-2" />Material Requests</h5>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Requester</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{materialTypeLabels[req.materialType] || req.materialType}</td>
                <td>{req.quantity}</td>
                <td>{req.requester}</td>
                <td>{req.requestDate}</td>
                <td>
                  <span className={`badge ${statusBadge[req.status] || 'bg-secondary'}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No material requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialRequestsList;
