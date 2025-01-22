import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        }
      }
    ],

    address: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending"
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  {timestamps: true}
)


export const Order = mongoose.model("Order", orderSchema);