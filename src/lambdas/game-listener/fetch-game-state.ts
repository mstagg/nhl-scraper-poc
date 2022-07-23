import "dotenv/config";
import { NhlAPI } from "../../services/nhl";
import { ScheduleGame } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";

export interface StartEvent {
  game: ScheduleGame;
}

const fetchGameState = async (event: StartEvent) => {
  const logger = new Logger();
  const api = new NhlAPI(logger);

  const game = await api.fetchInfoForGame(event.game.gamePk);
  return game;
};

export const handler = fetchGameState;
