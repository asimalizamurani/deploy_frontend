import { Order } from "../models/order.model.js";

const createOrder = async (req, res) => {
  try {
    const { products, address, totalAmount } = req.body;
    const order = new Order({
      user: req.user._id,
      products,
      address,
      totalAmount,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
}

export { createOrder, getOrders };