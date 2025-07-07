import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../config/db";
import authSeller from "../../../../../lib/authSeller";
import Product from "../../../../../models/product";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    const isSeller = authSeller(userId);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!isSeller) {
      return NextResponse.json({
        success: false,
        message: "You are not a seller",
      });
    }

    await connectDB();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    return NextResponse.json({
      success: true,
      product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    const formData = await req.formData();
    const productId = formData.get("id");

    await connectDB();
    const productData = await Product.findOne({
      _id: productId,
      userId: userId,
    });

    if (!productData) {
      return NextResponse.json({
        success: false,
        message: "Product not found!",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      formData,
      {
        new: true,
      }
    );

    return NextResponse.json({
      success: true,
      updatedProduct,
      message: "Product updated successfully!",
    });
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
    const { productId } = await req.json();

    await connectDB();

    // Verify the product belongs to this seller before deleting
    const product = await Product.findOne({ _id: productId, seller: userId });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found or you don't have permission to delete it",
      });
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
