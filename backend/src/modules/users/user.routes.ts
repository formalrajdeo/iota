import { Router, RequestHandler } from "express";
import UserController from "./user.controller";
import { authToken } from "../../middleware/auth";

const userRoute = Router();

userRoute.post("/", UserController.register);
userRoute.post("/login", UserController.login);
/*
userRoute.post("/refreshtoken", UserController.refreshToken);
userRoute.post(
  "/logout",
  authToken as RequestHandler,
  UserController.logout as any
);
userRoute.put(
  "/me",
  authToken as RequestHandler,
  UserController.profile as any
);
userRoute.post("/reset-password", UserController.resetPassword);

userRoute.post("/forgot-password", UserController.forgotPassword);
*/
export default userRoute;
