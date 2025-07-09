import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../config/db";
import Address from "../../../../../models/address";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();
    const addressData = await Address.find({ userId });

    if (addressData) {
      return NextResponse.json({
        success: true,
        addressData,
        message: "Address fetched successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No address found for this user",
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
