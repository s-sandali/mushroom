import React, { useState } from 'react';
import { createDailyUpdate } from '../../api/batchApi'; 
import { toast } from 'react-toastify';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';

const GrowthUpdateForm = ({ batch, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    successfulToday: 0,
    contaminatedToday: 0,
    contaminationReason: 'MOLD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [touched, setTouched] = useState({});

  const remainingQuantity = batch.initialQuantity - (batch.successfulGrowth + batch.contaminatedCount);
  const successRate = batch.initialQuantity > 0
    ? ((batch.successfulGrowth / batch.initialQuantity) * 100).toFixed(1) : 0;
  const contaminationRate = batch.initialQuantity > 0
    ? ((batch.contaminatedCount / batch.initialQuantity) * 100).toFixed(1) : 0;
  const daysRunning = Math.ceil((new Date() - new Date(batch.cultivationStartDate)) / (1000 * 60 * 60 * 24));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'successfulToday' || name === 'contaminatedToday'
          ? parseInt(value, 10) || 0
          : value
    }));
  };

  const validateForm = () => {
    const newSuccessful = formData.successfulToday;
    const newContaminated = formData.contaminatedToday;
    if (newSuccessful + newContaminated > remainingQuantity) {
      setError("Combined total exceeds remaining units");
      return false;
    }
    if (newSuccessful === 0 && newContaminated === 0) {
      setError("You must enter at least one successful or contaminated unit");
      return false;
    }
    if (newContaminated > 0 && !formData.contaminationReason) {
      setError("Please select a contamination reason");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.successfulToday + formData.contaminatedToday >= 5) {
        setShowConfirmation(true);
      } else {
        submitUpdate();
      }
    }
  };

  const submitUpdate = async () => {
    setShowConfirmation(false);
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Only send fields expected by backend!
      await createDailyUpdate({
        seedId: batch.id,
        successfulToday: formData.successfulToday,
        contaminatedToday: formData.contaminatedToday,
        contaminationReason: formData.contaminatedToday > 0 ? formData.contaminationReason : undefined
      });

      setSuccess('Growth updated successfully');
      toast.success('Batch progress updated successfully');

      setFormData({
        successfulToday: 0,
        contaminatedToday: 0,
        contaminationReason: 'MOLD'
      });

      setTimeout(() => {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update growth');
      toast.error('Failed to update batch progress');
    } finally {
      setLoading(false);
    }
  };

  const getInputValidationClass = (field) => {
    if (!touched[field]) return '';
    return formData[field] >= 0 ? 'is-valid' : 'is-invalid';
  };

  const renderTooltip = (content) => (
    <Tooltip id="button-tooltip">{content}</Tooltip>
  );

  return (
    <div className="card shadow">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Update Growth Status</h5>
          <div>
            <span className="badge bg-secondary me-2">Running: {daysRunning} days</span>
            {onCancel && (
              <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-4 p-3 border rounded bg-light">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><i className="bi bi-fungi me-2"></i><strong>Type:</strong> {batch.type}</p>
              <p className="mb-1"><i className="bi bi-upc me-2"></i><strong>ID:</strong> {batch.id}</p>
              <p className="mb-0"><i className="bi bi-calendar me-2"></i><strong>Started:</strong> {new Date(batch.cultivationStartDate).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><i className="bi bi-123 me-2"></i><strong>Initial Quantity:</strong> {batch.initialQuantity}</p>
              <p className="mb-1"><i className="bi bi-check-circle me-2 text-success"></i><strong>Success Rate:</strong> {successRate}% ({batch.successfulGrowth})</p>
              <p className="mb-0"><i className="bi bi-x-circle me-2 text-danger"></i><strong>Contamination Rate:</strong> {contaminationRate}% ({batch.contaminatedCount})</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>Progress Tracking</h6>
            <h6>Remaining: <span className="badge bg-info">{remainingQuantity} units</span></h6>
          </div>
          <div className="progress mb-3" style={{ height: '30px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${batch.successfulGrowth / batch.initialQuantity * 100}%` }}
              aria-valuenow={batch.successfulGrowth}
              aria-valuemin="0"
              aria-valuemax={batch.initialQuantity}
            >
              {batch.successfulGrowth > 0 ? `Successful: ${batch.successfulGrowth}` : ''}
            </div>
            <div
              className="progress-bar bg-danger"
              style={{ width: `${batch.contaminatedCount / batch.initialQuantity * 100}%` }}
              aria-valuenow={batch.contaminatedCount}
              aria-valuemin="0"
              aria-valuemax={batch.initialQuantity}
            >
              {batch.contaminatedCount > 0 ? `Contaminated: ${batch.contaminatedCount}` : ''}
            </div>
            <div
              className="progress-bar bg-secondary"
              style={{
                width: `${(formData.successfulToday + formData.contaminatedToday) / batch.initialQuantity * 100}%`,
                opacity: 0.5
              }}
              aria-valuenow={formData.successfulToday + formData.contaminatedToday}
              aria-valuemin="0"
              aria-valuemax={batch.initialQuantity}
            >
              {formData.successfulToday + formData.contaminatedToday > 0
                ? `Pending: ${formData.successfulToday + formData.contaminatedToday}`
                : ''}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="successfulToday" className="form-label">
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                  New Successful Growth
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">
                    <i className="bi bi-check-circle"></i>
                  </span>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip('Number of units that have successfully grown since the last update')}
                  >
                    <input
                      type="number"
                      id="successfulToday"
                      name="successfulToday"
                      className={`form-control ${getInputValidationClass('successfulToday')}`}
                      value={formData.successfulToday}
                      onChange={handleChange}
                      min="0"
                      max={remainingQuantity}
                      required
                    />
                  </OverlayTrigger>
                  <span className="input-group-text">units</span>
                </div>
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Units that grew successfully since last update
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="contaminatedToday" className="form-label">
                  <i className="bi bi-x-circle-fill text-danger me-1"></i>
                  New Contamination
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-danger text-white">
                    <i className="bi bi-exclamation-circle"></i>
                  </span>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip('Number of units that got contaminated since the last update')}
                  >
                    <input
                      type="number"
                      id="contaminatedToday"
                      name="contaminatedToday"
                      className={`form-control ${getInputValidationClass('contaminatedToday')}`}
                      value={formData.contaminatedToday}
                      onChange={handleChange}
                      min="0"
                      max={remainingQuantity - formData.successfulToday}
                      required
                    />
                  </OverlayTrigger>
                  <span className="input-group-text">units</span>
                </div>
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Units that got contaminated since last update
                </div>
              </div>
            </div>
          </div>

          {formData.contaminatedToday > 0 && (
            <div className="form-group mb-3 p-3 border rounded border-danger border-opacity-25 bg-light">
              <label htmlFor="contaminationReason" className="form-label">Contamination Reason</label>
              <select
                id="contaminationReason"
                name="contaminationReason"
                className="form-select"
                value={formData.contaminationReason}
                onChange={handleChange}
                required
              >
                <option value="MOLD">Mold</option>
                <option value="BACTERIA">Bacteria</option>
                <option value="TEMPERATURE">Temperature Issue</option>
                <option value="HUMIDITY">Humidity Issue</option>
                <option value="PESTS">Pests/Insects</option>
                <option value="HANDLING">Improper Handling</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (formData.successfulToday === 0 && formData.contaminatedToday === 0)}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Update Growth Status
                </>
              )}
            </button>
            <div className="text-muted">
              <span className="badge bg-secondary">
                <i className="bi bi-calculator me-1"></i>
                Remaining after update: {remainingQuantity - formData.successfulToday - formData.contaminatedToday} units
              </span>
            </div>
          </div>
        </form>
      </div>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Growth Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You're about to update:</p>
          <ul>
            <li><strong className="text-success">Successful:</strong> {formData.successfulToday} units</li>
            <li><strong className="text-danger">Contaminated:</strong> {formData.contaminatedToday} units</li>
          </ul>
          <p>This will leave {remainingQuantity - formData.successfulToday - formData.contaminatedToday} units remaining.</p>
          <p>Are you sure you want to proceed with this update?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submitUpdate}>
            Confirm Update
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrowthUpdateForm;
