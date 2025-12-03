import axios, { AxiosError, CanceledError } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// 🔒 Global response interceptor for auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Optional: avoid infinite loop if already on landing/login
      if (window.location.pathname !== "/") {
        // If you have a dedicated login route, redirect there instead:
        // window.location.href = "/login";
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { CanceledError };