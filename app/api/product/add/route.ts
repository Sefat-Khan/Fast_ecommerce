import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../config/db";
import authSeller from "../../../../lib/authSeller";
import Product from "../../../../models/product";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({
        success: false,
        message: "Not authorized",
      });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const color = formData.getAll("color");
    const offerPrice = formData.get("offerPrice");
    const files = formData.getAll("images").filter((file) => {
      if (typeof file === "object" && "size" in file) {
        return file.size > 0;
      }
      return false;
    });

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid images provided",
      });
    }

    // Upload images to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!);
            }
          }
        );
        stream.end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const image = results.map((res) => res.secure_url);

    await connectDB();
    const newProduct = await Product.create({
      userId,
      name,
      description,
      price: Number(price),
      category,
      color: Array.isArray(color) ? color : [color],
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      image,
      date: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Error adding product ${err}`,
    });
  }
}
