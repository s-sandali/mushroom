import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getContaminationData } from '../../api/dashboardApi';

const ContaminationChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetches: { labels: [...], values: [...] }
        const response = await getContaminationData();

        // Defensive: Ensure response is valid and has arrays
        const labels = Array.isArray(response?.labels) ? response.labels : [];
        const values = Array.isArray(response?.values) ? response.values : [];

        // Optional: If you expect at least one value, check here
        if (labels.length === 0 || values.length === 0) {
          setChartData(null);
          setError('No contamination data available.');
          return;
        }

        const data = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                '#ef4444',
                '#f59e0b',
                '#10b981',
                '#3b82f6',
                '#8b5cf6'
              ],
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverBorderWidth: 4,
              hoverBorderColor: '#ffffff',
              hoverOffset: 10,
            },
          ],
        };
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load contamination data');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFullscreen = () => {
    const elem = document.getElementById('contamination-chart-container');
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm p-3 mb-4" id="contamination-chart-container">
        <div className="text-center text-muted">Loading contamination data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm p-3 mb-4" id="contamination-chart-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="card shadow-sm p-3 mb-4" id="contamination-chart-container">
        <div className="text-center text-muted">No contamination data available.</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3 mb-4" id="contamination-chart-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Distribution of contaminated batches by mushroom type</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return `${label}: ${value}`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

export default ContaminationChart;
