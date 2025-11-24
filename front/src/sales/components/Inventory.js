import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Added threshold to formData
  const [formData, setFormData] = useState({ name: '', quantity: '', unitPrice: '', threshold: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/product');
      setProducts(response.data || []);
    } catch (err) {
      setProducts([]);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (parseInt(formData.quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }
    if (parseFloat(formData.unitPrice) <= 0) {
      setError('Unit price must be greater than 0');
      return;
    }
    if (formData.threshold !== '' && parseInt(formData.threshold) < 0) {
      setError('Threshold cannot be negative');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      // If threshold is empty string, send null or undefined
      threshold: formData.threshold === '' ? null : parseInt(formData.threshold)
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    try {
      if (isEditing && editId) {
        await axios.put(`http://localhost:8080/api/product/${editId}`, productData, config);
      } else {
        await axios.post('http://localhost:8080/api/product', productData, config);
      }
      setFormData({ name: '', quantity: '', unitPrice: '', threshold: '' });
      setIsEditing(false);
      setEditId(null);
      await fetchProducts();
    } catch (err) {
      if (err.response) {
        setError(`Failed to save product: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      quantity: product.quantity.toString(),
      unitPrice: product.unitPrice.toString(),
      threshold: product.threshold !== null && product.threshold !== undefined ? product.threshold.toString() : ''
    });
    setIsEditing(true);
    setEditId(product.productId);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', quantity: '', unitPrice: '', threshold: '' });
    setIsEditing(false);
    setEditId(null);
    setError(null);
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <i className="bi bi-box-seam text-success" style={{ fontSize: '1.8rem' }}></i>
          </div>
          <h1 className="mb-1 fw-bold">Inventory Management</h1>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{isEditing ? 'Edit Product' : 'Add New Product'}</h5>
              <form onSubmit={handleAddOrUpdateProduct}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min={0}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    required
                    min={0.01}
                    step={0.01}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Threshold (optional)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    min={0}
                    placeholder="Enter threshold for low stock"
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
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">Product List</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Threshold</th> 
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">Loading...</td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.map(product => {
                        let status = product.status;
                        if (!status) {
                          if (product.quantity === 0) status = 'Out of Stock';
                          else if (product.threshold !== undefined && product.threshold !== null && product.quantity < product.threshold) status = 'Low Stock';
                          else status = 'In Stock';
                        }
                        const threshold = product.threshold !== undefined && product.threshold !== null ? product.threshold : '-';
                        return (
                          <tr key={product.productId} className="text-center">
                            <td>{product.productId}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unitPrice.toFixed(2)}</td>
                            <td>{threshold}</td> 
                            <td>
                              <span className={
                                status === 'Out of Stock' ? 'badge bg-danger' :
                                  status === 'Low Stock' ? 'badge bg-warning text-dark' :
                                  status === 'In Stock' ? 'badge bg-success' :
                                  'badge bg-secondary'
                              }>
                                {status}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEdit(product)}
                                >
                                  Update
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(product.productId)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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

export default Inventory;
