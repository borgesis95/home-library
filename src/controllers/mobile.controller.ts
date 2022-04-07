import express, { NextFunction } from "express";
import { BookStateEnum } from "../models/book.model";
import bookService from "../services/book.service";
import mobileService from "../services/mobile.service";

export const getBookInfoFromService = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const isbn = req.params.isbn;
    const book = await mobileService.getBookFromService(isbn);
    response.send(book);
  } catch (error) {
    next(error);
  }
};
export const getBooks = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;
    const bookState = parseInt(req.query.state as string) || BookStateEnum.FREE;

    const books = await mobileService.getUsersBook(user._id, bookState);
    response.send(books);
  } catch (error) {
    next(error);
  }
};

export const getUserBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const userId = req.params.userId;
    const bookState = parseInt(req.query.state as string) || BookStateEnum.FREE;
    const userBooks = await mobileService.getUsersBook(userId, bookState);
    response.send(userBooks);
  } catch (error) {
    next(error);
  }
};

/**
 * Libri presi in prestito da qualcuno
 * @param req
 * @param response
 * @param next
 */
export const getBorrowedBooksList = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;
    const userBooks = await mobileService.getBorrowedBooksList(
      user._id,
      BookStateEnum.LOANED
    );
    response.send(userBooks);
  } catch (error) {
    next(error);
  }
};
export const addBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookBody = req.body;
    const { user } = req.locals;

    const book = await mobileService.addBook(bookBody, user._id);
    response.send(book);
  } catch (error) {
    next(error);
  }
};

export const updatebook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookBody = req.body;

    const updateBookResponse = await mobileService.updateBook(bookBody);
    response.send(updateBookResponse);
  } catch (error) {
    next(error);
  }
};

export const requestingBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;

    const bookId = req.params.bookId;

    const updateBookStateResponse = await mobileService.updateBookState(
      bookId,
      user._id,
      req.body,
      BookStateEnum.REQUESTED
    );
    response.send(updateBookStateResponse);
  } catch (error) {
    next(error);
  }
};

export const acceptLoanBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;

    const bookId = req.params.bookId;

    const updateBookStateResponse = await mobileService.updateBookState(
      bookId,
      user._id,
      null,
      2
    );
    response.send(updateBookStateResponse);
  } catch (error) {
    next(error);
  }
};

export const refuseLoanBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;

    const bookId = req.params.bookId;

    const updateBookStateResponse = await mobileService.updateBookState(
      bookId,
      user._id,
      null,
      BookStateEnum.FREE
    );
    response.send(updateBookStateResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookId = req.params.id;
    const bookResponse = await mobileService.deleteBook(bookId);
    response.send(bookResponse);
  } catch (error) {
    next(error);
  }
};

export const getBookInfo = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookId = req.params.id;
    const book = await bookService.getBook(bookId);
    response.send(book);
  } catch (error) {
    next(error);
  }
};

export const requestedBookDetail = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookId = req.params.id;

    const book = await mobileService.requestedBookDetail(bookId);
    response.send(book);
  } catch (error) {
    next(error);
  }
};

export const requestedBookList = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;

    const books = await mobileService.requestedBookList(user._id);
    response.send(books);
  } catch (error) {
    next(error);
  }
};

export const getUsersCloseToMe = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radius = parseFloat(req.query.radius as string);

    const { user } = req.locals;

    const usersLocations = await mobileService.getUsersCloseToMe(
      latitude,
      longitude,
      radius,
      user._id
    );

    return response.send(usersLocations);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const user = await mobileService.signUp(req.body);
    response.send(user);
  } catch (error) {
    next(error);
  }
};

export default {
  getBooks,
  getUserBook,
  getBookInfo,
  getBookInfoFromService,
  getUsersCloseToMe,
  addBook,
  updatebook,
  requestingBook,
  deleteBook,
  requestedBookDetail,
  requestedBookList,
  acceptLoanBook,
  refuseLoanBook,
  getBorrowedBooksList,
};
