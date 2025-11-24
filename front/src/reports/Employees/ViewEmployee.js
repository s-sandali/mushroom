import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/employees/view?id=${id}`);
        setEmployee(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Failed to load employee details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger alert-modern text-center">
          <i className="bi bi-exclamation-octagon-fill me-2"></i>
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/employees" className="btn btn-outline-success">
            Back to Employees List
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading employee details...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="employee-card glass-morphism rounded-4 p-4 p-md-5 mx-auto">
        <div className="text-center mb-4">
          <div className="employee-avatar bg-success-gradient">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="employee-name mt-3">{employee.name}</h2>
          <span className="employee-role badge bg-success">{employee.role}</span>
        </div>

        <div className="employee-details">
          <div className="detail-row">
            <span className="detail-label">NIC:</span>
            <span className="detail-value">{employee.nic}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{employee.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{employee.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender:</span>
            <span className={`detail-value badge ${employee.sex === 'Male' ? 'bg-primary' : 'bg-pink'}`}>
              {employee.sex}
            </span>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/employees" className="btn btn-success btn-lg px-4 rounded-pill">
            <i className="bi bi-arrow-left me-2"></i>Back to Employees
          </Link>
        </div>
      </div>

      <style jsx>{`
        .employee-card {
          max-width: 600px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .glass-morphism {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(245, 245, 245, 0.9));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .employee-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin: 0 auto;
        }
        
        .bg-success-gradient {
          background: linear-gradient(135deg, #28a745, #5cb85c);
        }
        
        .employee-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .employee-role {
          font-size: 0.9rem;
          padding: 0.35rem 1rem;
          font-weight: 500;
        }
        
        .employee-details {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
        }
        
        .detail-value {
          color: #333;
          text-align: right;
        }
        
        .alert-modern {
          border-radius: 12px;
          border-left: 4px solid #dc3545;
        }
        
        .bg-pink {
          background-color: #ff6b9d !important;
        }
        
        .rounded-4 {
          border-radius: 1rem !important;
        }
      `}</style>
    </div>
  );
}