import { dbHost, dbPort, dbName, dbUser, dbPassword } from "./config";
import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//   host: dbHost,
//   port: dbPort,
//   dialect: 'mysql', // Specify the dialect explicitly
// });

export const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: 'mysql',
    port: dbPort,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)
