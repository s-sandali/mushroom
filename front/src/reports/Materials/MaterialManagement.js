import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function MaterialManagement() {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', quantity: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //const [viewMaterial, setViewMaterial] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8080/api/v3/material/get");
      setMaterials(result.data);
      setError(null);
    } catch (error) {
      setError("Failed to load materials. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const materialData = {
        ...formData,
        quantity: parseInt(formData.quantity)
      };

      if (isEditing) {
        await axios.put('http://localhost:8080/api/v3/material/update', {
          ...materialData,
          id: parseInt(formData.id)
        });
      } else {
        await axios.post("http://localhost:8080/api/v3/material/add", materialData);
      }
      
      resetForm();
      loadMaterials();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save material.");
    }
  };

  const handleEdit = (material) => {
    setFormData(material);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete("http://localhost:8080/api/v3/material/delete", { data: { id } });
      loadMaterials();
    } catch (error) {
      setError("Failed to delete material.");
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', quantity: '', description: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <i className="bi bi-box-seam text-success" style={{ fontSize: '1.8rem' }}></i>
          </div>
          <h1 className="fw-bold text-success mb-0">Material Management</h1>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                {isEditing ? 'Edit Material' : 'Add New Material'}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Material Name</label>
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
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                {error && <div className="alert alert-danger mb-3">{error}</div>}
                <div className="d-flex gap-2">
                  {isEditing && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-success">
                    {isEditing ? 'Update Material' : 'Add Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-success">Materials List</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">Loading materials...</td>
                      </tr>
                    ) : materials.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">No materials found.</td>
                      </tr>
                    ) : (
                      materials.map((material, index) => (
                        <tr key={material.id}>
                          <td>{index + 1}</td>
                          <td>{material.name}</td>
                          <td>{material.quantity}</td>
                          <td>{material.description || '-'}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(material)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(material.id)}
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
