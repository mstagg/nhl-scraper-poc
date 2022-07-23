import { Sequelize } from "sequelize";
import { SQLITE_PATH } from "../../utils/constants";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: SQLITE_PATH,
  logging: false,
});
