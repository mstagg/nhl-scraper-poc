import { Context, Next } from "koa";
import { Logger } from "../utils/logger";

export const loggerMiddleware = async (ctx: Context, next: Next) => {
  ctx.state.logger = new Logger();
  await next();
};
