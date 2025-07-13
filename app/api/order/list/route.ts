import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Order from "../../../../models/order";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    console.log("Authenticated User ID:", userId);

    await connectDB();

    const orders = await Order.find({ userId });
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetched order${err}`,
    });
  }
}
