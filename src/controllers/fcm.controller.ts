import express from "express";
import fcmService from "../services/fcm.service";

export const saveFcmToken = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;
    const userId = user._id;
    const token = req.params.token;

    const res = await fcmService.saveFcmToken(userId, token);

    response.send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteFcmToken = async (
  req: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const { user } = req.locals;
    const userId = user._id;
    const token = req.params.token;

    console.log("token", token);

    const res = await fcmService.deleteFcmToken(userId, token);
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export default {
  saveFcmToken,
  deleteFcmToken,
};
