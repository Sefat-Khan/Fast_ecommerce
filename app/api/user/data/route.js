import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import User from "../../../../models/user";

export async function GET(req) {
  try {
    console.log("GET /api/user/data hit");
    const { userId } = getAuth(req);

    await connectDB();
    const userData = await User.findById(userId);

    if (!userData) {
      return NextResponse.json({ success: false, message: "user not found!" });
    }

    return NextResponse.json({ success: true, userData });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    const data = await req.json();

    await connectDB();
    const userData = await User.findByIdAndUpdate(userId, data, { new: true });

    if (!userData) {
      return NextResponse.json({
        success: false,
        message: "User not updated found!",
      });
    }

    return NextResponse.json({ success: true, userData });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
