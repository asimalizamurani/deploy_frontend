import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({products}),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products/create", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (producdId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${producdId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => 
          product._id !== producdId), 
      loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (producdId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${producdId}`);
      // This will update the isFeatured prop of the product
      set((previousProduct) => ({
        products: previousProduct.products.map((product) => (
          product._id === producdId ? { ...product, isFeatured: response.data.isFeatured } 
          : product
        )),
        loading: false,
      }));
    } catch (error) {
      set({loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch featured products", loading: false });
      console.log("Error fetching featured products: ", error)
    }
  },

  updateProduct: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/update/${id}`, updatedData);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id ? res.data : product
        ),
        loading: false,
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  },
}))

export {
  useProductStore,
}