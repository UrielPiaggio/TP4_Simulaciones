import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/sim';


export const postSimulationData = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error posting simulation data:', error);
    throw error;
  }
}