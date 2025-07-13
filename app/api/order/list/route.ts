import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Order from "../../../../models/order";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();

    const orderData = await Order.findById({ userId: userId });

    return NextResponse.json({
      success: true,
      orderData,
      message: "Order fetched successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetched order",
    });
  }
}
