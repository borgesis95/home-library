import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import IAddress, { addressSchema } from "./address.model";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  comparePassword(pwd: string): Promise<boolean>;
  address?: IAddress;
  /**
   * Save token generated from device , useful for send push
   * notifications
   */
  fcmToken?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },

  address: {
    type: addressSchema,
    required: false,
  },

  fcmToken: {
    type: [String],
  },
});

// With mongoose we have the chance to instance custom methods

/**
 * Check if the password typed from user is equal to the pwd
 * saved on database
 * @param password
 * @returns
 */
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
