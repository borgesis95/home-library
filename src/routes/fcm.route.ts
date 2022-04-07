import express from "express";
import { deleteFcmToken, saveFcmToken } from "../controllers/fcm.controller";

const routes = express.Router();

routes.post("/token/:token", saveFcmToken);
routes.delete("/token/:token", deleteFcmToken);

export default routes;
