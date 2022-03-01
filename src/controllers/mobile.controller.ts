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
    const books = await bookService.getBooks();
    response.send(books);
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

    const book = await mobileService.addBook(bookBody);
    response.send(book);
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

export default { getBooks, getBookInfo, getBookInfoFromService, addBook };
