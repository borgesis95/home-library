import express, { NextFunction } from "express";
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
    const books = await bookService.getBooks(user._id);
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
    const userBooks = await bookService.getBooks(userId);
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
  deleteBook,
};
