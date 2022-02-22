import express from "express";
import {
  getBookInfo,
  getBooks,
  signUp,
} from "../controllers/mobile.controller";

/**
 * Route /mobile has been created just to serve mobile application
 */
const routes = express.Router();
routes.get("/books", getBooks);
routes.post("/signup", signUp);
routes.get("/book/:id", getBookInfo);

export default routes;
