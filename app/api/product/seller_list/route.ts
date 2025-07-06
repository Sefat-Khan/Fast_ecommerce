// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { connectDB } from "../../../../config/db";
// import authSeller from "../../../../lib/authSeller";
// import Product from "../../../../models/product";

// export async function GET(req) {
//   try {
//     const { userId } = getAuth(req);

//     const isSeller = authSeller(userId);

//     if (!isSeller) {
//       return NextResponse.json({
//         success: false,
//         message: "You are not a seller",
//       });
//     }

//     await connectDB();
//     const products = await Product.find();

//     return NextResponse.json({
//       success: true,
//       products,
//       message: "Products fetched successfully",
//     });
//   } catch (err) {
//     return NextResponse.json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// }
