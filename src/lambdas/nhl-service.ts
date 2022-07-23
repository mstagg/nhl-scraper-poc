import "dotenv/config";
import Koa from "koa";
import { gameRouter } from "../controllers/game";
import { loggerMiddleware } from "../middleware/logger";
import { SequelizeGameModel } from "../models/Game";
import { SequelizePlayerModel } from "../models/Player";

const PORT = 8080;

const startApp = async () => {
  // This is a hack, just ensures database tables are always initialized correctly for local dev
  // Never do this in a prod environment, or anything that isnt a proof of concept
  await SequelizeGameModel.sync({ alter: true });
  await SequelizePlayerModel.sync({ alter: true });

  const app = new Koa();

  app.use(loggerMiddleware).use(gameRouter.routes());

  app.listen(PORT);
  console.log(`Listening on port: ${PORT}...`);
};

startApp();
