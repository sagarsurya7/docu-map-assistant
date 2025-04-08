
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
    timeout: 30000, // Increased timeout for slower connections
    // Enable sending cookies with requests
    withCredentials: true
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
        
        // Ensure all response data expected to be arrays are arrays
        if (response.config.url?.includes('/doctors') && !Array.isArray(response.data)) {
            console.warn('Doctors API did not return an array, converting to array format');
            // Check if the data is in a nested property first
            if (response.data && typeof response.data === 'object' && Array.isArray(response.data.doctors)) {
                response.data = response.data.doctors;
            } else if (response.data && typeof response.data === 'object') {
                // If it's an object but not an array, convert to array with that item
                console.warn('Converting object to single-item array');
                response.data = [response.data];
            } else {
                // If not, set an empty array
                response.data = [];
            }
        }
        
        if (response.config.url?.includes('/symptoms') && !Array.isArray(response.data)) {
            console.warn('Symptoms API did not return an array, converting to array format');
            // Check if the data is in a nested property first
            if (response.data && typeof response.data === 'object' && Array.isArray(response.data.symptoms)) {
                response.data = response.data.symptoms;
            } else if (response.data && typeof response.data === 'object') {
                // If it's an object but not an array, convert to array with that item
                console.warn('Converting object to single-item array');
                response.data = [response.data];
            } else {
                // If not, set an empty array
                response.data = [];
            }
        }
        
        if (response.config.url?.includes('/doctors/filters') && response.data) {
            // Ensure filter options are always arrays
            const { specialties = [], cities = [], areas = [] } = response.data;
            response.data = {
                specialties: Array.isArray(specialties) ? specialties : [],
                cities: Array.isArray(cities) ? cities : [],
                areas: Array.isArray(areas) ? areas : []
            };
        }
        
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.warn('API Request was cancelled:', error.message);
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - this might be a CORS issue or backend connection:');
            console.error('- Check that the Vite proxy is properly configured');
            console.error('- Ensure your backend server is running on port 3001');
            console.error('- Check for CORS headers in your backend responses');
            console.error('- Full error:', error.message);
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - backend server might be slow or unresponsive');
        } else if (!error.response) {
            // Network error or server not running
            console.error('Network error or backend server not running. Please check that your backend server is running on port 3001.');
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
            console.log('Backend health data:', response.data);
        })
        .catch(error => {
            if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
                console.warn('⚠️ Connection issue detected. Make sure your backend server is running on port 3001.');
                console.warn('Check these common issues:');
                console.warn('- Backend server is actually listening on port 3001');
                console.warn('- No firewall blocking the connection');
                console.warn('- Backend has a /health endpoint');
                console.log('The app will function with fallback data if available.');
            } else {
                console.warn('⚠️ Could not connect to backend server:', error.message);
            }
        });
};

// Initial connection test
connectionTest();

// Re-test connection every 2 minutes
setInterval(connectionTest, 120000);

export default apiClient;
