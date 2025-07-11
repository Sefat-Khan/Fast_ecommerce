import mongoose, { Document, Model } from "mongoose";

interface IOrder extends Document {
  userId: string;
  items: [];
  amount: number;
  address: string;
  status: string;
  date: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  userId: { type: String, required: true },
  items: [
    {
      product: { type: String, require: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: String, required: true, ref: "address" },
  status: { type: String, required: true, default: "pending" },
  date: { type: Date },
});

type OrderModel = Model<IOrder>;

const Order: OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
