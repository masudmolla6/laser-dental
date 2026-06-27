import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

// ── axios instance ─────────────────────────────────────────────────────────
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ✅ REQUEST interceptor — useEffect এর বাইরে
// এটা একবারই set হয়, সবসময় token attach করে
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Hook ───────────────────────────────────────────────────────────────────
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  // ✅ RESPONSE interceptor — logout logic এখানে থাকা দরকার
  // কারণ navigate + logOut hook এর ভেতরে লাগে
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        console.warn("🚫 Unauthorized — logging out");
        try {
          await logOut();
        } catch (err) {
          console.error("Logout error:", err);
        }
        localStorage.removeItem("access-token");
        navigate("/login");
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;