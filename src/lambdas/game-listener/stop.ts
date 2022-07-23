import "dotenv/config";
import { Game } from "../../models/Game";
import { ListenerStatus } from "../../models/Game/types";
import { GameFeed } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";

export interface StartEvent {
  game: GameFeed;
}

const stop = async (event: StartEvent) => {
  const logger = new Logger();
  const game = await Game.getByExternalId(logger, event.game.gamePk);
  if (!game) {
    throw new Error("Game Not Found");
  }
  game.gameStatus = event.game.gameData.status.statusCode;
  game.listenerStatus = ListenerStatus.inactive;

  await game.save(logger);
  return event;
};

export const handler = stop;
