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
      set({ checkingAuth: false, user: null})
    }
  },


}));

// TODO: Implement the axios interceptors for refreshing access token 15m


export {
  useUserStore,
}