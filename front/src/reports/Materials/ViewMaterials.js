import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ViewMaterials() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/api/v3/material/view?id=${id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMaterial(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching material:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="text-center">
          <div className="spinner-grow text-success" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Loading material details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-4">
        <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-3 fs-3"></i>
            <div>
              <h5 className="alert-heading mb-1">Error loading material</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div className="text-center mt-4">
          <Link to="/materials" className="btn btn-success px-4 py-2 rounded-pill shadow-sm">
            <i className="bi bi-arrow-left me-2"></i>Back to Materials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-start pt-5 pb-4"
      style={{ minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}
    >
      <div className="card border-0 rounded-4 overflow-hidden shadow-lg" style={{ width: '100%', maxWidth: '900px' }}>
        <div className="card-header bg-success bg-gradient text-white py-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="material-icon bg-white text-success me-3">
                <i className="bi bi-box-seam fs-4"></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold">{material.name}</h2>
                <small className="opacity-75">Material Details</small>
              </div>
            </div>
            <span className="badge bg-white text-success fs-6">ID: {material.id}</span>
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="detail-card bg-light p-4 rounded-3 h-100">
                <h5 className="text-success mb-4 fw-bold d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i> Basic Information
                </h5>
                <div className="mb-3">
                  <label className="form-label text-muted mb-1">Quantity</label>
                  <div className="fs-4 fw-bold text-primary">
                    {material.quantity} <span className="fs-6 text-muted">units</span>
                  </div>
                </div>
                <div>
                  <label className="form-label text-muted mb-1">Status</label>
                  <div>
                    <span className={`badge ${material.quantity > 0 ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                      {material.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="detail-card bg-light p-4 rounded-3 h-100">
                <h5 className="text-success mb-4 fw-bold d-flex align-items-center">
                  <i className="bi bi-card-text me-2"></i> Description
                </h5>
                <div className="description-text">
                  {material.description || (
                    <span className="text-muted fst-italic">No description provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-top text-center">
            <Link to="/materials" className="btn btn-outline-success px-4 py-2 me-3 rounded-pill">
              <i className="bi bi-arrow-left me-2"></i>Back to List
            </Link>
          
          </div>
        </div>
      </div>

      <style jsx>{`
        .material-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .detail-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .description-text {
          line-height: 1.6;
          color: #444;
          white-space: pre-wrap;
        }

        .card-header {
          border-radius: 0 !important;
          z-index: 1;
          position: relative;
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        }

        .bg-gradient {
          background: linear-gradient(135deg, #28a745, #20c997);
        }

        .btn-success {
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #28a745, #20c997);
          border: none;
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4) !important;
        }

        .btn-outline-success:hover {
          background-color: rgba(40, 167, 69, 0.1);
        }
      `}</style>
    </div>
  );
}
