import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE_URL = 'http://localhost:8080/api';

function BranchComponent() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ branchName: '', location: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/branch`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setBranches(response.data);
    } catch (err) {
      let errorMessage = 'Failed to load branches. ';
      if (err.response) {
        errorMessage += `Server responded with status ${err.response.status}: ${err.response.data?.message || 'Unknown error'}`;
      } else if (err.request) {
        errorMessage += 'No response received from server. Please check if the server is running at ' + API_BASE_URL;
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ branchName: '', location: '' });
    setIsEditing(false);
    setEditId(null);
    setError(null);
  };

  const handleAddOrUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        const response = await axios.put(`${API_BASE_URL}/branch/${editId}`, formData);
        setBranches(branches.map(branch => branch.id === editId ? response.data : branch));
      } else {
        const response = await axios.post(`${API_BASE_URL}/branch`, formData);
        setBranches([...branches, response.data]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save branch');
    }
  };

  const handleEdit = (branch) => {
    setFormData({ branchName: branch.branchName, location: branch.location });
    setIsEditing(true);
    setEditId(branch.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/branch/${id}`);
      setBranches(branches.filter(branch => branch.id !== id));
    } catch (err) {
      setError('Failed to delete branch');
    }
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <i className="bi bi-geo-alt text-success" style={{ fontSize: '1.8rem' }}></i>
          </div>
          <h1 className="mb-1 fw-bold">Branch Management</h1>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{isEditing ? 'Edit Branch' : 'Add New Branch'}</h5>
              <form onSubmit={handleAddOrUpdateBranch}>
                <div className="mb-3">
                  <label className="form-label">Branch Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
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
                    {isEditing ? 'Update Branch' : 'Add Branch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">Branches List</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Branch Name</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">Loading branches...</td>
                      </tr>
                    ) : branches.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No branches found.
                        </td>
                      </tr>
                    ) : (
                      branches.map(branch => (
                        <tr key={branch.id} className="text-center">
                          <td>{branch.id}</td>
                          <td>{branch.branchName}</td>
                          <td>{branch.location}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(branch)}
                              >
                                Update
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(branch.id)}
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

export default BranchComponent;
