import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  _id: string; // Changed from 'id' to '_id' to match your usage
  name: string;
  email: string;
  imageUrl: string;
  cartItems: Record<string, unknown>;
}

const userSchema =
  new mongoose.Schema() <
  IUser >
  {
    _id: {
      // Changed from 'id' to '_id'
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    cartItems: {
      type: Object,
      default: {},
    },
  };

const User =
  mongoose.models.User || mongoose.model < IUser > ("User", userSchema);

export default User;
