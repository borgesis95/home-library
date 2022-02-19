import mongoose from "mongoose";

export interface IAddress extends mongoose.Document {
  street: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
}

export const addressSchema = new mongoose.Schema<IAddress>({
  street: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

export const Address = mongoose.model<IAddress>("Address", addressSchema);
export default IAddress;
