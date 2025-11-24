import React, { useState } from 'react';
import { addInventoryItem } from '../../api/inventoryApi'; 
import { FaPlusCircle, FaCheck, FaExclamationCircle } from 'react-icons/fa';

const MATERIAL_TYPES = [
  { value: 'SEED', label: 'Seed' },
  { value: 'COTTON', label: 'Cotton' },
  { value: 'NUTRIENT_MIX', label: 'Nutrient Mix' },
  { value: 'POLYTHENE_BAG', label: 'Polythene Bag' },
  { value: 'STERILIZER', label: 'Sterilizer' }
];

const formStyles = `
  .btn-success-glow {
    box-shadow: 0 0 15px rgba(27, 156, 133, 0.4);
    transform: translateY(-2px);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .alert-success {
    background: #e6f9f0;
    color: #1b9c85;
    border: none;
  }
  .alert-danger {
    background: #ffeaea;
    color: #b91c1c;
    border: none;
  }
  .form-label {
    font-weight: 500;
    color: #1b9c85;
  }
  input.form-control:focus, select.form-select:focus {
    border-color: #1b9c85;
    box-shadow: 0 0 0 2px rgba(27,156,133,.15);
  }
`;

const AddInventoryItemForm = ({ onAdded }) => {
  const [form, setForm] = useState({
    materialType: 'SEED',
    quantity: 0,
    thresholdLevel: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name.endsWith('Level') || name === 'quantity' 
        ? Math.max(0, parseInt(value, 10) || 0)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(''); 
    setSuccess('');
    
    try {
      await addInventoryItem(form); // No destructuring, just await
      setSuccess('Item added successfully!');
      setForm({ materialType: 'SEED', quantity: 0, thresholdLevel: 0 });
      if (onAdded) onAdded(); // Just trigger the parent refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item. Please check the values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card shadow-sm p-3 mb-4" onSubmit={handleSubmit}>
      <style>{formStyles}</style>
      <h5><FaPlusCircle className="me-2" />Add Inventory Item</h5>
      
      <div className="mb-2">
        <label className="form-label">Material Type</label>
        <select 
          className="form-select" 
          name="materialType" 
          value={form.materialType} 
          onChange={handleChange} 
          required
        >
          {MATERIAL_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Quantity</label>
        <input 
          type="number" 
          className="form-control" 
          name="quantity" 
          value={form.quantity}
          min={0}
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Threshold Level</label>
        <input 
          type="number" 
          className="form-control" 
          name="thresholdLevel" 
          value={form.thresholdLevel}
          min={0}
          onChange={handleChange} 
          required 
        />
      </div>

      <button
        className="btn btn-success"
        type="submit"
        disabled={loading}
        onMouseEnter={e => e.currentTarget.classList.add('btn-success-glow')}
        onMouseLeave={e => e.currentTarget.classList.remove('btn-success-glow')}
      >
        {loading ? "Adding..." : "Add Item"}
      </button>

      {success && (
        <div className="alert alert-success mt-2">
          <FaCheck /> {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-2">
          <FaExclamationCircle /> {error}
        </div>
      )}
    </form>
  );
};

export default AddInventoryItemForm;
