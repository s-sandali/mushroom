import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const BRANCH_API_BASE_URL = `${API_BASE_URL}/api/branch`;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: BRANCH_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

class BranchService {
    getAllBranches() {
        console.log('BranchService: Attempting to fetch from:', BRANCH_API_BASE_URL);
        return axiosInstance.get('')
            .then(response => {
                console.log('BranchService: Success response:', response);
                return response;
            })
            .catch(error => {
                console.error('BranchService: Error details:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers
                    }
                });
                throw error;
            });
    }

    createBranch(branch) {
        return axiosInstance.post('', branch);
    }

    getBranchById(branchId) {
        return axiosInstance.get(`/${branchId}`);
    }

    updateBranch(branchId, branch) {
        return axiosInstance.put(`/${branchId}`, branch);
    }

    deleteBranch(branchId) {
        return axiosInstance.delete(`/${branchId}`);
    }
}

export default new BranchService(); 