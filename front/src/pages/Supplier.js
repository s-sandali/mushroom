import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStore } from 'react-icons/fa';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSupplier, setCurrentSupplier] = useState({
    sid: null,
    supplier: "",
    material: "",
    address: "",
    phone: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/v3/getSuppliers");
      console.log("Suppliers data:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
      alert("Error loading suppliers: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier({ 
      ...currentSupplier, 
      [name]: name === 'phone' ? parseInt(value) || '' : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put("http://localhost:8080/api/v3/updateSupplier", currentSupplier);
      } else {
        await axios.post("http://localhost:8080/api/v3/saveSupplier", currentSupplier);
      }
      resetForm();
      loadSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Error saving supplier: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteSupplier = async (sid) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        console.log("Attempting to delete supplier with ID:", sid);
        await axios.delete(`http://localhost:8080/api/v3/deleteSupplier/${sid}`);
        loadSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Error deleting supplier: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const editSupplier = async (supplier) => {
    try {
      console.log("Attempting to edit supplier:", supplier);
      const response = await axios.get(`http://localhost:8080/api/v3/getSupplier/${supplier.sid}`);
      setCurrentSupplier(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      alert("Error loading supplier for editing: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setCurrentSupplier({
      sid: null,
      supplier: "",
      material: "",
      address: "",
      phone: ""
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <FaStore className="text-success" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Supplier Management</h1>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{isEditing ? 'Edit Supplier' : 'Create New Supplier'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Supplier Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="supplier"
                    value={currentSupplier.supplier}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Material</label>
                  <input
                    type="text"
                    className="form-control"
                    name="material"
                    value={currentSupplier.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={currentSupplier.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={currentSupplier.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {isEditing ? 'Update' : 'Create'} Supplier
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
              <h5 className="mb-0 fw-bold text-success">Suppliers</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Supplier Name</th>
                      <th>Material</th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">Loading suppliers...</td>
                      </tr>
                    ) : suppliers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">No suppliers found</td>
                      </tr>
                    ) : (
                      suppliers.map((supplier, index) => (
                        <tr key={supplier.sid}>
                          <td>{index + 1}</td>
                          <td>{supplier.supplier}</td>
                          <td>{supplier.material}</td>
                          <td>{supplier.address}</td>
                          <td>{supplier.phone}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => editSupplier(supplier)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => deleteSupplier(supplier.sid)}
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
