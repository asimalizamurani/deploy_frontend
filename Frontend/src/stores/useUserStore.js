import { create } from "zustand";
import {toast} from "react-hot-toast"
import axios from "../lib/axios";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({name, email, password, confirmPassword}) => {
    set({ loading: true });

    if (!name || !email || !password || !confirmPassword) {
      set({ loading: false });
      return toast.error("All fields are required");
    }

    if(password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password })
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
  login: async ( email, password ) => {
    set({ loading: true });

    if ( !email || !password ) {
      set({ loading: false });
      return toast.error("All fields are required");
    }

    try {
      const res = await axios.post("/auth/login", { email, password })
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false })
    }
  },

  // refreshToken: async () => {
  //   try {
  //     const response = await axios.post("/auth/refresh-token");
  //     set({ user: response.data });
  //     return response.data;
  //   } catch (error) {
  //     set({ user: null });
  //     throw error;
  //   }
  // },


}));

// TODO: Implement the axios interceptors for refreshing access token 15m


// Axios interceptor for token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // if a refresh is already in progress, wait for it to complete
//         if (refreshPromise) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         // start a new refresh process
//         refreshPromise = useUserStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to Login or handle as needed
//         useUserStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Periodic token refresh every 15 minutes
// setInterval(() => {
//   useUserStore.getState().refreshToken().catch((error) => {
//     console.error("Failed to refresh token:", error);
//   });
// }, 15 * 60 * 1000); // 15 minutes in milliseconds


export {
  useUserStore,
}