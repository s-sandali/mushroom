import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './LabReport.css'; // Uses your existing styling

export default function LabReport() {
  const [labData, setLabData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [generatedBy, setGeneratedBy] = useState('admin');

  const fetchLabReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8080/api/reports/lab', {
        params: { type: reportType, year, month, generatedBy },
        responseType: 'blob',
      });
      if (response.status === 200) {
        setLabData(response.data);
      } else {
        setError('Failed to fetch report data.');
      }
    } catch (error) {
      setError('Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  }, [reportType, year, month, generatedBy]);

  const downloadReport = () => {
    if (!labData) return;
    const fileURL = URL.createObjectURL(labData);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `lab_report_${year}_${month}.pdf`;
    link.click();
  };

  useEffect(() => {
    fetchLabReport();
  }, [fetchLabReport]);

  return (
    <div className="sales-report-page">
      <div className="report-card">
        {/* Header with Bootstrap icon */}
        <div className="report-header mb-4 d-flex align-items-center">
          <div
            className="report-icon d-flex align-items-center justify-content-center me-3"
            style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              borderRadius: 14,
              width: 56,
              height: 56
            }}
          >
            <i className="bi bi-flask text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <div className="header-content">
            <h2 className="report-title mb-0">Lab Reports</h2>
            <div className="report-subtitle">Analyze lab success and contamination data</div>
          </div>
        </div>
        {/* Report filters and actions */}
        <form
          onSubmit={e => {
            e.preventDefault();
            fetchLabReport();
          }}
        >
          <div className="report-filters mb-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="input-group-custom">
                  <label htmlFor="reportType" className="form-label">Report Frequency</label>
                  <div className="select-wrapper">
                    <select
                      id="reportType"
                      className="form-select custom-select"
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                    >
                      <option value="monthly">Monthly Summary</option>
                      <option value="yearly">Annual Overview</option>
                    </select>
                    <div className="select-arrow"></div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group-custom">
                  <label htmlFor="year" className="form-label">Year</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="year"
                      className="form-control custom-input"
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                    <span className="input-icon">📅</span>
                  </div>
                </div>
              </div>
              {reportType === 'monthly' && (
                <div className="col-md-4">
                  <div className="input-group-custom">
                    <label htmlFor="month" className="form-label">Reporting Month</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="month"
                        className="form-control custom-input"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        min="1"
                        max="12"
                      />
                      <span className="input-icon">🗓</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-md-4">
                <div className="input-group-custom">
                  <label htmlFor="generatedBy" className="form-label">Generated By</label>
                  <div className="select-wrapper">
                    <select
                      id="generatedBy"
                      className="form-select custom-select"
                      value={generatedBy}
                      onChange={e => setGeneratedBy(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                    </select>
                    <div className="select-arrow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="action-section">
            <button
              type="submit"
              className="btn btn-primary normal-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>Compiling Report...</span>
                </div>
              ) : (
                <>
                  <i className="bi bi-file-earmark-bar-graph me-2"></i>
                  Generate Report
                </>
              )}
            </button>
            {labData && (
              <button
                type="button"
                className="btn btn-success normal-button ml-3"
                onClick={downloadReport}
              >
                <i className="bi bi-download me-2"></i>
                Download PDF
              </button>
            )}
          </div>
        </form>
        {error && (
          <div className="alert alert-danger mt-3">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
