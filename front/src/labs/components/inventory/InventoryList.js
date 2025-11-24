import React, { useState, useEffect } from 'react';
import { 
  getInventoryItems, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../../api/inventoryApi';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaBoxes, 
  FaExclamationTriangle, 
  FaTrash 
} from 'react-icons/fa';

const materialTypeLabels = {
  SEED: 'Seed',
  COTTON: 'Cotton',
  NUTRIENT_MIX: 'Nutrient Mix',
  POLYTHENE_BAG: 'Polythene Bag',
  STERILIZER: 'Sterilizer'
};

const tableStyles = `
  .card { border-radius: 1rem; border: none; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
  .table thead th { background: #f8fafc; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
  .table tbody tr:hover { background: #f6f9fc; }
  .table .badge { font-size: 0.85em; padding: 0.4em 0.7em; border-radius: 0.5em; }
  input.form-control:focus { border-color: #1b9c85; box-shadow: 0 0 0 2px rgba(27,156,133,.15); }
`;

const InventoryList = ({ refreshKey, onUpdate }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      let items = await getInventoryItems();
      // Defensive check: ensure array
      if (!Array.isArray(items)) items = [];
      setInventory(items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory data');
      setInventory([]); // Ensure array even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [refreshKey]);


  const handleEdit = (item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
  };

  const handleCancel = () => {
    setEditItem(null);
    setEditQuantity(0);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        materialType: editItem.materialType,
        quantity: editQuantity,
        thresholdLevel: editItem.thresholdLevel
      };
      await updateInventoryItem(editItem.id, payload);
      await fetchInventory();
      onUpdate?.();
      setEditItem(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteInventoryItem(id);
      await fetchInventory();
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="card p-3 mb-4">
      <style>{tableStyles}</style>
      <h5 className="mb-3 d-flex align-items-center">
        <FaBoxes className="me-2 text-muted" />
        Current Inventory
      </h5>
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{materialTypeLabels[item.materialType] || item.materialType}</td>
                <td>
                  {editItem?.id === item.id ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(parseInt(e.target.value, 10) || 0)}
                      min="0"
                      autoFocus
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>{item.thresholdLevel}</td>
                <td>
                  {item.quantity <= item.thresholdLevel ? (
                    <span className="badge bg-danger text-white">
                      <FaExclamationTriangle className="me-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="badge bg-success text-white">In Stock</span>
                  )}
                </td>
                <td>
                  {editItem?.id === item.id ? (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={handleUpdate}
                      >
                        <FaSave />
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancel}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {inventory.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;
