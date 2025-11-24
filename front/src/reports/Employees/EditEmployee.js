import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employee, setEmployee] = useState({
    name: '',
    nic: '',
    phone: '',
    address: '',
    sex: '',
    role: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/employees/view?id=${id}`);
        setEmployee(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Failed to load employee details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { name, nic, phone, address, sex, role } = employee;
    if (!name || !nic || !phone || !address || !sex || !role) {
      setError("All fields are required!");
      return;
    }

    const updatedEmployee = {
      name,
      nic,
      phone,
      address,
      sex: sex.toUpperCase(),
      role: role.toUpperCase()
    };

    try {
      await axios.put(`http://localhost:8080/api/employees/update/${id}`, updatedEmployee);
      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Something went wrong while updating the employee.");
    }
  };

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading employee details...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="glass-card rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-4">
          <h2 className="text-gradient fw-bold">Edit Employee</h2>
          <p className="text-muted">Update the employee details below</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-modern fade show mb-4" role="alert">
            <i className="bi bi-exclamation-octagon-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder=" "
                  value={employee.name}
                  onChange={onInputChange}
                />
                <label htmlFor="name">Full Name</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="nic"
                  name="nic"
                  placeholder=" "
                  value={employee.nic}
                  onChange={onInputChange}
                />
                <label htmlFor="nic">NIC Number</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder=" "
                  value={employee.phone}
                  onChange={onInputChange}
                />
                <label htmlFor="phone">Phone Number</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="sex"
                  name="sex"
                  value={employee.sex}
                  onChange={onInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <label htmlFor="sex">Gender</label>
              </div>
            </div>

            <div className="col-12">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder=" "
                  value={employee.address}
                  onChange={onInputChange}
                />
                <label htmlFor="address">Address</label>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={employee.role}
                  onChange={onInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="LAB">Lab</option>
                  <option value="SALES">Sales</option>
                  <option value="INVENTORY">Inventory</option>


                </select>
                <label htmlFor="role">Employee Role</label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-5">
            <button type="submit" className="btn btn-success btn-lg px-4 rounded-pill">
              <i className="bi bi-check-circle-fill me-2"></i>Update Employee
            </button>
            <Link to="/employees" className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
              <i className="bi bi-x-circle-fill me-2"></i>Cancel
            </Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .text-gradient {
          background: linear-gradient(to right, #28a745, #17a2b8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .form-floating > .form-control,
        .form-floating > .form-select {
          height: calc(3.5rem + 2px);
          line-height: 1.25;
        }
        
        .form-floating > label {
          color: #6c757d;
          padding: 1rem 1.25rem;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.25);
        }
        
        .rounded-4 {
          border-radius: 1rem !important;
        }
        
        .alert-modern {
          border-radius: 12px;
          border-left: 4px solid #dc3545;
        }
        
        .btn-success {
          transition: all 0.3s ease;
        }
        
        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        }
      `}</style>
    </div>
  );
}