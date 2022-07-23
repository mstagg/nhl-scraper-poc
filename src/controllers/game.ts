import { Context } from "koa";
import Router from "koa-router";
import { Game } from "../models/Game";

export const gameRouter = new Router({ prefix: "/v1/game" });

const getPlayerStatsForGame = async (ctx: Context) => {
  const { logger } = ctx.state;
  const { externalGameId } = ctx.params;
  const { externalPlayerId } = ctx.query;
  const externalPlayerIds = Array.isArray(externalPlayerId)
    ? externalPlayerId
    : ([externalPlayerId] as string[]);

  // parse options from query params
  const options = {
    ...(externalPlayerId && {
      externalPlayerIds: externalPlayerIds.map((x) => parseInt(x)),
    }),
  };

  // fetch the game and verify it exists
  const game = await Game.getByExternalId(logger, parseInt(externalGameId));
  if (!game) {
    ctx.throw(404, "Game Id Not Found");
  }

  // fetch the players from the game, filteread based on query params
  const playerStats = await game.playerStats(logger, options);
  if (!playerStats) {
    ctx.throw(404, "Player Stats Not Found");
  }

  ctx.status = 200;
  ctx.body = {
    game: game.serialize(),
    stats: playerStats.map((x) => x.serialize()),
  };
};

gameRouter.get("getGameStats", "/:externalGameId", getPlayerStatsForGame);
