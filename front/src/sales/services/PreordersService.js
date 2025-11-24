import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/preorders';

export const listPreorders = () => axios.get(REST_API_BASE_URL);

export const createPreorder = (Preorder) => axios.post(REST_API_BASE_URL, Preorder);

export const getPreorder = (PreordersID) => axios.get(REST_API_BASE_URL + '/'+ PreordersID);

export const updatePreorder = (PreordersID, Preorders) => axios.put(REST_API_BASE_URL+ '/'+ PreordersID, Preorders);

export const deletePreorder = (PreordersID) => axios.delete(REST_API_BASE_URL + '/' + PreordersID);