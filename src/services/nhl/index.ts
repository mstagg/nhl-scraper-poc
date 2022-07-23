import axios from "axios";
import { Logger } from "../../utils/logger";
import { GameFeed, Schedule, Stats } from "./types";
import * as urls from "./urls";

export class NhlAPI {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async fetchScheduleInfoForDate(date: Date) {
    try {
      const res = await axios.get(urls.schedule({ date }));
      return res.data as Schedule;
    } catch (e) {
      this.logger.error("Failed to fetch NHL schedule data", {
        error: e,
        date,
      });
      throw e;
    }
  }

  async fetchInfoForGame(externalId: number) {
    try {
      const res = await axios.get(urls.game({ externalId }));
      return res.data as GameFeed;
    } catch (e) {
      this.logger.error("Failed to fetch NHL schedule data", {
        error: e,
        externalId,
      });
      throw e;
    }
  }

  async fetchGameStatsForPlayer(
    externalPlayerId: number,
    externalGameId: number,
    season: string
  ) {
    try {
      const res = await axios.get(
        urls.playerStats({ externalPlayerId, season })
      );
      const stats = (res.data as Stats).stats.find(
        (x) => x.type.displayName === "gameLog"
      );
      if (!stats) {
        throw new Error("GameLog Not Found");
      }
      const gameStatsForPlayer = stats.splits.find(
        (x) => x.game.gamePk === externalGameId
      );
      return gameStatsForPlayer || undefined;
    } catch (e) {
      this.logger.error("Failed to fetch NHL schedule data", {
        error: e,
        externalPlayerId,
        externalGameId,
      });
      throw e;
    }
  }
}
