import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api/simulacion"

export const postSimulationData = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL, data)
    return response.data
  } catch (error) {
    console.error("Error posting simulation data:", error)
    throw error
  }
}

export const getSimulationResults = async () => {
  try {
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching simulation results:", error)
    throw error
  }
}
