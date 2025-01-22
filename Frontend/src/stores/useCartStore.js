import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error getching coupon: ", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals(); // Recalculate totals after applying coupon
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals(); // Recalculate totals after removing coupon
    toast.success("Coupon removed successfully");
  },

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data || [] }); // Update the cart state
      get().calculateTotals(); // Recalculate totals after setting cart
    } catch (error) {
      console.error("Failed to fetch cart items:", error.message);
      set({ cart: [] });
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  
  
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      console.log("Product added to cart successfully bro"); // testing purpose

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );

        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        console.log("Updated Cart:", newCart); // testing purpose
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      console.error("Error adding to cart:", error); // testing purpose
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      // Make API call to delete item
      // await axios.delete(`/cart`, { data: { productId } });
      await axios.delete(`/cart?productId=${productId}`);
      // Update state safely
      set((prevState) => ({
        cart: Array.isArray(prevState.cart)
          ? prevState.cart.filter((item) => item._id !== productId)
          : [], // Fallback to an empty array
      }));
      get().calculateTotals();
      toast.success("Product removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error); // Debugging
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },

  updateQuantity: async (productId, quantity) => {
  if(quantity === 0) {
    get().removeFromCart(productId);
    return
  }

  await axios.put(`/cart/${productId}`, { quantity });
  set((prevState) =>  ({
    cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
  }));
  get().calculateTotals();
  },
  
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));

export { useCartStore };
