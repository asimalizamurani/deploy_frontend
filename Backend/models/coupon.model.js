import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code must be provided"],
      unique: true,
      upercase: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "Coupon percentage must be provided"],
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date must be provided"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User must be provided"],
      unique: true,
    }
  },
  {timestamps: true}
)

export const Coupon = mongoose.model("Coupon", couponSchema)