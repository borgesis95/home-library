import bcrypt from "bcrypt";
import { BookInfo } from "../../client/src/interface/Book";
import Book, { IBook } from "../models/book.model";
import User, { IUser } from "../models/user.model";
import ApiTemplateResponse from "../utils/ApiTemplateResponse.util";
import CustomError from "../utils/CustomError.util";
import { mapBookFromService } from "../utils/utils";
import bookService from "./book.service";
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

const getBookFromService = async (isbn: string | number) => {
  const book: BookInfo[] = await bookService.getBookInfo(isbn);
  return mapBookFromService(book[0]);
};

const addBook = async (book: IBook) => {
  const newBook = {
    ...book,
    userId: null,
    shelfId: book.shelfId === "" ? null : book.shelfId,
  };

  const bookCreated = await Book.create(newBook);

  return new ApiTemplateResponse(`${book.title} has been added`, 200);
};
export default {
  signUp,
  getBookFromService,
  addBook,
};
