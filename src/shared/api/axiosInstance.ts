import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://your-base-url.com", // <-- change this
    timeout: 15000,
});

// Automatically attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh or global errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Example: Token expired
        if (error.response?.status === 401) {
            console.log("Token expired — handle refresh here.");

        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
