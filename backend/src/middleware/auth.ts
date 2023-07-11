import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../constants/statusCode";
import { jwtSecret } from "../db/config";

type authJwtDataObj = {
  id: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
};

interface AuthenticatedRequest extends Request {
  authJwtData: authJwtDataObj;
}

const authToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1] || "";
  if (!token) {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: "Token is not provided" });
  }
  try {
    const key = jwtSecret || "";
    const isVeriToken = jwt.verify(token, key) as authJwtDataObj;
    if (isVeriToken) {
      req.authJwtData = isVeriToken;
      next();
    }
  } catch (error) {
    res.status(STATUS_CODE.FORBIDDEN).json(error);
  }
};

export { authToken };
