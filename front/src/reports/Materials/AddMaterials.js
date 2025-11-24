import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PackagePlus, ArrowLeft } from 'lucide-react';

export default function AddMaterials() {
  const navigate = useNavigate();
  const [material, setMaterials] = useState({
    name: "",
    quantity: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, quantity, description } = material;

  const onInputChange = (e) => {
    setMaterials({
      ...material,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8080/api/v3/material/add", {
        ...material,
        quantity: parseInt(material.quantity)
      });
      navigate("/materials");
    } catch (error) {
      console.error("Error adding material:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <PackagePlus size={32} className="form-icon" />
          <h2 className="form-title">Add New Material</h2>
          <p className="form-subtitle">Fill in the details below to register a new material</p>
        </div>

        <form onSubmit={onSubmit} className="material-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Material Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oak Wood, Steel Bolts"
              name="name"
              value={name}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="form-label">
              Quantity
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter quantity in units"
              name="quantity"
              value={quantity}
              onChange={onInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
              <span className="required-asterisk">*</span>
            </label>
            <textarea
              className="form-input"
              placeholder="Provide details about the material"
              name="description"
              value={description}
              onChange={onInputChange}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <Link to="/materials" className="cancel-btn">
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
                'Add Material'
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
          max-width: 600px;
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
          margin-bottom: 2.5rem;
        }
        
        .form-icon {
          color: #28a745;
          background: rgba(40, 167, 69, 0.1);
          padding: 1rem;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        
        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2e7d32;
          margin-bottom: 0.5rem;
        }
        
        .form-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 0;
        }
        
        .material-form {
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
          border-color: #28a745;
          box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.25);
          outline: 0;
        }
        
        .form-input::placeholder {
          color: #adb5bd;
        }
        
        textarea.form-input {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #28a745, #218838);
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
          background: linear-gradient(135deg, #218838, #1e7e34);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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