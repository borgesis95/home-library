import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import CustomError from "../utils/CustomError.util";
import mapsService from "./maps.service";

/**
 * This method allow creation of new user with localization information (lat,long)
 */

const signUp = async (user: IUser) => {
  if (user.address) {
    const geocodingResponse = await mapsService.geoCoding(user.address);

    const newUser = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
      address: {
        ...user.address,
        latitude: geocodingResponse[0].lat,
        longitude: geocodingResponse[0].lon,
      },
    };

    return User.create(newUser);
  }

  return new CustomError("Something wrong", 500);
};

export default {
  signUp,
};
