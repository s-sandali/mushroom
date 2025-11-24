import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="card border-0 shadow-sm rounded-4 h-100">
    <div className="card-body d-flex align-items-center">
      <div className="rounded-circle p-3 me-3" style={{background: `${color}15`}}>
        <span style={{ color, fontSize: '2rem' }}>{icon}</span>
      </div>
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className="mb-0 fw-bold">{value}</h3>
      </div>
    </div>
  </div>
);

export default StatCard;
