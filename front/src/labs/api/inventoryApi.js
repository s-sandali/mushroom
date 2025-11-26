// inventoryApi.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/inventory`,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
});

export const getInventoryItems = () => API.get('').then(res => res.data)
export const addInventoryItem = async (item) => {
  const response = await API.post('', item);
  return response.data; 
}; 
export const updateInventoryItem = (id, data) => API.put(`/${id}`, data);
export const deleteInventoryItem = (id) => API.delete(`/${id}`);
export const getLowStockAlerts = () => API.get('/low-stock');
export const requestMaterials = (data) => API.post('/material-requests', data);
export const getMaterialRequests = () => API.get('/material-requests');
