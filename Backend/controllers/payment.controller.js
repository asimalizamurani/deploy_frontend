import { Coupon } from "../models/coupon.model.js";
import {stripe} from "../lib/stripe.js";

const createCheckoutSession = async (req, res) => {
  async (req, res) => {
    try {
      const {products, couponCode} = req.body;
  
      if(!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Invalid or empty products array" })
      }
  
      let totalAmount = 0;
  
      const lineItems = products.map(product => {
        const amount = product.price * 100 // stripe wants you to send in the format of cents
        totalAmount += amount * product.quantity;
  
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.image], // [product.images] can be like this i think so
            },
            unit_amount: amount
          }
        }
      });
  
      let coupon = null;
  
      if(couponCode) {
        coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
        if(coupon) {
          totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
        }
      }
  
      // Create a session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}http://localhost;3000/purchase-cancel`,
        discounts: coupon
        ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
        : [],
        metadata: {
          userId: req.user._id.toString(),
          couponCode: couponCode || ""
        }
  
      });
  
      if(totalAmount >= 20000) {
        await createNewCoupon(req.user._id)
      }
      res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
      
    }
  }
}

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  })

  return coupon.id;
}

async function createNewCoupon(userId) {
  const newCoupon =new Coupon({
    code:"GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId
  })
  await newCoupon.save();

  return newCoupon;
}

export { createCheckoutSession}