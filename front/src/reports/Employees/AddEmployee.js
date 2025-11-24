import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    nic: '',
    phone: '',
    address: '',
    sex: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { label: "Lab", value: "LAB" },
    { label: "Sales", value: "SALES" },
    { label: "Inventory", value: "INVENTORY" }
  ];

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, nic, phone, address, sex, role } = employee;
    
    if (!name || !nic || !phone || !address || !sex || !role) {
      setError("All fields are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/employees/add", {
        name,
        nic,
        phone,
        address,
        sex: sex.toUpperCase(),
        role: role.toUpperCase()
      });
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      setError(error.response?.data?.message || "Failed to add employee. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <UserPlus size={32} className="form-icon" />
          <h2 className="form-title">Add New Employee</h2>
          <p className="form-subtitle">Enter employee details to register them in the system</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-modern">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={employee.name}
              onChange={onInputChange}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nic" className="form-label">
              NIC Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              name="nic"
              value={employee.nic}
              onChange={onInputChange}
              placeholder="123456789V"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              name="phone"
              value={employee.phone}
              onChange={onInputChange}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address <span className="required-asterisk">*</span>
            </label>
            <textarea
              className="form-input"
              name="address"
              value={employee.address}
              onChange={onInputChange}
              placeholder="123 Main St, City"
              rows="2"
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="sex" className="form-label">
                  Gender <span className="required-asterisk">*</span>
                </label>
                <select
                  className="form-input"
                  name="sex"
                  value={employee.sex}
                  onChange={onInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role <span className="required-asterisk">*</span>
                </label>
                <select
                  className="form-input"
                  name="role"
                  value={employee.role}
                  onChange={onInputChange}
                >
                  <option value="">Select Role</option>
                  {roles.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/employees" className="cancel-btn">
              <ArrowLeft size={18} className="me-2" />
              Cancel
            </Link>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
          background: #f8f9fa;
        }
        
        .form-card {
          width: 100%;
          max-width: 700px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .form-icon {
          color: ##218838;
          background: rgba(79, 70, 229, 0.1);
          padding: 1rem;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        
        .form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #218838; /* Green color */
  margin-bottom: 0.5rem;
}

        
        .form-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 0;
        }
        
        .alert-modern {
          border-radius: 12px;
          border-left: 4px solid #dc3545;
          margin-bottom: 1.5rem;
        }
        
        .employee-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          position: relative;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }
        
        .required-asterisk {
          color: #dc3545;
          margin-left: 0.25rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-input:focus {
          border-color:#218838;
          box-shadow: 0 0 0 0.25rem rgba(79, 70, 229, 0.25);
          outline: 0;
        }
        
        .form-input::placeholder {
          color: #adb5bd;
        }
        
        textarea.form-input {
          min-height: 80px;
          resize: vertical;
        }
        
        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23495057'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #218838,#1e7e34);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .submit-btn:hover {
          background: linear-gradient(135deg,#1e7e34, #218838);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .submit-btn:disabled {
          background: #6c757d;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
        
        .cancel-btn {
          display: flex;
          align-items: center;
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          color: #495057;
          background-color: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 1rem;
          }
          
          .form-card {
            padding: 1.5rem;
          }
          
          .form-actions {
            flex-direction: column-reverse;
            gap: 1rem;
          }
          
          .submit-btn, .cancel-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}