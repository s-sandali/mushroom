import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/Sold';

export const listSales = () => axios.get(REST_API_BASE_URL);

export const createSale = (sale) => axios.post(REST_API_BASE_URL, sale);

export const getSale = (salesID) => axios.get(REST_API_BASE_URL + '/'+ salesID);

export const updateSale = (salesID, sales) => axios.put(REST_API_BASE_URL+ '/'+ salesID, sales);

export const deleteSale = (salesID) => axios.delete(REST_API_BASE_URL + '/' + salesID);
