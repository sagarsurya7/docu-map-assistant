
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

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || {});
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.warn('API Request was cancelled:', error.message);
        } else if (!error.response) {
            // Network error or server not running
            console.error('Network error or backend server not running. Please start the backend server on port 3001.');
            console.error('API Error Details:', {
                message: error.message,
                code: error.code,
                stack: error.stack,
            });
        } else {
            // Server responded with an error
            console.error('API Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config.url,
                method: error.config.method
            });
        }
        return Promise.reject(error);
    }
);

// Test the connection to the backend when the module loads
console.log('Testing connection to backend server...');
apiClient.get('/health')
    .then(() => console.log('✅ Backend server connection successful'))
    .catch(error => console.warn('⚠️ Could not connect to backend server:', error.message));

export default apiClient;
