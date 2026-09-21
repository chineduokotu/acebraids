import axios from "axios";

export const AUTH_EXPIRED_EVENT = "ace:auth-expired";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiOrigin =
  configuredApiUrl ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://acebraids-api.onrender.com"); // Production Render backend
const apiBaseUrl = `${apiOrigin.replace(/\/$/, "")}/api`;

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthExpiration) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    // Never propagate Axios request/config objects: they can contain passwords.
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status,
      code: error.response?.data?.code,
      retryAfter:
        Number(error.response?.headers?.["retry-after"]) ||
        Number(error.response?.data?.retryAfter) ||
        0,
    };
    return Promise.reject(customError);
  },
);

export default axiosClient;
