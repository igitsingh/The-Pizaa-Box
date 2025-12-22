import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for SSO
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Clear user from Zustand store as well
            if (typeof window !== 'undefined') {
                const storage = localStorage.getItem('the-pizza-box-storage');
                if (storage) {
                    try {
                        const parsed = JSON.parse(storage);
                        parsed.state.user = null;
                        localStorage.setItem('the-pizza-box-storage', JSON.stringify(parsed));
                    } catch (e) {
                        console.error('Error clearing user from store:', e);
                    }
                }
            }
            // Only redirect if not already on login page to avoid loops
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
