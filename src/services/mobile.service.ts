/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { BookInfo } from "../../client/src/interface/Book";
import Book, { BookState, BookStateEnum, IBook } from "../models/book.model";
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
    const newBook: IBook = {
      ...book,
      //@ts-ignore
      userId: userId,
      /*For mobile will not be chance to choose shelf/library */
      shelfId: null,
      borrowPerson: "Pluto",
      bookState: {
        // Initialy when book is added is available
        state: BookStateEnum.FREE,
        from: null,
        to: null,
        note: null,
        requestingUserId: null,
      },
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

const updateBookState = async (
  bookId: string,
  userId: string,
  body: BookState | null,
  bookState: BookStateEnum
) => {
  const userObjectId = new Types.ObjectId(userId);
  const bookObjectId = new Types.ObjectId(bookId);

  if (body) {
    await Book.updateOne(
      { _id: bookId },
      {
        $set: {
          bookState: {
            state: bookState,
            requestingUserId: userObjectId,
            phoneNumber: body.phoneNumber,
            note: body.note,
            from: body.from,
            to: body.to,
          },
        },
      }
    );
  } else {
    await Book.updateOne(
      { _id: bookId },
      { $set: { "bookState.state": bookState } }
    );
  }

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

export const getUsersBook = async (
  userId: string,
  bookInfoState: BookStateEnum
) => {
  const userObjectId = new Types.ObjectId(userId);

  if (bookInfoState == BookStateEnum.ALL) {
    const filtersAll = [
      {
        $match: {
          userId: userObjectId,
        },
      },
      {
        $project: {
          isbn: 1,
          title: 1,
          authors: 1,
          thumbnail: 1,
          description: 1,
          state: "$bookState.state",
        },
      },
    ];
    return await Book.aggregate(filtersAll);
  }

  return await Book.find({
    userId: userObjectId,
    "bookState.state": bookInfoState,
  });
};

export const getBorrowedBooksList = async (
  userId: string,
  bookInfoState: BookStateEnum
) => {
  const userObjectId = new Types.ObjectId(userId);

  return await Book.find({
    "bookState.state": bookInfoState,
    "bookState.requestingUserId": userObjectId,
  });
};

export const requestedBookDetail = async (bookId: string) => {
  const bookObjectId = new Types.ObjectId(bookId);

  const filter = [
    {
      $match: {
        _id: bookObjectId,
      },
    },
    {
      $unwind: {
        path: "$bookState.requestingUserId",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "bookState.requestingUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        id: 1,
        isbn: 1,
        title: 1,
        thumbnail: 1,
        requestedBy: "$user.email",
        phoneNumber: "$bookState.phoneNumber",
        from: "$bookState.from",
        to: "$bookState.to",
      },
    },
  ];

  const bookDetail = await Book.aggregate(filter);

  if (bookDetail && bookDetail[0]) {
    return bookDetail[0];
  }

  return null;
};

export const requestedBookList = async (userId: string) => {
  const objectUserId = new Types.ObjectId(userId);

  const filter = [
    {
      $match: {
        "bookState.state": 1,
        "bookState.requestingUserId": objectUserId,
      },
    },
  ];

  return await Book.aggregate(filter);
};

export default {
  signUp,
  getBookFromService,
  addBook,
  deleteBook,
  updateBook,
  getUsersBook,
  updateBookState,
  getUsersCloseToMe,
  requestedBookDetail,
  requestedBookList,
  getBorrowedBooksList,
};
