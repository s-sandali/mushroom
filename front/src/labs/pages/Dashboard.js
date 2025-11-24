import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboardApi';
import GrowthStatusChart from '../components/dashboard/GrowthStatusChart';
import ContaminationChart from '../components/dashboard/ContaminationChart';
import MaterialOverview from '../components/dashboard/MaterialOverview';
import StockAlert from '../components/inventory/StockAlert';
import { FaFlask } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="container py-5">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-3 text-muted">Loading dashboard data...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  );
  if (!stats) return null;
  return (
    <>
      {/* Dashboard Header */}
      <div className="page-header">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 p-3 me-3">
            <FaFlask className="text-primary" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold text-success">Lab Dashboard</h1>
            <p className="text-muted mb-0">Monitor active cultures and lab operations</p>
          </div>
        </div>      </div>

      {/* Key Metrics */}
      <div className="content-card">
        <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="bi bi-grid-3x3-gap-fill text-primary fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Active Batches</div>
                <div className="fw-bold fs-4">{stats.activeBatchCount ?? stats.active ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i className="bi bi-graph-up-arrow text-success fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Success Rate</div>
                <div className="fw-bold fs-4">{stats.overallSuccessRate ?? stats.successRate ?? 0}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Low Stock Items</div>
                <div className="fw-bold fs-4">{stats.lowStockItems?.length ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                <i className="bi bi-box-seam text-info fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Production Ready</div>
                <div className="fw-bold fs-4">{stats.productionReadyCount ?? 0}</div>
              </div>
            </div>          </div>
        </div>
      </div>
      </div>

      {/* Alerts */}
      <div className="mb-4">
        <StockAlert />
      </div>

      {/* Analytics Section */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0 fw-semibold text-secondary"><i className="bi bi-graph-up me-2"></i>Monthly Growth Overview</h5>
            </div>
            <div className="card-body">
              <GrowthStatusChart />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0 fw-semibold text-secondary"><i className="bi bi-exclamation-triangle me-2"></i>Contamination Chart</h5>
            </div>
            <div className="card-body">
              <ContaminationChart />
            </div>
          </div>
        </div>
      </div>

      {/* Material Overview */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-light border-0">
          <h5 className="mb-0 fw-semibold text-secondary"><i className="bi bi-list-ul me-2"></i>Raw Material Overview</h5>
        </div>
        <div className="card-body">
          <MaterialOverview />        </div>
      </div>
    </>
  );
};

export default Dashboard;
