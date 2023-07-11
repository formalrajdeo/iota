import { Request, Response } from "express";
import { createUser, findUser, updateUser } from "./user.service";
import bcrypt from "bcrypt";
import { createToken, refreshToken } from "../../middleware/token";
import jwt from "jsonwebtoken";
import { printLogger } from "../../lib/utils/logger";
import { STATUS_CODE } from "../../constants/statusCode";
import {
  clientUrl,
  jwtSecret,
  mailgunApiKey,
  mailgunDomain,
  mailgunFrom,
  refreshTokenSecret,
} from "../../db/config";
import { regularExp } from "../../lib/utils/regular_expression";
import mailgun from "mailgun-js";
import { reset_html_page } from "../../lib/html/reset_html_page";
import { DecryptResponse, EncryptResponse } from "../../common/EncryptDecryptResponse";

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

class UserController {
  async register(req: Request, res: Response) {
    const { encryptedBody } = req.body;
    if (!encryptedBody) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(await EncryptResponse({ message: "Invalid payload" }))
      return;
    }

    const decryptedResponse = await DecryptResponse(encryptedBody);
    if (!decryptedResponse) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(await EncryptResponse({ message: "Failed to decrypt" }))
      return;
    }

    const { name, email, isAdmin = false, password } = decryptedResponse;

    // Empty check validation
    if (!name || !email || !password) {
      res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(await EncryptResponse({ message: "Empty check validation failed" }))
      return;
    }

    // Email validation using regular expression
    if (!regularExp.emailRegex.test(email)) {
      res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(await EncryptResponse({ message: "Invalid email format" }));
      return;
    }

    // Password validation using regular expression
    if (!regularExp.passwordRegex.test(password)) {
      res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(await EncryptResponse({
          message:
            "Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one digit, and one special character",
        }));
      return;
    }

    try {
      const passwordhashed = await bcrypt.hash(password, 10);
      const user = await createUser({
        name,
        email,
        isAdmin,
        password: passwordhashed,
      });
      res.status(STATUS_CODE.CREATED).json(await EncryptResponse(user));
    } catch (err) {
      printLogger({
        LOGGER_TYPE: "error",
        AUTH_ID: "NA",
        LOG_ID: "6e2fe80d-aa46-4c3f-98e5-61ae58531a70",
        FILE_NAME: "src/modules/users/user.controller.ts",
        FUNCTION_NAME: "catch of register",
        STATUS: "error",
        MESSAGE: "Internal server error | register failed",
        ETC: `${JSON.stringify(err)}`,
      });
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json(await EncryptResponse({ message: "Internal server error" }));
    }
  }

  async login(req: Request, res: Response) {
    const { encryptedBody } = req.body;
    if (!encryptedBody) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(await EncryptResponse({ message: "Invalid payload" }))
      return;
    }

    const decryptedResponse = await DecryptResponse(encryptedBody);
    if (!decryptedResponse) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(await EncryptResponse({ message: "Failed to decrypt" }))
      return;
    }

    const { email, password } = decryptedResponse;

    try {
      const user = await findUser({
        condition: {
          email,
        },
      });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(await EncryptResponse({ message: "Invalid email or password" }))
        return;
      }

      const token = createToken(user) || "";
      const refreshTokenValue = refreshToken(user, token) || "";

      await updateUser({
        userPayload: { refresh_token: refreshTokenValue },
        condition: { id: user.id },
      });

      res.status(STATUS_CODE.OK).json(
        await EncryptResponse({
          user,
          token,
          refresh_token: refreshTokenValue,
        }))
    } catch (err) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json(await EncryptResponse({ message: "Internal server error" }))
    }
  }

  async refreshToken(req: Request, res: Response) {
    const REFRESH_TOKEN_SECRET = refreshTokenSecret || "";
    const JWT_SECRET = jwtSecret || "";

    const { refresh_token, id } = req.body;

    try {
      const user = (await findUser({
        condition: {
          id,
        },
      })) as any;

      if (!user) {
        res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      if (user.refresh_token !== refresh_token) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid refresh token" });
      }

      jwt.verify(
        refresh_token,
        REFRESH_TOKEN_SECRET,
        async (err: any, data: any) => {
          if (err) res.sendStatus(STATUS_CODE.FORBIDDEN);
          const accessToken = jwt.sign(
            { id: data.id, name: data.name, email: data.email },
            JWT_SECRET,
            { expiresIn: "604800000s" }
          );
          await updateUser({
            userPayload: { refresh_token: accessToken },
            condition: { id: user.id },
          });

          return res
            .status(STATUS_CODE.CREATED)
            .json({ refresh_token: accessToken });
        }
      );
    } catch (error) {
      return res.sendStatus(STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    const { id } = req.authJwtData;

    try {
      const user = await findUser({
        condition: {
          id,
        },
      });

      if (!user) {
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
        return;
      }

      await updateUser({
        userPayload: { refresh_token: "" },
        condition: { id: user.id },
      });

      res.status(STATUS_CODE.OK).json({ message: "Logout successfully!" });
    } catch (err) {
      printLogger({
        LOGGER_TYPE: "error",
        AUTH_ID: id,
        LOG_ID: "cc1866a5-7413-4370-bc66-9ee75b6b8c66",
        FILE_NAME: "src/modules/users/user.controller.ts",
        FUNCTION_NAME: "catch of logout",
        STATUS: "error",
        MESSAGE: "Internal server error | logout failed",
        ETC: `${JSON.stringify(err)}`,
      });
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Logout error!" });
    }
  }

  async profile(req: AuthenticatedRequest, res: Response) {
    const { id } = req.authJwtData;
    const { name } = req.body;

    try {
      if (!name) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Empty payload" });
        return;
      }

      const result = await updateUser({
        userPayload: { name },
        condition: { id },
      });

      res
        .status(STATUS_CODE.OK)
        .json({ message: "User updated successfully", data: result });
    } catch (err) {
      printLogger({
        LOGGER_TYPE: "error",
        AUTH_ID: id,
        LOG_ID: "6a168a4c-c266-4439-8b28-f04d4c32611f",
        FILE_NAME: "src/modules/users/user.controller.ts",
        FUNCTION_NAME: "catch of profile",
        STATUS: "error",
        MESSAGE: "Internal server error | profile failed",
        ETC: `${JSON.stringify(err)}`,
      });
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Profile error!" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Empty check validation
      if (!email) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Empty check validation failed" });
        return;
      }

      // Email validation using regular expression
      if (!regularExp.emailRegex.test(email)) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid email format" });
        return;
      }

      const user = await findUser({
        condition: {
          email,
        },
      });

      if (!user) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Invalid email" });
        return;
      }

      const JWT_SECRET = jwtSecret || "";
      const payload = { id: user.id, name: user.name, email: user.email };

      // Set the expiration time to 10 minutes from now
      const expiresInMinutes = 10;
      const expirationTime =
        Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: expirationTime,
      });

      const mailgunClient = () =>
        mailgun({
          apiKey: mailgunApiKey || "",
          domain: mailgunDomain || "",
        });

      mailgunClient()
        .messages()
        .send(
          {
            from: mailgunFrom,
            to: email,
            subject: "Reset link",
            html: reset_html_page({
              userName: user.name,
              goToForgotPageLink: `${clientUrl}/authentication/forgot?token=${token}`,
            }),
          },
          (error: mailgun.Error, body: any) => {
            if (error) {
              return res
                .status(500)
                .send({ message: "Error in sending email" });
            } else {
              return res.send({ message: "Email sent successfully" });
            }
          }
        );
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Reset mail sent failed!", error });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { token, password: new_password } = req.body;

      if (!new_password || !token) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Empty check validation failed" });
        return;
      }

      // Password validation using regular expression
      if (!regularExp.passwordRegex.test(new_password)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message:
            "Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one digit, and one special character",
        });
        return;
      }

      const JWT_SECRET = jwtSecret || "";
      const { email } = jwt.verify(token, JWT_SECRET) as authJwtDataObj;

      // Empty check validation
      if (!email) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Email is empty" });
        return;
      }

      // Email validation using regular expression
      if (!regularExp.emailRegex.test(email)) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid email format" });
        return;
      }

      const user = await findUser({
        condition: {
          email,
        },
      });

      if (!user) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Invalid email" });
        return;
      }

      const passwordhashed = await bcrypt.hash(new_password, 10);
      const result = await updateUser({
        userPayload: { password: passwordhashed },
        condition: { email },
      });

      res
        .status(STATUS_CODE.OK)
        .json({ message: "User password updated successfully", data: result });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to update password!", error });
    }
  }
}

export default new UserController();
