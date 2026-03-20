// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility functions for API calls
async function apiCall(
  endpoint,
  method = 'GET',
  data
) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    throw error;
  }
}
