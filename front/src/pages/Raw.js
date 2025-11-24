import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBoxOpen } from 'react-icons/fa';

export default function Raw() {
  const [raws, setRaws] = useState([]);
  const [currentRaw, setCurrentRaw] = useState({ id: null, material: "", stock: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadRaws();
  }, []);

  const loadRaws = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v1/getRaws");
      setRaws(result.data);
    } catch (error) {
      console.error("Error loading raws:", error);
      setRaws([]);
    }
  };

  const handleInputChange = (e) => {
    setCurrentRaw({ ...currentRaw, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put("http://localhost:8080/api/v1/updateRaw", currentRaw);
      } else {
        await axios.post("http://localhost:8080/api/v1/saveRaw", currentRaw);
      }
      resetForm();
      loadRaws();
    } catch (error) {
      alert("Error saving material: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteRaw = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/deleteRaw/${id}`);
      loadRaws();
    } catch (error) {
      alert("Error deleting material: " + (error.response?.data?.message || error.message));
    }
  };

  const editRaw = async (raw) => {
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/getRaw/${raw.id}`);
      setCurrentRaw(result.data);
      setIsEditing(true);
    } catch (error) {
      alert("Error loading material for editing: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setCurrentRaw({ id: null, material: "", stock: "" });
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <FaBoxOpen className="text-success" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Material Management</h1>
          </div>
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
                    name="material"
                    value={currentRaw.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={currentRaw.stock}
                    onChange={handleInputChange}
                    required
                  />
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
              <h5 className="mb-0 fw-bold text-success">Materials</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Material Name</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raws.map((raw, index) => (
                      <tr key={raw.id}>
                        <td>{index + 1}</td>
                        <td>{raw.material}</td>
                        <td>{raw.stock}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => editRaw(raw)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deleteRaw(raw.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {raws.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">No materials found.</td>
                      </tr>
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
