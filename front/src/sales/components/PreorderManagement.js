import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PreorderManagement() {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    product_name: '',
    unit_price: '',
    quantity: '',
    price: '',
    date: '',
    product_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getAllPreorders();
    fetchProducts();
  }, []);

  const getAllPreorders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/preorders');
      setPreorders(response.data || []);
    } catch (error) {
      setPreorders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/product'); 
      // Normalize product keys to match what the form expects
      const normalizedProducts = response.data.map(p => ({
        id: p.productId,
        name: p.name,
        quantity: p.quantity,
        unit_price: p.unitPrice,
        status: p.status,
        threshold: p.threshold
      }));
      setProducts(normalizedProducts);
    } catch (err) {
      setProducts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product_id: productId,
        product_name: selectedProduct.name,
        unit_price: selectedProduct.unit_price.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        product_id: '',
        product_name: '',
        unit_price: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!formData.customer_name.trim()) {
        setError('Customer name is required');
        return;
      }
      if (!formData.product_id) {
        setError('Product is required');
        return;
      }
      if (parseInt(formData.quantity) <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }
      const unitPrice = parseFloat(formData.unit_price);
      const quantity = parseInt(formData.quantity);
      const calculatedPrice = unitPrice * quantity;
      const preorderData = {
        customer_name: formData.customer_name.trim(),
        product_name: formData.product_name,
        unit_price: unitPrice,
        quantity: quantity,
        price: calculatedPrice,
        date: formData.date || new Date().toISOString().split('T')[0],
        product_id: parseInt(formData.product_id)
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      if (isEditing && editId) {
        await axios.put(`http://localhost:8080/api/preorders/${editId}`, preorderData, config);
      } else {
        await axios.post('http://localhost:8080/api/preorders', preorderData, config);
      }
      resetForm();
      getAllPreorders();
    } catch (err) {
      if (err.response) {
        setError(`Failed to save preorder: ${err.response.data?.message || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleEdit = (preorder) => {
    setFormData({
      customer_name: preorder.customer_name,
      product_name: preorder.product_name,
      unit_price: preorder.unit_price.toString(),
      quantity: preorder.quantity.toString(),
      price: preorder.price.toString(),
      date: preorder.date,
      product_id: preorder.product_id.toString()
    });
    setIsEditing(true);
    setEditId(preorder.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this preorder?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/preorders/${id}`);
      getAllPreorders();
    } catch (error) {
      setError('Failed to delete preorder.');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      product_name: '',
      unit_price: '',
      quantity: '',
      price: '',
      date: '',
      product_id: ''
    });
    setIsEditing(false);
    setEditId(null);
    setError(null);
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <i className="bi bi-clipboard-check text-success" style={{ fontSize: '1.8rem' }}></i>
          </div>
         <h1 className="mb-1 fw-bold">Preorder Management</h1>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{isEditing ? 'Edit Preorder' : 'Add New Preorder'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <select
                    className="form-control"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="unit_price"
                    value={formData.unit_price}
                    readOnly
                    placeholder="Unit price"
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
                    min={1}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date || new Date().toISOString().split('T')[0]}
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
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    {isEditing ? 'Update Preorder' : 'Add Preorder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">Preorders List</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Preorder ID</th>
                      <th>Customer Name</th>
                      <th>Product Name</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8" className="text-center p-3">Loading...</td></tr>
                    ) : preorders.length === 0 ? (
                      <tr><td colSpan="8" className="text-center p-3">No preorders found.</td></tr>
                    ) : (
                      preorders.map(preorder => (
                        <tr key={preorder.id}>
                          <td>{preorder.id}</td>
                          <td>{preorder.customer_name}</td>
                          <td>{preorder.product_name}</td>
                          <td>{preorder.unit_price}</td>
                          <td>{preorder.quantity}</td>
                          <td>{preorder.price}</td>
                          <td>{preorder.date}</td>
                          <td>
                            <div className= "btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(preorder)}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(preorder.id)}
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
