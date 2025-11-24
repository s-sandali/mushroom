import React, { useState, useEffect } from 'react';
import BatchForm from '../components/mushroom/BatchForm';
import BatchList from '../components/mushroom/BatchList';
import GrowthUpdateForm from '../components/mushroom/GrowthUpdateForm';
import { FaSeedling } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { getBatchesStats } from '../api/batchApi';

const MushroomManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    successRate: 0
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleBatchCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getBatchesStats();
        setStats(response); // Directly use response (no .data needed)
      } catch (err) {
        console.error('Stats fetch failed:', err);
      }
    };
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="container-fluid py-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <FaSeedling className="text-success" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Mushroom Batch Management</h1>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <BatchForm onBatchCreated={handleBatchCreated} />
            </div>
          </div>
          
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-success bg-opacity-10 border-0">
              <h5 className="mb-0 fw-bold text-success">Batch Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-primary bg-opacity-10 text-center h-100">
                    <h2 className="mb-1 fw-bold text-primary">{stats.total}</h2>
                    <p className="small mb-0">Total Batches</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-danger bg-opacity-10 text-center h-100">
                    <h2 className="mb-1 fw-bold text-danger">{stats.active}</h2>
                    <p className="small mb-0">Active</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-info bg-opacity-10 text-center h-100">
                    <h2 className="mb-1 fw-bold text-info">{stats.completed}</h2>
                    <p className="small mb-0">Completed</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-warning bg-opacity-10 text-center h-100">
                    <h2 className="mb-1 fw-bold text-warning">{stats.successRate}%</h2>
                    <p className="small mb-0">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <BatchList 
            refreshTrigger={refreshKey}
            onUpdateClick={(batch) => {
              setSelectedBatch(batch);
              setShowUpdateModal(true);
            }}
          />
        </div>
      </div>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="xl">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-success">
            <i className="bi bi-pencil-square me-2"></i>
            Update Batch Progress
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatch && (
            <GrowthUpdateForm 
              batch={selectedBatch}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MushroomManagement;
