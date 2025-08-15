// API Configuration
const config = {
    development: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    },
    production: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-app-fpo8.onrender.com/api'
    }
};

// Determine environment - Vite uses import.meta.env
const environment = import.meta.env.MODE || 'development';

// Export the appropriate config
export const API_CONFIG = config[environment];

// For backward compatibility, export the API_BASE_URL directly
export const API_BASE_URL = API_CONFIG.API_BASE_URL;

export default API_CONFIG;
