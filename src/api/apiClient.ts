
import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Add a timeout to prevent hanging requests
    timeout: 10000,
    // Enable sending cookies with requests
    withCredentials: false
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
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - this might be a CORS issue:');
            console.error(`- Check that your backend at ${apiClient.defaults.baseURL} has CORS enabled`);
            console.error('- Ensure your backend includes the header: Access-Control-Allow-Origin: http://localhost:8080');
            console.error('- Full error:', error.message);
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
    .catch(error => {
        if (error.code === 'ERR_NETWORK') {
            console.warn('⚠️ CORS issue detected when connecting to backend server. Make sure your backend has CORS enabled.');
        } else {
            console.warn('⚠️ Could not connect to backend server:', error.message);
        }
    });

export default apiClient;
