import React, { useState } from 'react';
import InventoryList from '../components/inventory/InventoryList';
import MaterialRequestForm from '../components/inventory/MaterialRequestForm';
import StockAlert from '../components/inventory/StockAlert';
import AddInventoryItemForm from '../components/inventory/AddInventoryItemForm';
import MaterialRequestsList from '../components/inventory/MaterialRequestsList';
import { FaWarehouse } from 'react-icons/fa';

const LabInventory = () => {
  const [inventoryRefreshKey, setInventoryRefreshKey] = useState(0);
  const [requestsRefreshKey, setRequestsRefreshKey] = useState(0);

  const handleInventoryUpdate = () => {
    setInventoryRefreshKey(k => k + 1);
  };

  const handleRequestUpdate = () => {
    setRequestsRefreshKey(k => k + 1);
  };

  return (
    <div className="container-fluid py-4 lab-inventory-container">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-info">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 p-3 me-3">
            <FaWarehouse className="text-info" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Lab Inventory</h1>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <AddInventoryItemForm onInventoryUpdated={handleInventoryUpdate} />
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <MaterialRequestForm onRequestSubmitted={handleRequestUpdate} />
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body">
              <StockAlert refreshKey={inventoryRefreshKey} />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h5 className="mb-0 fw-bold text-info">Inventory Items</h5>
            </div>
            <div className="card-body">
              <InventoryList refreshKey={inventoryRefreshKey} />
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h5 className="mb-0 fw-bold text-info">Material Requests</h5>
            </div>
            <div className="card-body">
              <MaterialRequestsList refreshKey={requestsRefreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabInventory;
