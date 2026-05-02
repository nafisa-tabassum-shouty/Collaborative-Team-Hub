import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Send httpOnly cookies with every request
});

// Response interceptor: handle 401 globally (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh also fails, BUT only if we aren't already on a public page
        // to avoid infinite reload loops
        if (typeof window !== "undefined") {
          const publicPaths = ["/login", "/register"];
          const isPublic = publicPaths.includes(window.location.pathname);
          
          // Only hard redirect if not on a public page
          if (!isPublic) {
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
