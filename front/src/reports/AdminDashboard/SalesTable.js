import React, { useEffect, useState } from 'react';
import { ArrowUpCircle,  Filter, BarChart2, RefreshCw, Search } from 'lucide-react';
import { API_BASE_URL } from '../../config/apiConfig';

const OVERALL_SALES_ENDPOINT = `${API_BASE_URL}/api/admin/overall-sales`;

export default function SalesTable() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'month',
    direction: 'asc'
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showTotals, setShowTotals] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(OVERALL_SALES_ENDPOINT, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSalesData(data);
        setFilteredData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching sales table data:", err);
        setError("Failed to load sales data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique product names
  const uniqueProductNames = [...new Set(salesData.flatMap(row =>
    Object.keys(row).filter(key => key !== "month")
  ))];

  // Handler for search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(salesData);
    } else {
      const filtered = salesData.filter(row => 
        row.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(row)
          .some(([key, value]) => 
            key !== "month" && 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, salesData]);

  // Handler for timeframe filter
  useEffect(() => {
    if (selectedTimeframe === 'all') {
      setFilteredData(salesData);
    } else {
      let filtered = [...salesData];
      
      if (selectedTimeframe === 'recent') {
        // Get last 3 months
        filtered = salesData.slice(-3);
      } else if (selectedTimeframe === 'q1') {
        filtered = salesData.filter(row => 
          ['January', 'February', 'March'].includes(row.month)
        );
      } else if (selectedTimeframe === 'q2') {
        filtered = salesData.filter(row => 
          ['April', 'May', 'June'].includes(row.month)
        );
      } else if (selectedTimeframe === 'q3') {
        filtered = salesData.filter(row => 
          ['July', 'August', 'September'].includes(row.month)
        );
      } else if (selectedTimeframe === 'q4') {
        filtered = salesData.filter(row => 
          ['October', 'November', 'December'].includes(row.month)
        );
      }
      
      setFilteredData(filtered);
    }
  }, [selectedTimeframe, salesData]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(sortedData);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = {};
    uniqueProductNames.forEach(product => {
      totals[product] = filteredData.reduce((sum, row) => sum + (row[product] || 0), 0);
    });
    return totals;
  };

  // Export data as CSV
  /*const exportToCSV = () => {
    const headers = ['Month', ...uniqueProductNames];
    const csvRows = [headers.join(',')];
    
    filteredData.forEach(row => {
      const values = [row.month, ...uniqueProductNames.map(product => row[product] || 0)];
      csvRows.push(values.join(','));
    });
    
    if (showTotals) {
      const totals = calculateTotals();
      const totalRow = ['Total', ...uniqueProductNames.map(product => totals[product])];
      csvRows.push(totalRow.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'sales_data.csv';
    link.href = url;
    link.click();
  };*/

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  // Calculate growth percentage
  const calculateGrowth = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };
  
  // Helper to get previous month value
  const getPreviousMonthValue = (index, product) => {
    if (index === 0) return null;
    return filteredData[index - 1][product] || 0;
  };

  return (
    <div className="sales-container">
      <div className="sales-card">
        <div className="card-header">
          <div className="header-left">
            <h2 className="card-title">
              <BarChart2 className="header-icon" size={24} />
              Sales Performance
            </h2>
            <p className="card-subtitle">Monthly sales by product</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-refresh" 
              onClick={() => window.location.reload()}
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
            
          </div>
        </div>

        <div className="card-toolbar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search sales data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="timeframe-select"
              >
                <option value="all">All Time</option>
                <option value="recent">Last 3 Months</option>
                <option value="q1">Q1 (Jan-Mar)</option>
                <option value="q2">Q2 (Apr-Jun)</option>
                <option value="q3">Q3 (Jul-Sep)</option>
                <option value="q4">Q4 (Oct-Dec)</option>
              </select>
            </div>
            
            <div className="totals-toggle">
              <input
                type="checkbox"
                id="showTotals"
                checked={showTotals}
                onChange={() => setShowTotals(!showTotals)}
              />
              <label htmlFor="showTotals">Show Totals</label>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Analyzing sales data...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">!</div>
              <p>{error}</p>
              <button 
                className="btn-retry"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} className="me-2" />
                Retry
              </button>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th 
                      className="month-header sortable" 
                      onClick={() => requestSort('month')}
                    >
                      Month {getSortIndicator('month')}
                    </th>
                    {uniqueProductNames.map(product => (
                      <th 
                        key={product} 
                        className="product-header sortable"
                        onClick={() => requestSort(product)}
                      >
                        {product} {getSortIndicator(product)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <td className="month-cell">
                        <span className="month-badge">{row.month}</span>
                      </td>
                      {uniqueProductNames.map(product => {
                        const value = row[product] || 0;
                        const prevValue = getPreviousMonthValue(index, product);
                        const growthPercent = calculateGrowth(value, prevValue);
                        
                        return (
                          <td key={product} className="sales-cell">
                            <div className="sales-value-container">
                              <span className={`sales-value ${value > 0 ? 'positive' : 'zero'}`}>
                                {value.toLocaleString()}
                              </span>
                              
                              {value > 0 && (
                                <ArrowUpCircle 
                                  size={16} 
                                  className="sales-icon"
                                  color="#28a745"
                                />
                              )}
                            </div>
                            
                            {growthPercent !== null && (
                              <div className={`growth-indicator ${growthPercent >= 0 ? 'positive' : 'negative'}`}>
                                {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}%
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  
                  {showTotals && (
                    <tr className="totals-row">
                      <td className="totals-label">
                        <strong>TOTAL</strong>
                      </td>
                      {uniqueProductNames.map(product => {
                        const total = calculateTotals()[product];
                        return (
                          <td key={product} className="totals-cell">
                            <strong>{total.toLocaleString()}</strong>
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No sales data available for the selected criteria</p>
              <button 
                className="btn-retry"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTimeframe('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <div className="results-count">
            Showing {filteredData.length} of {salesData.length} months
          </div>
          <div className="data-timestamp">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sales-container {
          padding: 2rem;
          display: flex;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .sales-card {
          width: 100%;
          max-width: 1200px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04);
          background: white;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          background: linear-gradient(135deg, #3a57e8 0%, #1e3bb3 100%);
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .card-title {
          margin: 0;
          font-weight: 600;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-subtitle {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-weight: 300;
        }

        .btn-refresh, .btn-export {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-refresh {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .btn-export {
          background: white;
          color: #3a57e8;
        }

        .btn-refresh:hover, .btn-export:hover {
          transform: translateY(-2px);
        }

        .card-toolbar {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: #f9fafc;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3a57e8;
          box-shadow: 0 0 0 3px rgba(58, 87, 232, 0.15);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          background: white;
          border: 1px solid #e5e7eb;
        }

        .timeframe-select {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: #374151;
          cursor: pointer;
          padding-right: 1rem;
        }

        .timeframe-select:focus {
          outline: none;
        }

        .totals-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .totals-toggle input {
          cursor: pointer;
        }

        .totals-toggle label {
          cursor: pointer;
        }

        .card-body {
          padding: 0;
          flex: 1;
          overflow: auto;
        }

        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .sales-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .sales-table th {
          position: sticky;
          top: 0;
          padding: 1rem;
          text-align: center;
          font-weight: 600;
          color: #111827;
          background-color: #f9fafc;
          border-bottom: 2px solid #e5e7eb;
          vertical-align: middle;
          z-index: 10;
        }

        .sortable {
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .sortable:hover {
          background-color: rgba(58, 87, 232, 0.05);
        }

        .month-header {
          min-width: 140px;
          text-align: left !important;
          padding-left: 2rem !important;
        }

        .product-header {
          min-width: 120px;
        }

        .sales-table td {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
        }

        .month-cell {
          font-weight: 500;
          color: #4b5563;
          padding-left: 2rem !important;
        }

        .month-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          background-color: #f3f4f6;
          color: #111827;
          font-weight: 500;
          min-width: 100px;
          text-align: center;
        }

        .sales-cell {
          text-align: center;
        }

        .sales-value-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .sales-value {
          font-weight: 600;
        }

        .sales-value.positive {
          color: #10b981;
        }

        .sales-value.zero {
          color: #9ca3af;
        }

        .sales-icon {
          transition: transform 0.3s ease;
        }

        .sales-cell:hover .sales-icon {
          transform: scale(1.2);
        }

        .growth-indicator {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          display: inline-block;
        }

        .growth-indicator.positive {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .growth-indicator.negative {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .even-row {
          background-color: white;
        }

        .odd-row {
          background-color: #f9fafc;
        }

        .even-row:hover, .odd-row:hover {
          background-color: rgba(58, 87, 232, 0.03);
        }

        .totals-row {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        .totals-label {
          text-align: right;
          color: #111827;
          padding-right: 2rem !important;
        }

        .totals-cell {
          color: #3a57e8;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid rgba(58, 87, 232, 0.1);
          border-top-color: #3a57e8;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 4rem 2rem;
          text-align: center;
          color: #dc2626;
        }

        .error-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .btn-retry {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          background-color: #3a57e8;
          color: white;
          border: none;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .btn-retry:hover {
          background-color: #2d46c8;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(58, 87, 232, 0.25);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 4rem 2rem;
          text-align: center;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          height: 70px;
          width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 50%;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #f9fafc;
          border-top: 1px solid #f0f0f0;
          font-size: 0.85rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .sales-container {
            padding: 1rem;
          }
          
          .card-header, .card-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .header-actions, .filter-controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .search-wrapper {
            max-width: 100%;
          }
          
          .card-footer {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}