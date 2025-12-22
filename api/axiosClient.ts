import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1.0", // Backend Java
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý token hoặc lỗi (nếu có)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;
