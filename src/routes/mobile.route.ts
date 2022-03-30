import express from "express";
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
} from "../controllers/mobile.controller";
import { authenticationMiddleware } from "../middlewares/auth.middleware";

/**
 * Route /mobile has been created just to serve mobile application
 */
const routes = express.Router();

routes.get("/books", authenticationMiddleware, getBooks);
routes.get("/users", authenticationMiddleware, getUsersCloseToMe);
routes.get("/users/books/:userId", authenticationMiddleware, getUserBook);
routes.post("/book", authenticationMiddleware, addBook);
routes.put("/book", updatebook);
routes.post("/signup", signUp);
routes.get("/book/:id", getBookInfo);
routes.get("/book/info/:isbn", getBookInfoFromService);
routes.delete("/book/:id", deleteBook);

export default routes;
