import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../db/database";

export default class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public refresh_token!: string;
  public isAdmin!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: false,
  }
);

User.sync();
