import * as dotenv from "dotenv";

dotenv.config();

export const port = Number(process.env.API_PORT || "");
export const dbHost = String(process.env.DB_HOST || "");
export const dbPort = Number(process.env.DB_PORT || "");
export const dbName = String(process.env.DB_NAME || "");
export const dbUser = String(process.env.DB_USER || "");
export const dbPassword = String(process.env.DB_PASSWORD || "");

export const originLocalhost = String(process.env.ORIGIN_LOCALHOST || "");
export const originProduct = String(process.env.ORIGIN_PRODUCT || "");

export const jwtSecret = String(process.env.JWT_SECRET || "");
export const refreshTokenSecret = String(
  process.env.REFRESH_TOKEN_SECRET || ""
);

export const mailgunApiKey = String(process.env.MAILGUN_API_KEY || "");
export const mailgunDomain = String(process.env.MAILGUN_DOMAIN || "");
export const mailgunFrom = String(process.env.MAILGUN_FROM || "");

export const clientUrl = String(process.env.CLIENT_URL || "");
