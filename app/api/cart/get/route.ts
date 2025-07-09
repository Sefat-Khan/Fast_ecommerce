import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import User from "../../../../models/user";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();

    const user = await User.findById({ _id: userId });

    const cartItems = user.cartItems;

    return NextResponse.json({
      success: true,
      cartItems,
      message: "Cart updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Failed to update cart",
    });
  }
}
