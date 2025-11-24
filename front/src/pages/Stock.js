import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBoxes } from 'react-icons/fa';

export default function Stock() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v4/getStocks");
      setStocks(result.data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
            <FaBoxes className="text-success" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Stock Level Table</h1>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Material Name</th>
                  <th>Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">No stock data available</td>
                  </tr>
                ) : (
                  stocks.map((stock, index) => (
                    <tr key={stock.tid || index}>
                      <td>{index + 1}</td>
                      <td>{stock.material}</td>
                      <td>{stock.stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
