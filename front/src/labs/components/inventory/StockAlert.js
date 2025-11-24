import React, { useState, useEffect } from 'react';
import { getLowStockAlerts } from '../../api/inventoryApi';
import { FaExclamationTriangle, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const materialTypeLabels = {
  SEED: 'Seed',
  COTTON: 'Cotton',
  NUTRIENT_MIX: 'Nutrient Mix',
  POLYTHENE_BAG: 'Polythene Bag',
  STERILIZER: 'Sterilizer'
};

const StockAlert = ({ refreshKey }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data } = await getLowStockAlerts();
        setAlerts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stock alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [refreshKey]);

  if (loading) return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="text-center text-muted">Loading stock alerts...</div>
    </div>
  );

  if (error) return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="alert alert-danger d-flex align-items-center">
        <FaExclamationTriangle className="me-2" />
        {error}
      </div>
    </div>
  );

  if (alerts.length === 0) return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="text-center text-success">
        <FaExclamationTriangle className="me-2" />
        All stock levels are good
      </div>
    </div>
  );

  return (
    <div className="card shadow-sm p-3 mb-4">
      <div 
        className="d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h5 className="mb-0 text-danger">
          <FaExclamationTriangle className="me-2" />
          Low Stock Alerts ({alerts.length})
        </h5>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isExpanded && (
        <div className="mt-3">
          <div className="row g-3">
            {alerts.map(item => (
              <div key={item.id} className="col-md-6">
                <div className="card border-danger">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">
                        {materialTypeLabels[item.materialType] || item.materialType}
                      </h6>
                      <span className="badge bg-danger">Low Stock</span>
                    </div>
                    
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Current Stock:</span>
                      <span className="fw-bold text-danger">
                        {item.quantity} / {item.thresholdLevel}
                      </span>
                    </div>
                    
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar"
                        style={{ 
                          width: `${Math.min(
                            (item.quantity / item.thresholdLevel) * 100, 
                            100
                          )}%` 
                        }}
                      />
                    </div>
                    
                    <div className="text-muted small mt-1">
                      Needs reorder: {Math.max(0, item.thresholdLevel - item.quantity + 1)} units
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAlert;
