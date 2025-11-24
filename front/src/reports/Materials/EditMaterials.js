import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditMaterials() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [material, setMaterials] = useState({
    id: "",
    name: "",
    quantity: "",
    description: ""
  });

  const { name, quantity, description } = material;

  const onInputChange = (e) => {
    setMaterials({
      ...material,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v3/material/get');
        const found = response.data.find((m) => m.id.toString() === id);
        if (found) {
          setMaterials(found);
        } else {
          console.error("Material not found");
        }
      } catch (error) {
        console.error("Error loading material:", error);
      }
    };
    loadMaterial();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8080/api/v3/material/update', {
        ...material,
        quantity: parseInt(material.quantity),
        id: parseInt(id)
      });
      navigate("/materials"); 
    } catch (error) {
      console.error("Error updating material:", error);
    }
  };
  

  return (
    <div className="container mt-4">
      <div className="col-md-6 offset-md-3 bg-white border rounded p-4 shadow">
        <h4 className="text-center text-success fw-bold mb-4">Edit Material</h4>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Material Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Material Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Material Quantity"
              name="quantity"
              value={quantity}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Material Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Material Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-4 me-2">Update</button>
            <Link className="btn btn-outline-secondary px-4" to="/materials">Cancel</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
