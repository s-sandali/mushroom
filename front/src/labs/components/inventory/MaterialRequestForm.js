import React, { useState, useEffect } from 'react';
import { requestMaterials, getInventoryItems } from '../../api/inventoryApi';
import { 
  FaBoxOpen, 
  FaCheck, 
  FaExclamationCircle, 
  FaPaperPlane, 
  FaUndoAlt 
} from 'react-icons/fa';

const materialTypeLabels = {
  SEED: 'Seed',
  COTTON: 'Cotton',
  NUTRIENT_MIX: 'Nutrient Mix',
  POLYTHENE_BAG: 'Polythene Bag',
  STERILIZER: 'Sterilizer'
};

const formStyles = `
  .alert-success { background: #e6f9f0; color: #1b9c85; border: none; }
  .alert-danger { background: #ffeaea; color: #b91c1c; border: none; }
  .form-label { font-weight: 500; color: #1b9c85; }
  input.form-control:focus, select.form-select:focus { 
    border-color: #1b9c85; 
    box-shadow: 0 0 0 2px rgba(27,156,133,.15); 
  }
`;

const MaterialRequestForm = ({ onSubmitted }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 100,
    requester: 'Lab Technician'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch available inventory items on component mount
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        let items = await getInventoryItems();
        // Defensive check: ensure items is always an array
        if (!Array.isArray(items)) items = [];
        setInventoryItems(items);
        if (items.length > 0) {
          setFormData(prev => ({ ...prev, materialId: items[0].id }));
        }
      } catch (err) {
        setError('Failed to load inventory items');
        setInventoryItems([]); // Ensure array even on error
      }
    };
    fetchInventoryItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'materialId' 
        ? parseInt(value, 10) || '' 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.materialId) {
      setError('Please select a material');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const payload = {
        materialId: formData.materialId,
        quantity: formData.quantity,
        requester: formData.requester
      };

      await requestMaterials(payload);
      setSuccess('Material request submitted successfully');
      setFormData({
        materialId: inventoryItems.length > 0 ? inventoryItems[0].id : '',
        quantity: 100,
        requester: 'Lab Technician'
      });
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      materialId: inventoryItems.length > 0 ? inventoryItems[0].id : '',
      quantity: 100,
      requester: 'Lab Technician'
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="card p-3 mb-4">
      <style>{formStyles}</style>
      <h5 className="mb-3 d-flex align-items-center">
        <FaBoxOpen className="me-2 text-primary" />
        New Material Request
      </h5>

      {success && (
        <div className="alert alert-success d-flex align-items-center">
          <FaCheck className="me-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationCircle className="me-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Material</label>
          <select
            className="form-select"
            name="materialId"
            value={formData.materialId}
            onChange={handleChange}
            required
          >
            <option value="">Select Material</option>
            {inventoryItems.map(item => (
              <option key={item.id} value={item.id}>
                {materialTypeLabels[item.materialType]} (ID: {item.id}) - Available: {item.quantity}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity Needed</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Requester</label>
          <input
            type="text"
            className="form-control"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            <FaUndoAlt className="me-1" />
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.materialId}
          >
            {loading ? 'Submitting...' : (
              <>
                <FaPaperPlane className="me-1" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialRequestForm;
