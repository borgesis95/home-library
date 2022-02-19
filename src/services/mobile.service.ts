import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import ApiTemplateResponse from "../utils/ApiTemplateResponse.util";
import CustomError from "../utils/CustomError.util";
import mapsService from "./maps.service";

/**
 * This method allow creation of new user with localization information (lat,long)
 */

const signUp = async (user: IUser) => {
  if (user.address) {
    const geocodingResponse = await mapsService.geoCoding(user.address);

    if (geocodingResponse.length > 0) {
      const newUser = {
        ...user,
        password: await bcrypt.hash(user.password, 10),
        address: {
          ...user.address,
          latitude: geocodingResponse[0].lat || 0,
          longitude: geocodingResponse[0].lon || 0,
        },
      };

      await User.create(newUser);
      return new ApiTemplateResponse(`${user.email} created`, 200);
    } else {
      throw new CustomError("Position not found", 500);
    }
  }

  throw new CustomError("Something wrong", 500);
};

export default {
  signUp,
};
