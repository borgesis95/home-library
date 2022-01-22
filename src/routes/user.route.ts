import express from "express";
import userController from "../controllers/user.controller";
import { authenticationMiddleware } from "../middlewares/auth.middleware";

const userRoutes = express.Router();

userRoutes.post("/signup", userController.signup);
userRoutes.post("/signin", userController.login);

export default userRoutes;
