import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getBatches } from '../../api/batchApi';
import { getDashboardStats } from '../../api/dashboardApi';
import { FaSeedling, FaExclamationTriangle } from 'react-icons/fa';

const chartColors = {
  success: {
    border: '#10b981',
    background: 'rgba(16,185,129,0.15)'
  },
  contaminated: {
    border: '#ef4444',
    background: 'rgba(239,68,68,0.12)'
  }
};

const GrowthStatusChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [batchesResponse, statsResponse] = await Promise.all([
          getBatches(),
          getDashboardStats()
        ]);
        const monthlyData = processMonthlyData(batchesResponse);

        setChartData({
          labels: monthlyData.labels,
          datasets: [
            {
              label: 'Successful Growth',
              data: monthlyData.successful,
              borderColor: chartColors.success.border,
              backgroundColor: chartColors.success.background,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true
            },
            {
              label: 'Contaminated',
              data: monthlyData.contaminated,
              borderColor: chartColors.contaminated.border,
              backgroundColor: chartColors.contaminated.background,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true
            }
          ]
        });
      } catch (err) {
        setError('Failed to load growth data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const processMonthlyData = (batches) => {
    const monthlyMap = new Map();

    batches.forEach(batch => {
      const date = new Date(batch.cultivationStartDate);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { successful: 0, contaminated: 0 });
      }
      monthlyMap.get(month).successful += batch.successfulGrowth;
      monthlyMap.get(month).contaminated += batch.contaminatedCount;
    });

    // Sort months chronologically
    const sortedMonths = Array.from(monthlyMap.keys()).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });

    return {
      labels: sortedMonths,
      successful: sortedMonths.map(m => monthlyMap.get(m).successful),
      contaminated: sortedMonths.map(m => monthlyMap.get(m).contaminated)
    };
  };

  if (loading) {
    return (
      <div className="card shadow-sm p-4 mb-4 text-center" style={{ minHeight: 340 }}>
        <div className="spinner-border text-success mb-2" role="status" />
        <div className="text-muted">Loading growth data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm p-4 mb-4">
        <div className="alert alert-danger mb-0">{error}</div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
      <div className="card-header bg-gradient bg-light border-0 d-flex align-items-center">
        <FaSeedling className="me-2 text-success" size={22} />
        <h5 className="mb-0 fw-bold">Monthly Growth Overview</h5>
      </div>
      <div className="card-body" style={{ background: 'linear-gradient(120deg,#f8fafc 60%,#e6f9f0 100%)' }}>
        <div style={{ height: 320 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    font: { size: 14, weight: 'bold' },
                    color: '#374151',
                    usePointStyle: true,
                    padding: 20
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  padding: 12,
                  backgroundColor: '#fff',
                  borderColor: '#e5e7eb',
                  borderWidth: 1,
                  titleColor: '#111827',
                  bodyColor: '#111827',
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: '#6b7280', font: { size: 13 } }
                },
                y: {
                  beginAtZero: true,
                  grid: { color: '#e5e7eb' },
                  ticks: { color: '#6b7280', font: { size: 13 } }
                }
              }
            }}
          />
        </div>
      </div>
      <div className="card-footer bg-light border-0 d-flex align-items-center gap-3">
        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill d-flex align-items-center">
          <FaSeedling className="me-1" /> Successful Growth
        </span>
        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill d-flex align-items-center">
          <FaExclamationTriangle className="me-1" /> Contaminated
        </span>
      </div>
    </div>
  );
};

export default GrowthStatusChart;
