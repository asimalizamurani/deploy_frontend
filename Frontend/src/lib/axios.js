import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" 
    ? "http://localhost:5000/api/" 
    : "/api/",
  withCredentials: true, // Send the cookies to the server
});

export default axiosInstance;
