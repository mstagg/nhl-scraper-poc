import "dotenv/config";
import { Player } from "../../models/Player";
import { NhlAPI } from "../../services/nhl";
import { GameFeed, Player as PlayerType } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";

export interface StartEvent {
  game: GameFeed;
  player: PlayerType;
}

const recordPlayerStats = async (event: StartEvent) => {
  const logger = new Logger();
  const api = new NhlAPI(logger);
  const playerStatsForGame = await api.fetchGameStatsForPlayer(
    event.player.id,
    event.game.gamePk,
    event.game.gameData.game.season
  );

  if (!playerStatsForGame) {
    return;
  }

  let player = await Player.getByExternalId(
    logger,
    event.player.id,
    event.game.gamePk
  );

  if (!player) {
    player = new Player({
      externalPlayerId: event.player.id,
      externalGameId: event.game.gamePk,
      teamId: playerStatsForGame.team.id,
      teamName: playerStatsForGame.team.name,
      age: event.player.currentAge,
      number: event.player.primaryNumber,
      position: event.player.primaryPosition.name,
      assists: playerStatsForGame.stat.assists || 0,
      goals: playerStatsForGame.stat.goals || 0,
      hits: playerStatsForGame.stat.hits || 0,
      points: playerStatsForGame.stat.points || 0,
      minutes: playerStatsForGame.stat.timeOnIce,
    });
    await player.save(logger);
  } else {
    player.assists = playerStatsForGame.stat.assists || 0;
    player.goals = playerStatsForGame.stat.goals || 0;
    player.hits = playerStatsForGame.stat.hits || 0;
    player.points = playerStatsForGame.stat.points || 0;
    player.minutes = playerStatsForGame.stat.timeOnIce;
    await player.save(logger);
  }

  return playerStatsForGame;
};

export const handler = recordPlayerStats;
