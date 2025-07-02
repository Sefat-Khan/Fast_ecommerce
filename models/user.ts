import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  cartItems: Record<string, unknown>;
}

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  cartItems: { type: Object, default: {} },
});

type UserModel = Model<IUser>;

const User: UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
