import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import Product from "../../../../models/product";

export default async function GET() {
  try {
    await connectDB();
    const products = await Product.find();

    return NextResponse.json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
