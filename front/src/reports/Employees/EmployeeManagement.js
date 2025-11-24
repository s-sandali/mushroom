import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Roles for the dropdown
const roles = [
  { label: "Lab", value: "LAB" },
  { label: "Sales", value: "SALES" },
  { label: "Inventory", value: "INVENTORY" }
];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    phone: '',
    address: '',
    sex: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewEmployee, setViewEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8080/api/employees/get");
      setEmployees(result.data);
      setError('');
    } catch (error) {
      setError("Failed to load employees. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nic: '',
      phone: '',
      address: '',
      sex: '',
      role: ''
    });
    setIsEditing(false);
    setEditId(null);
    setError('');
  };

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, nic, phone, address, sex, role } = formData;
    if (!name || !nic || !phone || !address || !sex || !role) {
      setError("All fields are required!");
      return;
    }
    try {
      if (isEditing && editId) {
        await axios.put(`http://localhost:8080/api/employees/update/${editId}`, {
          name, nic, phone, address, sex: sex.toUpperCase(), role: role.toUpperCase()
        });
      } else {
        await axios.post("http://localhost:8080/api/employees/add", {
          name, nic, phone, address, sex: sex.toUpperCase(), role: role.toUpperCase()
        });
      }
      resetForm();
      loadEmployees();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save employee. Please try again.");
    }
  };

  const onEdit = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/employees/view?id=${id}`);
      setFormData({
        name: response.data.name,
        nic: response.data.nic,
        phone: response.data.phone,
        address: response.data.address,
        sex: response.data.sex,
        role: response.data.role
      });
      setIsEditing(true);
      setEditId(id);
      setError('');
    } catch (error) {
      setError("Failed to load employee details.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/employees/delete/${id}`);
      loadEmployees();
    } catch (error) {
      setError("Failed to delete employee.");
    }
  };

  const onView = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/employees/view?id=${id}`);
      setViewEmployee(response.data);
      setError('');
    } catch (error) {
      setError("Failed to load employee details.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeView = () => setViewEmployee(null);

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <i className="bi bi-people text-success me-3" style={{ fontSize: '2rem' }}></i>
          <h1 className="fw-bold text-success mb-0">Employee Management</h1>
        </div>
      </div>
      <div className="row g-4">
        {/* Form Section */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h5>
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={onInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">NIC</label>
                  <input type="text" className="form-control" name="nic" value={formData.nic} onChange={onInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={onInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={onInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select className="form-control" name="sex" value={formData.sex} onChange={onInputChange} required>
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-control" name="role" value={formData.role} onChange={onInputChange} required>
                    <option value="">Select</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                {error && <div className="alert alert-danger mb-3">{error}</div>}
                <div className="d-flex gap-2">
                  {isEditing && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
                  )}
                  <button type="submit" className="btn btn-success">
                    {isEditing ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 border-bottom border-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-success">Employees</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>NIC</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">Loading employees...</td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">No employees found.</td>
                      </tr>
                    ) : (
                      employees.map((employee, index) => (
                        <tr key={employee.id}>
                          <td>{index + 1}</td>
                          <td>{employee.name}</td>
                          <td>{employee.nic}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.address}</td>
                          <td>{employee.sex}</td>
                          <td>{employee.role}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-info" onClick={() => onView(employee.id)}>View</button>
                              <button className="btn btn-outline-primary" onClick={() => onEdit(employee.id)}>Edit</button>
                              <button className="btn btn-outline-danger" onClick={() => onDelete(employee.id)}>Delete</button>
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
      {/* View Employee Modal */}
      {viewEmployee && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Employee Details</h5>
                <button type="button" className="btn-close" onClick={closeView}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {viewEmployee.name}</p>
                <p><strong>NIC:</strong> {viewEmployee.nic}</p>
                <p><strong>Phone:</strong> {viewEmployee.phone}</p>
                <p><strong>Address:</strong> {viewEmployee.address}</p>
                <p><strong>Gender:</strong> {viewEmployee.sex}</p>
                <p><strong>Role:</strong> {viewEmployee.role}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeView}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
