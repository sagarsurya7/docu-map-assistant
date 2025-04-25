
import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
    // Use a relative URL to leverage the Vite proxy
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Add a timeout to prevent hanging requests
    timeout: 15000, // Increased timeout for slower connections
    // Enable sending cookies with requests
    withCredentials: false
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling and data sanitization
apiClient.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} from ${response.config.url}`);
        console.log('Response data:', JSON.stringify(response.data).substring(0, 200) + "...");
        
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.warn('API Request was cancelled:', error.message);
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - this might be a CORS issue or backend connection:');
            console.error('- Check that the Vite proxy is properly configured');
            console.error('- Ensure your backend server is running on port 3001');
            console.error('- Full error:', error.message);
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - backend server might be slow or unresponsive');
        } else if (!error.response) {
            // Network error or server not running
            console.error('Network error or backend server not running.');
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
const connectionTest = () => {
    apiClient.get('/health')
        .then((response) => {
            console.log('✅ Backend server connection successful');
            console.log('Health response:', response.data);
        })
        .catch(error => {
            if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
                console.warn('⚠️ Connection issue detected. Make sure your backend server is running.');
                console.warn('The app will function with fallback data if available.');
            } else {
                console.warn('⚠️ Could not connect to backend server:', error.message);
            }
        });
};

// Initial connection test
connectionTest();

// Re-test connection periodically 
setInterval(connectionTest, 60000); // Check every minute

export default apiClient;
