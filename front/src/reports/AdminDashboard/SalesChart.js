import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';


export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/sales-chart-grouped")
      .then((response) => {
        console.log("API Response:", response.data);
        const rawData = response.data;

        const groupedByMonth = {};
        rawData.forEach(entry => {
          if (!groupedByMonth[entry.month]) {
            groupedByMonth[entry.month] = [];
          }
          groupedByMonth[entry.month].push(entry);
        });

        const transformedData = [];
        const keys = new Set();
        Object.keys(groupedByMonth).forEach(month => {
          const row = { month };
          groupedByMonth[month].forEach(product => {
            row[product.productName] = product.quantity;
            keys.add(product.productName);
          });
          transformedData.push(row);
        });

        setChartData(transformedData);
        setLineKeys(Array.from(keys));
      })
      .catch((error) => {
        console.error("Error fetching grouped sales chart data:", error);
      });
  }, []);

  return (
    <div className="sales-chart-container" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      width: '100%',
      height: '400px', // Changed to 100% to fill the container properly
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h5 style={{ fontWeight: '600', color: '#0d6efd', marginBottom: '1rem' }}>
        Monthly Sales Performance
      </h5>

      <div style={{ width: '100%', height: 'calc(100% - 2.5rem)' }}> {/* Adjust height to account for title */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%"> {/* Changed from 200% to 100% */}
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                angle={-30}
                textAnchor="end"
                interval={0}
                stroke="#333"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#333"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                verticalAlign="top"
                height={40}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: '10px',
                  fontSize: '12px',
                  flexWrap: 'wrap'
                }}
              />

              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={getColor(index)}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted small">Loading chart data...</p>
        )}
      </div>
    </div>
  );
}

const getColor = (index) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#ff69b4', '#a29bfe', '#fd79a8'];
  return colors[index % colors.length];
};