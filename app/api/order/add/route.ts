import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "../../../../config/inngest";
import Order from "../../../../models/order"; // Import your Order model
import Product from "../../../../models/product";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { address, items } = await req.json();

    if (!userId || !address || !items || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: userId, address, or items",
      });
    }

    // Fetch prices and compute total amount
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...item,
          price: product.price,
          total: product.price * item.quantity,
        };
      })
    );

    const amount = itemDetails.reduce((sum, item) => sum + item.total, 0);
    const finalAmount = amount + Math.floor(amount * 0.02); // 2% tax

    // Save order to DB
    const newOrder = new Order({
      userId,
      address,
      items: itemDetails,
      amount: finalAmount,
    });
    await newOrder.save();

    // Clear user's cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    // Fire the event
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items: itemDetails,
        amount: finalAmount,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error " + err.message,
    });
  }
}
