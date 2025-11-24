import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function EmployeeHome() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8080/api/employees/get");
      setEmployees(result.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to load employees. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/employees/delete/${id}`);
      loadEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee.");
    }
  };

  if (isLoading) {
    return (
      <div className="employee-loading-container">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="loading-text">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-error-container">
        <div className="error-card">
          <div className="error-icon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={loadEmployees}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-card glass-morphism">
        <div className="card-header">
          <h2 className="card-title">
            <i className="bi bi-people-fill me-2"></i>
            Employee Directory
          </h2>
          <p className="card-subtitle">Manage your employee records</p>
        </div>

        <div className="card-body">
          {employees.length > 0 ? (
            <div className="table-responsive">
              <table className="employee-table">
                <thead>
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
                  {employees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td className="text-uppercase">{employee.nic}</td>
                      <td>{employee.phone}</td>
                      <td className="address-cell" title={employee.address}>
                        {employee.address}
                      </td>
                      <td>
                        <span className={`gender-badge ${employee.sex === 'Male' ? 'male' : 'female'}`}>
                          {employee.sex}
                        </span>
                      </td>
                      <td>
                        <span className="role-badge">{employee.role}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            className="btn btn-view" 
                            to={`/viewemployee/${employee.id}`}
                          >
                            <i className="bi bi-eye-fill me-1"></i> View
                          </Link>
                          <Link 
                            className="btn btn-edit" 
                            to={`/editemployee/${employee.id}`}
                          >
                            <i className="bi bi-pencil-fill me-1"></i> Edit
                          </Link>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteEmployee(employee.id)}
                          >
                            <i className="bi bi-trash-fill me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-people text-muted"></i>
              <p>No employees found in records</p>
              <Link to="/addemployee" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Add New Employee
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .employee-container {
          min-height: 100vh;
          padding: 6rem 2rem 2rem 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        .employee-card {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .glass-morphism {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .card-header {
          background: linear-gradient(135deg, #20c997 0%, #1e9f83 100%);
          color: white;
          padding: 1.5rem 2rem;
        }

        .card-title {
          margin: 0;
          font-weight: 600;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
        }

        .card-subtitle {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-weight: 300;
        }

        .card-body {
          padding: 2rem;
        }

        .employee-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .employee-table thead {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .employee-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        .employee-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          vertical-align: middle;
        }

        .employee-table tr:last-child td {
          border-bottom: none;
        }

        .employee-table tr:hover {
          background-color: rgba(40, 167, 69, 0.05);
        }

        .address-cell {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gender-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          color: white;
          font-weight: 500;
          min-width: 60px;
          text-align: center;
        }

        .gender-badge.male {
          background-color: #007bff;
        }

        .gender-badge.female {
          background-color: #ff6b9d;
        }

        .role-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          background-color: #6c757d;
          color: white;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s ease;
          border: none;
          font-size: 0.9rem;
        }

        .btn-view {
          background-color: #20c997;
          color: white;
        }

        .btn-edit {
          background-color: white;
          color: #20c997;
          border: 2px solid #20c997;
        }

        .btn-edit:hover {
          background-color: #20c997;
          color: white;
        }

        .btn-delete {
          background-color: #dc3545;
          color: white;
        }

        .btn-view:hover, .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          opacity: 0.9;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .empty-state i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .employee-loading-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        .spinner-container {
          text-align: center;
        }

        .loading-text {
          margin-top: 1rem;
          color: #495057;
          font-weight: 500;
        }

        .employee-error-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          padding: 2rem;
        }

        .error-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .error-icon {
          font-size: 3rem;
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .error-title {
          color: #dc3545;
          margin-bottom: 0.5rem;
        }

        .error-message {
          color: #495057;
          margin-bottom: 1.5rem;
        }

        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css");
      `}</style>
    </div>
  );
}
