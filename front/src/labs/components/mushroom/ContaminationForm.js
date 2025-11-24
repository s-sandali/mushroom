import React from 'react';

const ContaminationForm = ({ formData, setFormData }) => {
  return (
    <div className="mt-4 p-3 border rounded bg-light">
      <h6 className="mb-3">Contamination Details</h6>
      
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Contamination Reason *</label>
          <select
            className="form-select"
            value={formData.contaminationReason}
            onChange={(e) => setFormData({...formData, contaminationReason: e.target.value})}
            required
          >
            <option value="">Select a reason</option>
            <option value="MOLD">Mold</option>
            <option value="BACTERIA">Bacteria</option>
            <option value="TEMPERATURE">Temperature Issue</option>
            <option value="HUMIDITY">Humidity Issue</option>
            <option value="PESTS">Pests/Insects</option>
            <option value="HANDLING">Improper Handling</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContaminationForm;
