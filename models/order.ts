import mongoose, { Document, Model } from "mongoose";

interface IOrderItem {
  product: string;
  quantity: number;
}

interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  amount: number;
  address: mongoose.Schema.Types.ObjectId;
  status: string;
  date: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  userId: { type: String, required: true },
  items: [
    {
      product: { type: String, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Address",
  },
  status: { type: String, required: true, default: "pending" },
  date: { type: Date, default: Date.now },
});

type OrderModel = Model<IOrder>;

const Order: OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
