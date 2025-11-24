import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE_URL = 'http://localhost:8080/api';

function AllocationComponent() {
  const [allocations, setAllocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    branchId: '',
    productId: '',
    totalQty: '',
    allocatedQty: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all required data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allocationsRes, productsRes, branchesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/allocations`),
        axios.get(`${API_BASE_URL}/product`),
        axios.get(`${API_BASE_URL}/branch`)
      ]);
      setAllocations(allocationsRes.data);
      setProducts(productsRes.data);
      setBranches(branchesRes.data);
    } catch (err) {
      setError('Failed to load data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productId') {
      const selectedProduct = products.find(p => p.productId === parseInt(value));
      setFormData(prev => ({
        ...prev,
        [name]: value,
        totalQty: selectedProduct ? selectedProduct.quantity : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      branchId: '',
      productId: '',
      totalQty: '',
      allocatedQty: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setEditId(null);
    setError(null);
  };

  // Handle add or update allocation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.branchId || !formData.productId || !formData.totalQty || !formData.allocatedQty || !formData.date) {
        throw new Error('All fields are required');
      }
      if (parseInt(formData.allocatedQty) > parseInt(formData.totalQty)) {
        throw new Error('Allocated quantity cannot be greater than total quantity');
      }
      const allocationData = {
        branchId: parseInt(formData.branchId),
        product_id: parseInt(formData.productId),
        totalQty: parseInt(formData.totalQty),
        allocatedQty: parseInt(formData.allocatedQty),
        date: formData.date
      };
      if (isEditing && editId) {
        const response = await axios.put(`${API_BASE_URL}/allocations/${editId}`, allocationData, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAllocations(allocations.map(a => a.id === editId ? response.data : a));
      } else {
        const response = await axios.post(`${API_BASE_URL}/allocations`, allocationData, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAllocations([...allocations, response.data]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save allocation');
    }
  };

  // Handle edit
  const handleEdit = (allocation) => {
    setFormData({
      branchId: allocation.branchId,
      productId: allocation.product_id,
      totalQty: allocation.totalQty,
      allocatedQty: allocation.allocatedQty,
      date: allocation.date
    });
    setIsEditing(true);
    setEditId(allocation.id);
    setError(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this allocation?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/allocations/${id}`);
      setAllocations(allocations.filter(a => a.id !== id));
    } catch (err) {
      setError('Failed to delete allocation');
    }
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <i className="bi bi-diagram-3 text-success" style={{ fontSize: '1.8rem' }}></i>
          </div>
          <h1 className="mb-1 fw-bold">Allocation Management</h1>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{isEditing ? 'Edit Allocation' : 'Add New Allocation'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Branch</label>
                  <select
                    className="form-control"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <select
                    className="form-control"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.productId} value={product.productId}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalQty"
                    value={formData.totalQty}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Allocated Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="allocatedQty"
                    value={formData.allocatedQty}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {error && (
                  <div className="alert alert-danger mb-3">{error}</div>
                )}
                <div className="d-flex gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-success">
                    {isEditing ? 'Update Allocation' : 'Add Allocation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">Allocations List</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Branch</th>
                      <th>Location</th>
                      <th>Product</th>
                      <th>Total Qty</th>
                      <th>Allocated Qty</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">Loading allocations...</td>
                      </tr>
                    ) : allocations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">
                          No allocations found.
                        </td>
                      </tr>
                    ) : (
                      allocations.map(allocation => (
                        <tr key={allocation.id} className="text-center">
                          <td>{allocation.id}</td>
                          <td>{branches.find(b => b.id === allocation.branchId)?.branchName || allocation.branchId}</td>
                          <td>{branches.find(b => b.id === allocation.branchId)?.location || 'N/A'}</td>
                          <td>{products.find(p => p.productId === allocation.product_id)?.name || allocation.product_id}</td>
                          <td>{allocation.totalQty}</td>
                          <td>{allocation.allocatedQty}</td>
                          <td>{allocation.date}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(allocation)}
                              >
                                Update
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(allocation.id)}
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

export default AllocationComponent;
