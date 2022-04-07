import { Types } from "mongoose";
import User from "../models/user.model";
import ApiTemplateResponse from "../utils/ApiTemplateResponse.util";

const saveFcmToken = async (userId: string, token: string) => {
  await User.updateOne(
    { _id: new Types.ObjectId(userId) },
    { $addToSet: { fcmToken: token } }
  );
  return new ApiTemplateResponse("Token has been saved", 200);
};

const deleteFcmToken = async (userId: string, token: string) => {
  await User.updateOne({ _id: userId }, { $pull: { fcmToken: token } });
  return new ApiTemplateResponse("Token has been deleted", 200);
};

export default {
  saveFcmToken,
  deleteFcmToken,
};
