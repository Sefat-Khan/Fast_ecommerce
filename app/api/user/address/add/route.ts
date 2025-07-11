import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../config/db";
import Address from "../../../../../models/address";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const { address } = await req.json();

    console.log("Received address:", address);

    if (address) {
      await connectDB();
      const newAddress = await Address.create({ ...address, userId });

      return NextResponse.json({
        success: true,
        newAddress,
        message: "Address added successfully",
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
      message: "Internal Server Error",
    });
  }
}
