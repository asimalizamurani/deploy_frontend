import { Product } from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find(item => item.id === productId);
    if(existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems)
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.query; // Get productId from query parameters
    const user = req.user; // Get user from authenticated request

    if (!productId) {
      // Clear entire cart if no productId is provided
      user.cartItems = [];
    } else {
      // Remove specific product from cart
      user.cartItems = user.cartItems.filter(
        (item) => item.id !== productId // Compare IDs properly
      );
    }

    await user.save(); // Save updated user data
    res.json(user.cartItems); // Respond with updated cart items
  } catch (error) {
    console.error("Error in removeAllFromCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateQuantity = async (req, res) => {
    try {
      const {id:productId} = req.params;
      const {quantity} = req.body;
      const user = req.user;
      const existingItem = user.cartItems.find((item) => item.id === productId);

      if(existingItem) {
        if(quantity === 0) {
          user.cartItems = user.cartItems.filter((item) => item.id !== productId);
          await user.save();
          return res.json(user.cartItems);
        }

        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log("Error in updateQuantity controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getCartProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.cartItems || req.user.cartItems.length === 0) {
      return res.status(200).json([]); // Send an empty cart if no items exist
    }

    // Fetch all products from the database that are in the user's cart
    const productIds = req.user.cartItems.map((item) => item.id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Map products with their quantities from the user's cart
    const cartItems = products.map((product) => {
      const cartItem = req.user.cartItems.find(
        (item) => item.id.toString() === product._id.toString()
      ); // Compare IDs as strings
      return { ...product.toObject(), quantity: cartItem.quantity };
    });

    // Send cart items back to the client
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error in getCartProducts controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
}