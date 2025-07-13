import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Order from "../../../../models/order";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    console.log("Authenticated User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized user.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const orderData = await Order.find({ userId }).populate(
      "address items.product"
    );
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
