import bcrypt from "bcrypt";
import { Error } from "mongoose";
import { BookInfo } from "../../client/src/interface/Book";
import Book, { IBook } from "../models/book.model";
import User, { IUser } from "../models/user.model";
import ApiTemplateResponse from "../utils/ApiTemplateResponse.util";
import CustomError from "../utils/CustomError.util";
import { calculateDistance, mapBookFromService } from "../utils/utils";
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

const addBook = async (book: IBook, userId: string) => {
  try {
    const newBook = {
      ...book,
      userId: userId,
      /*For mobile will not be chance to choose shelf/library */
      shelfId: null,
      borrowPerson: "Pluto",
    };
    await Book.create(newBook);
    return new ApiTemplateResponse(`${book.title} has been added`, 200);
  } catch (error: any) {
    throw new CustomError(error.message, 500);
  }
};

const updateBook = async (book: IBook) => {
  await Book.findByIdAndUpdate({ _id: book._id }, book);

  return new ApiTemplateResponse(`Book has been updated`, 200);
};

const deleteBook = async (bookId: string) => {
  const bookDeleted = await Book.findByIdAndRemove(bookId);
  return new ApiTemplateResponse(`${bookDeleted?.title} has been deleted`, 500);
};

const getUsersCloseToMe = async (
  latitude: number,
  longitude: number,
  radius = 0.5,
  userId: string
) => {
  const users = await User.find();
  const response = [];

  for (let i = 0; i < users.length; i++) {
    if (
      users[i].id !== userId &&
      calculateDistance(
        latitude,
        longitude,
        users[i].address?.latitude || -1,
        users[i].address?.longitude || -1,
        "K"
      ) <= radius
    ) {
      response.push({
        id: users[i].id,
        username: users[i].email,
        name: users[i].name,
        latitude: users[i].address?.latitude,
        longitude: users[i].address?.longitude,
        street: users[i].address?.street,
      });
    }
  }

  return response;
};

export default {
  signUp,
  getBookFromService,
  addBook,
  deleteBook,
  updateBook,
  getUsersCloseToMe,
};
