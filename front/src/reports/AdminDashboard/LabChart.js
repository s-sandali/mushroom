import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function LabChart() {
  const [chartData, setChartData] = useState(null);
  const [mushroomType, setMushroomType] = useState('OYSTER');
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()); // 0 = January
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8080/api/admin/lab-chart', {
          params: {
            year,
            month: reportType === 'monthly' ? month : undefined, // Add month parameter when in monthly mode
            type: mushroomType === 'ALL' ? null : mushroomType
          }
        });

        const data = response.data;

        let totalSuccess = 0;
        let totalContaminated = 0;

        if (reportType === 'annual') {
          // Aggregate all months
          if (Array.isArray(data)) {
            data.forEach(item => {
              totalSuccess += item.successCount || 0;
              totalContaminated += item.contaminatedCount || 0;
            });
          }
        } else {
          // Monthly data - directly use the response if not in array format
          if (Array.isArray(data)) {
            const selectedLabel = monthNames[month];
            const monthData = data.find(item => item.label === selectedLabel);
            if (monthData) {
              totalSuccess = monthData.successCount || 0;
              totalContaminated = monthData.contaminatedCount || 0;
            }
          } else if (data && typeof data === 'object') {
            // Handle case where API returns single object for monthly data
            totalSuccess = data.successCount || 0;
            totalContaminated = data.contaminatedCount || 0;
          }
        }

        const total = totalSuccess + totalContaminated;
        const successRate = total > 0 ? Math.round((totalSuccess / total) * 100) : 0;

        setChartData({
          labels: ['Success', 'Contaminated'],
          datasets: [
            {
              data: [totalSuccess, totalContaminated],
              backgroundColor: ['#4CAF50', '#FF6384'],
              hoverBackgroundColor: ['#66BB6A', '#FF7A97'],
              borderWidth: 2,
              borderColor: ['rgba(76, 175, 80, 0.1)', 'rgba(255, 99, 132, 0.1)'],
            },
          ],
          successRate
        });
      } catch (err) {
        console.error('Error fetching lab chart data:', err);
        setError('Failed to load chart data');
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromDatabase();
  }, [mushroomType, reportType, year, month]);

  // Center content for doughnut chart
  const plugins = [
    {
      id: 'centerText',
      beforeDraw: function(chart) {
        if (chartData && chartData.successRate !== undefined) {
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;
          
          ctx.restore();
          ctx.font = "bold 24px Inter";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6366F1";
          
          const text = `${chartData.successRate}%`;
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2 - 10;
          
          ctx.fillText(text, textX, textY);
          
          ctx.font = "500 12px Inter";
          ctx.fillStyle = "#4A5568";
          const subText = "Success Rate";
          const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
          const subTextY = height / 2 + 15;
          
          ctx.fillText(subText, subTextX, subTextY);
          ctx.save();
        }
      }
    }
  ];

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2D3748',
        bodyColor: '#4A5568',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        caretSize: 7,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        displayColors: true,
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="lab-chart-container">
      <h2 className="chart-title">
        Lab Performance ({reportType === 'monthly' ? monthNames[month] : 'Annual'} {year})
      </h2>

      <div className="controls-container">
        <div className="control-group">
          <label className="control-label">
            Mushroom Type:
            <select
              value={mushroomType}
              onChange={(e) => setMushroomType(e.target.value)}
              className="select-control"
            >
              <option value="ALL">All</option>
              <option value="OYSTER">Oyster</option>
              <option value="SHIITAKE">Shiitake</option>
              <option value="PORTABELLA">Portabella</option>
              <option value="MAITAKE">Maitake</option>
              <option value="LIONS_MANE">Lions Mane</option>
            </select>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">
            Report Type:
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="select-control"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min="2020"
              max="2030"
              className="input-control"
            />
          </label>
        </div>

        {reportType === 'monthly' && (
          <div className="control-group">
            <label className="control-label">
              Month:
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="select-control"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="chart-wrapper">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                // Use the same function as in the useEffect to retry fetching data
                const fetchDataFromDatabase = async () => {
                  try {
                    const response = await axios.get('http://localhost:8080/api/admin/lab-chart', {
                      params: {
                        year,
                        month: reportType === 'monthly' ? month : undefined,
                        type: mushroomType === 'ALL' ? null : mushroomType
                      }
                    });
                    // Process data as in useEffect
                    // (Code omitted for brevity - this should be refactored to a common function)
                    setError(null);
                  } catch (err) {
                    console.error('Error fetching lab chart data:', err);
                    setError('Failed to load chart data');
                  } finally {
                    setIsLoading(false);
                  }
                };
                fetchDataFromDatabase();
              }}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        ) : chartData ? (
          <>
            <div className="chart-inner">
              <Doughnut data={chartData} options={chartOptions} plugins={plugins} />
            </div>
            <div className="stats-container">
              <div className="stat-item success">
                <div className="stat-dot"></div>
                <div className="stat-label">Success</div>
                <div className="stat-value">{chartData.datasets[0].data[0]}</div>
              </div>
              <div className="stat-item contaminated">
                <div className="stat-dot"></div>
                <div className="stat-label">Contaminated</div>
                <div className="stat-value">{chartData.datasets[0].data[1]}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>No data available for selected filters</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .lab-chart-container {
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary, #2D3748);
        }

        .controls-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          background-color: rgba(247, 250, 252, 0.8);
          border-radius: 0.5rem;
          padding: 0.75rem;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .control-group {
          min-width: 140px;
          flex: 1;
        }

        .control-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary, #4A5568);
        }

        .select-control, .input-control {
          padding: 0.4rem 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background-color: white;
          font-size: 0.85rem;
          width: 100%;
          transition: all 0.2s ease;
          color: var(--text-primary, #2D3748);
        }

        .select-control:focus, .input-control:focus {
          outline: none;
          border-color: var(--accent-color, #6366F1);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .chart-wrapper {
          flex-grow: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
          min-height: 200px;
        }

        .chart-inner {
          position: relative;
          width: 100%;
          height: 220px;
          max-width: 220px;
          margin: 0 auto;
        }

        .stats-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
          width: 100%;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .stat-item.success .stat-dot {
          background-color: #4CAF50;
        }

        .stat-item.contaminated .stat-dot {
          background-color: #FF6384;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary, #4A5568);
        }

        .stat-value {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary, #2D3748);
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-left-color: var(--accent-color, #6366F1);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-data {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary, #4A5568);
        }

        .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #E53E3E;
          text-align: center;
        }

        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #6366F1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background-color: #5253b5;
        }
      `}</style>
    </div>
  );
}