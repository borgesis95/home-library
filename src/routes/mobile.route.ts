import express from "express";
import {
  getBookInfo,
  getBooks,
  signUp,
  getBookInfoFromService,
} from "../controllers/mobile.controller";

/**
 * Route /mobile has been created just to serve mobile application
 */
const routes = express.Router();
routes.get("/books", getBooks);
routes.post("/signup", signUp);
routes.get("/book/:id", getBookInfo);
routes.get("/book/info/:isbn", getBookInfoFromService);

export default routes;
