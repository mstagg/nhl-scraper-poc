import path from "path";

const SQLITE_FILE = process.env.SQLITE_DB_FILENAME;
export const SQLITE_PATH = path.resolve(
  __dirname,
  `../../src/models/sequelize/sqlite/${SQLITE_FILE}` // This is outside 'dist' to allow for data to persist between builds in sqlite
);
