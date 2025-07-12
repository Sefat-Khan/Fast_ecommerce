import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { inngest } from "../../../../config/inngest";
import Product from "../../../../models/product";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const { address, items } = await req.json();

    if (address && items.length > 0) {
      const amount = items.reduce(async (total, item) => {
        const product = await Product.findById(item.product || item.productId);
        return total + product.price * item.quantity;
      }, 0);

      await inngest.send({
        name: "order/created",
        data: {
          userId,
          address,
          items,
          amount: amount + Math.floor(0.02 * amount), // adding 2% as a fee
        },
      });

      // Clear the cart after order creation
      const user = await User.findById(userId);
      user.cartItems = {};
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Order created successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Address data is missing",
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error " + err.message,
    });
  }
}
