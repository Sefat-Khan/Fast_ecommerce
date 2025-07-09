import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const { cartData } = await req.json();

    await connectDB();

    const user = await User.findById({ _id: userId });

    user.cartItems = cartData;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Failed to update cart",
    });
  }
}
