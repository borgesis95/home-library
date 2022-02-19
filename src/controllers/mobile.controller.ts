import express from "express";
import bookService from "../services/book.service";
import mobileService from "../services/mobile.service";

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

export default { getBooks };
