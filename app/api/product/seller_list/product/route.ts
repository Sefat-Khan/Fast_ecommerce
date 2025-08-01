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
    const isSeller = authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({
        success: false,
        message: "You are not authorized to update products",
      });
    }

    const formData = await req.formData();

    const productId = formData.get("id");

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      });
    }
    console.log("Updating product ID:", productId);

    const existingProduct = await Product.findOne({
      _id: productId,
      userId: userId,
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: "Product not found or you don't have permission to update it",
      });
    }

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const colors = formData.getAll("color");

    const images = formData.getAll("images");

    await connectDB();

    const updateData = {
      name,
      description,
      category,
      price,
      offerPrice,
      colors,
      images: images.length > 0 ? images : undefined,
    };

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        message: "Product not found!",
      });
    }

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
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      });
    }

    await connectDB();

    // Verify the product belongs to this seller before deleting
    const product = await Product.findOne({ _id: productId, userId: userId });

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
