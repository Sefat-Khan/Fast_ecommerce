import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Order from "../../../../models/order";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();

    console.log(`Fetching orders for user: ${userId}`); // Debug log

    const orderData = await Order.find({ userId })
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .lean(); // Convert to plain JavaScript objects

    console.log(`Found ${orderData.length} orders`);

    return NextResponse.json({
      success: true,
      orderData,
      message: "Order fetched successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetched order${err}`,
    });
  }
}
