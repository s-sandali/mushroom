import api from './axiosInstance';

export const getBatches = async (params = {}) => {
  const response = await api.get('api/seeds', { params });
  return response.data;
};

export const createBatch = async (batchData) => {
  const response = await api.post('api/seeds/create', batchData);
  return response.data;
};

export const updateBatchProgress = async (id, updateData) => {
  const response = await api.put(`api/seeds/${id}/update`, updateData);
  return response.data;
};



export const getBatchesStats = async () => {
  const response = await api.get('api/seeds/stats');
  return response.data;
};

export const createDailyUpdate = async (updateData) => {
  const response = await api.post('api/daily-updates', updateData);
  return response.data;
};
