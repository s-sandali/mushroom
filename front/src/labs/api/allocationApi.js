import api from './axiosInstance';

export const createAllocation = async (allocationData) => {
  const response = await api.post('api/allocations', allocationData);
  return response.data;
};

export const getAllocations = async () => {
  const response = await api.get('api/allocations');
  return response.data;
};

export const getBatches = async () => {
  const response = await api.get('/api/seeds');
  return response.data;
};