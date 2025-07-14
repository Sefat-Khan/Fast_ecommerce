import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Address from "../../../../models/address";
import Order from "../../../../models/order";
import Product from "../../../../models/product";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    console.log("Authenticated User ID:", userId);

    await connectDB();

    Address.length;
    Product.length;

    const orders = await Order.find({ userId }).populate(
      "address items.product"
    );
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
