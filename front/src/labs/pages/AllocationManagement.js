import React, { useState, useEffect } from 'react';
import { createAllocation, getAllocations } from '../api/allocationApi';
import { getBatches } from '../api/batchApi';
import { toast } from 'react-toastify';
import { FaArrowsAltH, FaBoxes, FaChartPie } from 'react-icons/fa';
import StatCard from '../components/common/StatCard';

const AllocationManagement = () => {
  const [formData, setFormData] = useState({
    seedId: '',
    salesCenterQty: 0,
    productionQty: 0
  });
  const [allocations, setAllocations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allocs, batchesData] = await Promise.all([
          getAllocations(),
          getBatches()
        ]);
        setAllocations(allocs);
        setBatches(batchesData);
      } catch (err) {
        toast.error('Failed to load data');
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createAllocation({
        ...formData,
        seedId: Number(formData.seedId),
        salesCenterQty: Number(formData.salesCenterQty),
        productionQty: Number(formData.productionQty)
      });
      toast.success('Allocation created successfully!');
      setFormData({ seedId: '', salesCenterQty: 0, productionQty: 0 });
      const updated = await getAllocations();
      setAllocations(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total allocated quantities
  const totalSales = allocations.reduce((sum, a) => sum + (a.salesCenterQty || 0), 0);
  const totalProduction = allocations.reduce((sum, a) => sum + (a.productionQty || 0), 0);

  return (
    <div className="container-fluid py-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-warning">
        <div className="d-flex align-items-center">
          <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 p-3 me-3">
            <FaArrowsAltH className="text-warning" style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 className="mb-1 fw-bold">Culture Allocations</h1>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-warning">Allocate Cultures</h5>
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Seed Batch</label>
                  <select
                    className="form-select"
                    value={formData.seedId}
                    onChange={e => setFormData({...formData, seedId: e.target.value})}
                    required
                  >
                    <option value="">Select a batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.type} (Started: {new Date(batch.cultivationStartDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Sales Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.salesCenterQty}
                    onChange={e => setFormData({...formData, salesCenterQty: e.target.value})}
                    min="0"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Production Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.productionQty}
                    onChange={e => setFormData({...formData, productionQty: e.target.value})}
                    min="0"
                    required
                  />
                </div>
                <div className="col-12">
                  <button 
                    type="submit" 
                    className="btn btn-warning w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Allocating...
                      </>
                    ) : 'Create Allocation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <StatCard
                title="Total Sales Allocated"
                value={totalSales}
                icon={<FaBoxes />}
                color="#f59e0b"
              />
            </div>
            <div className="col-md-6">
              <StatCard
                title="Total Production Allocated"
                value={totalProduction}
                icon={<FaChartPie />}
                color="#3b82f6"
              />
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-warning bg-opacity-10 border-0">
              <h5 className="mb-0 fw-bold text-warning">Allocation History</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Batch Type</th>
                      <th>Sales Qty</th>
                      <th>Production Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map(allocation => (
                      <tr key={allocation.id}>
                        <td>{allocation.seed?.type || 'N/A'}</td>
                        <td>{allocation.salesCenterQty}</td>
                        <td>{allocation.productionQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allocations.length === 0 && (
                  <div className="text-center text-muted py-3">No allocations found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationManagement;
