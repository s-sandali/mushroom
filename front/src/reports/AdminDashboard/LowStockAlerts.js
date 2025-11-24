import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Package, RefreshCw, CheckCircle } from 'lucide-react';

export default function LowStockAlerts() {
  const [lowStockMaterials, setLowStockMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const threshold = 20; // Can be adjusted or made dynamic

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/admin/low-stock-alerts?threshold=${threshold}`);
      setLowStockMaterials(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching low stock materials:', err);
      setError('Failed to load low stock alerts. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getUrgencyLevel = (stock) => {
    if (stock <= 5) return 'critical';
    if (stock <= 10) return 'urgent';
    return 'warning';
  };

  return (
    <div className="low-stock-container">
      <div className="alerts-header">
        <div className="alert-counter">
          {!isLoading && !error && (
            <>
              <span className="counter-number">{lowStockMaterials.length}</span>
              <span className="counter-text">items need attention</span>
            </>
          )}
        </div>
        <button
          className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="alerts-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner-inner"></div>
            <p className="loading-text">Loading Inventory Alerts...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <AlertTriangle size={40} className="error-icon" />
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : lowStockMaterials.length > 0 ? (
          <div className="alert-list">
            {lowStockMaterials.map((item) => {
              const urgencyLevel = getUrgencyLevel(item.stock);
              return (
                <div key={item.tid} className={`alert-item ${urgencyLevel}`}>
                  <div className="item-icon">
                    <Package size={20} />
                  </div>
                  <div className="item-info">
                    <h4 className="item-name">{item.material}</h4>
                    <div className="item-details">
                      <div className={`quantity-badge ${urgencyLevel}`}>
                        <span className="quantity-value">{item.stock}</span>
                        <span className="quantity-label">units</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-status">
                    <div className="status-pulse"></div>
                    <span className="status-text">
                      {urgencyLevel === 'critical' ? 'Critical' :
                       urgencyLevel === 'urgent' ? 'Urgent' : 'Low'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle size={48} className="empty-icon" />
            <h4 className="empty-title">All Stock Levels Normal</h4>
            <p className="empty-subtitle">Inventory levels are all above threshold</p>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Your existing styles unchanged */
        .low-stock-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 1rem;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .alert-counter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .counter-number {
          font-size: 1rem;
          font-weight: 700;
          color: #F59E0B;
        }

        .counter-text {
          font-size: 0.75rem;
          color: #6B7280;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          color: #F59E0B;
          font-weight: 600;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-button.refreshing svg {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .alerts-content {
          flex: 1;
          overflow-y: auto;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .alert-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
        }

        .alert-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #F59E0B;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .alert-item.critical { border-left-color: #EF4444; background: rgba(239, 68, 68, 0.05); }
        .alert-item.urgent   { border-left-color: #F97316; background: rgba(249, 115, 22, 0.05); }
        .alert-item.warning  { border-left-color: #F59E0B; background: rgba(245, 158, 11, 0.05); }

        .item-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          margin-right: 0.75rem;
        }

        .alert-item.critical .item-icon { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
        .alert-item.urgent .item-icon   { background: rgba(249, 115, 22, 0.1); color: #F97316; }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-name {
          margin: 0 0 0.2rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1F2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-details {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .quantity-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.7rem;
          background: rgba(245, 158, 11, 0.1);
        }

        .quantity-badge.critical { background: rgba(239, 68, 68, 0.1); }
        .quantity-badge.urgent   { background: rgba(249, 115, 22, 0.1); }

        .quantity-value {
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        .quantity-badge.critical .quantity-value { color: #EF4444; }
        .quantity-badge.urgent .quantity-value   { color: #F97316; }
        .quantity-badge.warning .quantity-value  { color: #F59E0B; }

        .quantity-label {
          color: #6B7280;
          font-size: 0.6rem;
        }

        .item-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: auto;
          padding-left: 1rem;
        }

        .status-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #F59E0B;
          animation: pulse 2s infinite ease-in-out;
        }

        .alert-item.critical .status-pulse { background: #EF4444; animation: pulse-red 2s infinite ease-in-out; }
        .alert-item.urgent .status-pulse { background: #F97316; animation: pulse-orange 2s infinite ease-in-out; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.5); }
        }
        @keyframes pulse-orange {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }

        .status-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #F59E0B;
        }

        .alert-item.critical .status-text { color: #EF4444; }
        .alert-item.urgent .status-text { color: #F97316; }

        /* Loading State */
        .loading-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #F59E0B;
          gap: 0.6rem;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .spinner-inner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #F59E0B;
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error State */
        .error-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #EF4444;
          gap: 0.6rem;
          padding: 1rem;
          text-align: center;
        }

        .error-icon {
          margin-bottom: 0.5rem;
        }

        .retry-btn {
          background: #EF4444;
          color: white;
          border: none;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* Empty State */
        .empty-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #6B7280;
          gap: 0.3rem;
          padding: 1rem;
          text-align: center;
        }

        .empty-icon {
          color: #22C55E;
          margin-bottom: 0.25rem;
        }

        .empty-title {
          font-weight: 700;
          font-size: 1.2rem;
          color: #22C55E;
          margin: 0;
        }

        .empty-subtitle {
          font-size: 0.8rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
