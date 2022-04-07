import express, { Router } from "express";
import {
  getBookInfo,
  getBooks,
  signUp,
  getBookInfoFromService,
  addBook,
  deleteBook,
  updatebook,
  getUsersCloseToMe,
  getUserBook,
  requestedBookDetail,
  requestingBook,
  requestedBookList,
  refuseLoanBook,
  acceptLoanBook,
  getBorrowedBooksList,
} from "../controllers/mobile.controller";
import { authenticationMiddleware } from "../middlewares/auth.middleware";

/**
 * Route /mobile has been created just to serve mobile application
 */
const routes = express.Router();

routes.get("/books", authenticationMiddleware, getBooks);
routes.get("/users", authenticationMiddleware, getUsersCloseToMe);
routes.get(
  "/book/borrowed/list",
  authenticationMiddleware,
  getBorrowedBooksList
);
routes.get("/book/requested/list", authenticationMiddleware, requestedBookList);
routes.get(
  "/book/requested/:id",
  authenticationMiddleware,
  requestedBookDetail
);
routes.post(
  "/users/books/ask/:bookId",
  authenticationMiddleware,
  requestingBook
);

routes.post(
  "/users/books/accept/:bookId",
  authenticationMiddleware,
  acceptLoanBook
);

routes.post(
  "/users/books/refuse/:bookId",
  authenticationMiddleware,
  refuseLoanBook
);

routes.get("/users/books/:userId", authenticationMiddleware, getUserBook);
routes.post("/book", authenticationMiddleware, addBook);
routes.put("/book", authenticationMiddleware, updatebook);
routes.post("/signup", authenticationMiddleware, signUp);
routes.get("/book/:id", authenticationMiddleware, getBookInfo);
routes.get(
  "/book/info/:isbn",
  authenticationMiddleware,
  getBookInfoFromService
);
routes.delete("/book/:id", authenticationMiddleware, deleteBook);

export default routes;
