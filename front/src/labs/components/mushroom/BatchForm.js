import React, { useState } from 'react';
import { createBatch } from '../../api/batchApi';
import { toast } from 'react-toastify';

const BatchForm = ({ onBatchCreated }) => {
  const [formData, setFormData] = useState({
    type: 'OYSTER',
    initialQuantity: 100
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        type: formData.type,
        initialQuantity: Number(formData.initialQuantity)
      };

      await createBatch(payload);

      toast.success('Batch created successfully!');
      if (onBatchCreated) onBatchCreated();

      // Reset form
      setFormData({
        type: 'OYSTER',
        initialQuantity: 100
      });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Batch creation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Create New Batch</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Mushroom Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="OYSTER">Oyster</option>
                <option value="SHIITAKE">Shiitake</option>
                <option value="PORTABELLA">Portabella</option>
                <option value="MAITAKE">Maitake</option>
                <option value="LIONS_MANE">Lion's Mane</option>
                
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Initial Quantity</label>
              <input
                type="number"
                className="form-control"
                value={formData.initialQuantity}
                onChange={(e) => setFormData({...formData, initialQuantity: e.target.value})}
                min="1"
                required
              />
            </div>

            <div className="col-12">
              <button 
                type="submit" 
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Batch'}
              </button>
              {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchForm;
