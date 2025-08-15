import { API_BASE_URL } from '../config/api.js';

// Auth Service
export const authService = {
    // Sign up a new user or seller
    signup: async (userData, role = 'user') => {
        try {
            console.log('🚀 Attempting signup...');
            console.log('📍 API URL:', `${API_BASE_URL}/auth/signup?role=${role}`);
            console.log('📦 User data:', userData);
            console.log('👤 Role:', role);

            const response = await fetch(`${API_BASE_URL}/auth/signup?role=${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            console.log('📡 Response status:', response.status);
            console.log('✅ Response ok:', response.ok);
            console.log('🌐 Response headers:', [...response.headers.entries()]);

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.log('📄 Non-JSON response:', text);
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            console.log('📋 Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('❌ Signup error details:', error);
            console.error('🔍 Error name:', error.name);
            console.error('💬 Error message:', error.message);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error - Unable to connect to server. Please check your internet connection.');
            }

            throw error;
        }
    },

    // Login existing user or seller
    login: async (credentials, role = 'user') => {
        try {
            console.log('🚀 Attempting login...');
            console.log('📍 API URL:', `${API_BASE_URL}/auth/login?role=${role}`);
            console.log('🔑 Credentials:', { username: credentials.username, password: '***' });
            console.log('👤 Role:', role);

            const response = await fetch(`${API_BASE_URL}/auth/login?role=${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });

            console.log('📡 Response status:', response.status);
            console.log('✅ Response ok:', response.ok);
            console.log('🌐 Response headers:', [...response.headers.entries()]);

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.log('📄 Non-JSON response:', text);
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            console.log('📋 Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('❌ Login error details:', error);
            console.error('🔍 Error name:', error.name);
            console.error('💬 Error message:', error.message);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error - Unable to connect to server. Please check your internet connection.');
            }

            throw error;
        }
    },

    // Logout current user
    logout: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }

            return data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Change password
    changePassword: async (passwordData, role = 'user') => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password?role=${role}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password change failed');
            }

            return data;
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    },

    // Change email
    changeEmail: async (emailData, role = 'user') => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-email?role=${role}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(emailData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Email change failed');
            }

            return data;
        } catch (error) {
            console.error('Email change error:', error);
            throw error;
        }
    },

    // Get current user info
    getCurrentUser: async () => {
        try {
            console.log('🔍 authService: Getting current user...');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log('🔍 authService: getCurrentUser response status:', response.status);

            if (response.status === 401) {
                // User is not authenticated
                console.log('🔍 authService: User not authenticated (401)');
                return null;
            }

            const data = await response.json();
            console.log('🔍 authService: getCurrentUser response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get current user');
            }

            const userData = data.data || data;
            console.log('🔍 authService: Returning user data:', userData);
            return userData;
        } catch (error) {
            console.error('🔍 authService: Get current user error:', error);
            // Return null instead of throwing error to handle unauthenticated state gracefully
            return null;
        }
    }
};

export default authService;
