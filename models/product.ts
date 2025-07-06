import mongoose, { Document, Model } from "mongoose";

interface IProduct extends Document {
  userId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  color: string[];
  offerPrice?: number;
  images: string[];
  date: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: [String], required: true },
  offerPrice: { type: Number },
  images: { type: [String], required: true },
  date: { type: Date },
});

type ProductModel = Model<IProduct>;

const Product: ProductModel =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
