import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Failed to fetch materials:", error);
      setError("Failed to load materials. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    
    try {
      await axios.delete("http://localhost:8080/api/v3/material/delete", {
        data: { id }
      });
      loadMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      setError("Failed to delete material.");
    }
  };

  if (isLoading) {
    return (
      <div className="material-loading-container">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="loading-text">Loading materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-error-container">
        <div className="error-card">
          <div className="error-icon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={loadMaterials}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="material-container">
      <div className="material-card glass-morphism">
        <div className="card-header">
          <h2 className="card-title">
            <i className="bi bi-box-seam me-2"></i>
            Material Inventory
          </h2>
          <p className="card-subtitle">Manage your material resources</p>
        </div>

        <div className="card-body">
          {materials.length > 0 ? (
            <div className="table-responsive">
              <table className="material-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={material.id}>
                      <td>{index + 1}</td>
                      <td>{material.name}</td>
                      <td>
                        <span className={`quantity-badge ${material.quantity < 10 ? 'low-quantity' : ''}`}>
                          {material.quantity}
                        </span>
                      </td>
                      <td className="description-cell">{material.description}</td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            className="btn btn-view" 
                            to={`/viewmaterial/${material.id}`}
                          >
                            <i className="bi bi-eye-fill me-1"></i> View
                          </Link>
                          <Link 
                            className="btn btn-edit" 
                            to={`/editmaterial/${material.id}`}
                          >
                            <i className="bi bi-pencil-fill me-1"></i> Edit
                          </Link>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteMaterial(material.id)}
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
              <i className="bi bi-inbox text-muted"></i>
              <p>No materials found in inventory</p>
              <Link to="/addmaterial" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Add New Material
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .material-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        .material-card {
          width: 100%;
          max-width: 1200px;
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
          background: linear-gradient(135deg, #20c997 0%, #1c9f85 100%);
          color: white;
          padding: 1.5rem 2rem;
          margin-top: 80px;
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

        .material-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .material-table thead {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .material-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        .material-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          vertical-align: middle;
        }

        .material-table tr:last-child td {
          border-bottom: none;
        }

        .material-table tr:hover {
          background-color: rgba(32, 201, 151, 0.1);
        }

        .quantity-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          background-color: #20c997;
          color: white;
          font-weight: 500;
          min-width: 40px;
          text-align: center;
        }

        .quantity-badge.low-quantity {
          background-color: #dc3545;
          animation: pulse 1.5s infinite;
        }

        .description-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .material-loading-container {
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

        .material-error-container {
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

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css");
      `}</style>
    </div>
  );
}
