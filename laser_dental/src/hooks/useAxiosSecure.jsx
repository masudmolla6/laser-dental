import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

// 🔥 axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {

  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {

    // ✅ REQUEST INTERCEPTOR
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");

        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ RESPONSE INTERCEPTOR
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {

        if (error.response?.status === 401 || error.response?.status===403) {
          console.log("🚫 Unauthorized → logging out");

          try {
            // 🔥 Firebase logout
            await logOut();
          } catch (err) {
            console.error("Logout error:", err);
          }

          // 🔥 remove token
          localStorage.removeItem("access-token");

          // ✅ React way redirect
          // navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // 🧹 CLEANUP
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };

  }, [logOut, navigate]); // ✅ dependency add

  return axiosSecure;
};

export default useAxiosSecure;