import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import authSeller from "../../../../lib/authSeller";
import Address from "../../../../models/address";
import Order from "../../../../models/order";
import Product from "../../../../models/product";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    const isSeller = await authSeller(userId);

    if (isSeller) {
      await connectDB();

      Address.length;
      Product.length;

      const orders = await Order.find({}).populate("address items.product");
      return NextResponse.json({
        success: true,
        orders,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user!",
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetched order${err}`,
    });
  }
}
