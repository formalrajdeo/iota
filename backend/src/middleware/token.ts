import jwt from "jsonwebtoken";
import { IUser } from "../common/types";
import { printLogger } from "../lib/utils/logger";
import { jwtSecret, refreshTokenSecret } from "../db/config";

const createToken = (user: IUser) => {
  const JWT_SECRET = jwtSecret || "";
  const payload = { id: user.id, name: user.name, email: user.email };
  let token = null;
  try {
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  } catch (error) {
    printLogger({
      LOGGER_TYPE: "error",
      AUTH_ID: user.id,
      LOG_ID: "2d05532c-8aa6-4d98-a6f8-cb6f69bc1797",
      FILE_NAME: "src/middleware/token",
      FUNCTION_NAME: "catch of createToken",
      STATUS: "error",
      MESSAGE: "Internal server error | createToken failed",
      ETC: `${JSON.stringify(error)}`,
    });
  }

  return token;
};

const refreshToken = (user: IUser, token: string) => {
  const REFRESH_TOKEN_SECRET = refreshTokenSecret || "";
  const payload = { id: user.id, name: user.name, email: user.email };
  try {
    token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "3600s" });
  } catch (error) {
    printLogger({
      LOGGER_TYPE: "error",
      AUTH_ID: user.id,
      LOG_ID: "dbb33326-f977-428d-85e7-1a706bbdcdf5",
      FILE_NAME: "src/middleware/token",
      FUNCTION_NAME: "catch of refreshToken",
      STATUS: "error",
      MESSAGE: "Internal server error | refreshToken failed",
      ETC: `${JSON.stringify(error)}`,
    });
  }

  return token;
};

export { createToken, refreshToken };
