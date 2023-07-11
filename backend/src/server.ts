import express, { Request, Response, Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware";
import { clientUrl, originLocalhost, originProduct, port } from "./db/config";
import { sequelize } from "./db/database";
import { printLogger } from "./lib/utils/logger";

import userRoute from "./modules/users/user.routes";

import { STATUS_CODE } from "./constants/statusCode";

const app: Express = express();
// ----------------------- App Configuration -----------------------

app.use(helmet());

const allowedOrigins = [originLocalhost || "", originProduct || "", clientUrl || ""];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(__dirname));

// ----------------------- ROUTES -----------------------
app.get("/", async (req: Request, res: Response) => {
  try {
    res.status(STATUS_CODE.OK).send("Welcome to iota");
  } catch (e) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send("Error to load home page");
  }
});

app.use("/api/users", userRoute);
// ----------------------- MIDDLEWARES -----------------------
app.use(errorHandler);
app.use(notFoundHandler);

// ----------------------- App Variables -----------------------
if (!port) {
  printLogger({
    LOGGER_TYPE: "error",
    AUTH_ID: "NA",
    LOG_ID: "9g728f00-78dc-473b-8943-7cab7df2fd07",
    FILE_NAME: "src/server",
    FUNCTION_NAME: "port if condition",
    STATUS: "error",
    MESSAGE: `Port is not defined | ${port}`,
    ETC: "",
  });
  process.exit(1);
}

// ----------------------- Server Activation -----------------------
app.listen(port, async () => {
  try {
    printLogger({
      LOGGER_TYPE: "info",
      AUTH_ID: "NA",
      LOG_ID: "4f728f00-78dc-473b-8943-7cab7df2fd07",
      FILE_NAME: "src/server",
      FUNCTION_NAME: "app.listen",
      STATUS: "success",
      MESSAGE: `Listening on port ${port}`,
      ETC: "",
    });


    await sequelize
      .authenticate()
      .then(() =>
        printLogger({
          LOGGER_TYPE: "info",
          AUTH_ID: "NA",
          LOG_ID: "c32693c5-9762-4334-b833-1175debfee5b",
          FILE_NAME: "src/server",
          FUNCTION_NAME: "sequelize.authenticate",
          STATUS: "success",
          MESSAGE: "connection has been established successfully.",
          ETC: "",
        })
      )
      .catch((error) =>
        printLogger({
          LOGGER_TYPE: "error",
          AUTH_ID: "NA",
          LOG_ID: "c32693c5-9762-4334-b833-1175desfee5b",
          FILE_NAME: "src/server",
          FUNCTION_NAME: "sequelize.authenticate",
          STATUS: "error",
          MESSAGE: "Failed to connect DB",
          ETC: `${error && JSON.stringify(error)}`,
        })
      )

  } catch (error) {
    printLogger({
      LOGGER_TYPE: "error",
      AUTH_ID: "NA",
      LOG_ID: "38b3dbec-a176-4011-a776-6e8d60b03722",
      FILE_NAME: "src/server",
      FUNCTION_NAME: "catch of app.listen",
      STATUS: "error",
      MESSAGE: "Internal server error",
      ETC: `${JSON.stringify(error)}`,
    });
  }
});
