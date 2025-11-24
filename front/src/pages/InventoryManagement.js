import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { FaBoxes } from 'react-icons/fa';
import axios from 'axios';

export default function InventoryManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [currentItem, setCurrentItem] = useState({ 
    nid: null, 
    material: "", 
    used_stock: 0, 
    usageType: "lab" 
  });
  const [loading, setLoading] = useState(true);
  const [activeTab] = useState("all");
  const [isEditing, setIsEditing] = useState(false);

  const usageType = location.pathname.split('/')[2] || 'all';

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (usageType === 'all') {
        response = await axios.get('http://localhost:8080/api/v2/getInvs');
      } else {
        response = await axios.get(`http://localhost:8080/api/v2/getInvByUsage/${usageType}`);
      }
      setInventory(response.data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      alert("Error loading inventory: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [usageType]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ 
      ...currentItem, 
      [name]: name === 'used_stock' ? parseInt(value) || 0 : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemToSubmit = {
        ...currentItem,
        used_stock: parseInt(currentItem.used_stock) || 0
      };
      if (isEditing) {
        await axios.put("http://localhost:8080/api/v2/updateInv", itemToSubmit);
        if (usageType === 'all' && itemToSubmit.usageType !== currentItem.usageType) {
          navigate(`/inventory/${itemToSubmit.usageType}`);
        }
      } else {
        await axios.post("http://localhost:8080/api/v2/saveInv", itemToSubmit);
      }
      resetForm();
      loadInventory();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteItem = async (nid) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/deleteInv/${nid}`);
        loadInventory();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const editItem = async (item) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v2/getInv/${item.nid}`);
      console.log("Edit response:", response.data);
      if(response.data) {
        setCurrentItem(response.data);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error loading item for edit:", error);
      alert("Error loading item: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setCurrentItem({ nid: null, material: "", used_stock: 0, usageType: "lab" });
    setIsEditing(false);
  };

  const handleError = (error) => {
    const message = error?.response?.data?.message || "Something went wrong";
    if(message.includes("enough")) {
      alert(`⚠️ Warning: ${message}, Please check the stock amount.`);
    } else {
      alert(message);
    }
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <FaBoxes className="text-success" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Inventory Management</h1>
            <div className="d-flex gap-2 mt-2">              <button 
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => navigate('/inventory/management/all')}
              >
                All Inventory
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'lab' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => navigate('/inventory/management/lab')}
              >
                Lab Inventory
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'sales' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => navigate('/inventory/management/sales')}
              >
                Sales Inventory
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'other' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => navigate('/inventory/management/other')}
              >
                Other Inventory
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                {isEditing ? 'Edit Inventory' : 'Add New Inventory'}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Material Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="material"
                    value={currentItem.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Used</label>
                  <input
                    type="number"
                    className="form-control"
                    name="used_stock"
                    value={currentItem.used_stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Usage Type</label>
                  <select
                    className="form-select"
                    name="usageType"
                    value={currentItem.usageType}
                    onChange={handleInputChange}
                  >
                    <option value="lab">Lab</option>
                    <option value="sales">Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">
                {usageType === 'all' ? 'All Inventory' : `${usageType.charAt(0).toUpperCase() + usageType.slice(1)} Inventory`}
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Material</th>
                      <th>Usage Type</th>
                      <th>Stock Used</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">Loading...</td>
                      </tr>
                    ) : inventory.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No inventory items found</td>
                      </tr>
                    ) : (
                      inventory.map((item, index) => (
                        <tr key={item.nid}>
                          <td>{index + 1}</td>
                          <td>{item.material}</td>
                          <td>{item.usageType}</td>
                          <td>{item.used_stock}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => editItem(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => deleteItem(item.nid)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
