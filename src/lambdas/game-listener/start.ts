import "dotenv/config";
import { Game } from "../../models/Game";
import { ListenerStatus } from "../../models/Game/types";
import { ScheduleGame } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";

export interface StartEvent {
  game: ScheduleGame;
}

const start = async (event: StartEvent) => {
  const logger = new Logger();
  const newGame = new Game({
    externalId: event.game.gamePk,
    gameStatus: event.game.status.statusCode,
    listenerStatus: ListenerStatus.active,
  });

  await newGame.save(logger);
  return event;
};

export const handler = start;
