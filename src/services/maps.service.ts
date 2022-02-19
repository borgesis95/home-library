import IAddress from "../models/address.model";
import axios from "axios";

const geoCoding = async (address: IAddress) => {
  const url = `${process.env.NOMINATIM_MAPS_ENDPOINT}`;

  const params = {
    street: address.street,
    city: address.city,
    postalcode: address.postalCode,
  };

  const geoCodingResponse = await axios.get(url, { params });
  return geoCodingResponse.data;
};

export default {
  geoCoding,
};
