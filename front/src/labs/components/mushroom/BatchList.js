import React, { useState, useEffect } from 'react';
import { getBatches } from '../../api/batchApi';
import GrowthUpdateForm from './GrowthUpdateForm';
import { Modal } from 'react-bootstrap';

const BatchList = ({ refreshTrigger, onUpdateClick }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const response = await getBatches();
        // Handle array response directly (no nested data property)
        setBatches(response || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };
    loadBatches();
  }, [refreshTrigger]);

  const calculateProgress = (batch) => {
    const totalProcessed = batch.successfulGrowth + batch.contaminatedCount;
    return totalProcessed > 0 ? 
      Math.round((batch.successfulGrowth / batch.initialQuantity) * 100) :
      0;
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    if (onUpdateClick) onUpdateClick();
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>Start Date</th>
                <th>Initial Qty</th>
                <th>Successful</th>
                <th>Contaminated</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => (
                <tr key={batch.id}>
                  <td>{batch.type}</td>
                  <td>{new Date(batch.cultivationStartDate).toLocaleDateString()}</td>
                  <td>{batch.initialQuantity}</td>
                  <td>{batch.successfulGrowth}</td>
                  <td>{batch.contaminatedCount}</td>
                  <td>{calculateProgress(batch)}%</td>
                  <td>
                    <span className={`badge ${batch.cultivationComplete ? 'bg-secondary' : 'bg-success'}`}>
                      {batch.cultivationComplete ? 'Completed' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {!batch.cultivationComplete && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setShowUpdateModal(true);
                          }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {batches.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              No batches found
            </div>
          )}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
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

export default BatchList;
