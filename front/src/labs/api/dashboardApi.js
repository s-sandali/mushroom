import api from './axiosInstance';

// Get dashboard statistics
export const getDashboardStats = async () => {
  const statsResponse = await api.get('/api/seeds/stats');
  const lowStockResponse = await api.get('/api/inventory/low-stock');
  
  return {
    activeBatchCount: statsResponse.data.active,
    overallSuccessRate: statsResponse.data.successRate,
    lowStockItems: lowStockResponse.data,
    productionReadyCount: statsResponse.data.totalSuccess
  };
};

// Get contamination data with improved error handling
export const getContaminationData = async () => {
  try {
    const response = await api.get('/api/seeds/contamination-report');
    
    console.log('Raw contamination data from backend:', response.data); // Debug log
    
    // Check if response.data exists and is an array
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid contamination data format:', response.data);
      return {
        labels: [],
        values: []
      };
    }
    
    // Filter out items with zero contaminated batches if needed
    const validData = response.data.filter(stat => 
      stat && 
      stat.type && 
      stat.contaminatedBatches !== undefined && 
      stat.contaminatedBatches > 0 // Only show types with contamination
    );
    
    console.log('Filtered contamination data:', validData); // Debug log
    
    if (validData.length === 0) {
      return {
        labels: [],
        values: []
      };
    }
    
    return {
      labels: validData.map(stat => {
        // Handle enum conversion more safely
        const type = stat.type || 'UNKNOWN';
        return typeof type === 'string' ? type : type.toString();
      }),
      values: validData.map(stat => stat.contaminatedBatches || 0)
    };
  } catch (error) {
    console.error('Error fetching contamination data:', error);
    throw error;
  }
};
