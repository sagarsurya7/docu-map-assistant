
import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
    },
    // Add a timeout to prevent hanging requests
    timeout: 10000
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (!error.response) {
            // Network error or server not running
            console.error('Network error or backend server not running. Please start the backend server on port 3001.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
