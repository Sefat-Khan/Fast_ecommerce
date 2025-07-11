import mongoose, { Document, Model } from "mongoose";

interface IAddress extends Document {
  userId: string;
  fullName: string;
  phoneNumber: string;
  pinCode: string;
  area: string;
  city: string;
  state: string;
}

const addressSchema = new mongoose.Schema<IAddress>({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  pinCode: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

type AddressModel = Model<IAddress>;

const Address: AddressModel =
  mongoose.models.Address || mongoose.model<IAddress>("Address", addressSchema);

export default Address;
