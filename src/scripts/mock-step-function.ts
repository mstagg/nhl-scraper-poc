import { handler as fetchBoxScoreHandler } from "../lambdas/game-listener/fetch-game-state";
import { handler as recordPlayerStatsHandler } from "../lambdas/game-listener/record-player-stats";
import {
  handler as startHandler,
  StartEvent,
} from "../lambdas/game-listener/start";
import { handler as stopHandler } from "../lambdas/game-listener/stop";
import { SequelizeGameModel } from "../models/Game";
import { SequelizePlayerModel } from "../models/Player";
import {
  finalGameStates,
  GameFeed,
  GameStatusCode,
  GameTypeCode,
} from "../services/nhl/types";

const MOCK_EVENT: StartEvent = {
  game: {
    gamePk: 2017020659,
    link: "/api/v1/game/2017020659/feed/live",
    gameType: GameTypeCode.regularSeason,
    season: "20172018",
    gameDate: "2018-01-10T01:00:00Z",
    status: {
      abstractGameState: "Preview",
      codedGameState: "1",
      detailedState: "Scheduled",
      statusCode: GameStatusCode.inProgress,
      startTimeTBD: false,
    },
    teams: {
      away: {
        leagueRecord: {
          wins: 21,
          losses: 16,
          ot: 4,
          type: "league",
        },
        score: 0,
        team: {
          id: 20,
          name: "Calgary Flames",
          link: "/api/v1/teams/20",
        },
      },
      home: {
        leagueRecord: {
          wins: 22,
          losses: 17,
          ot: 3,
          type: "league",
        },
        score: 0,
        team: {
          id: 30,
          name: "Minnesota Wild",
          link: "/api/v1/teams/30",
        },
      },
    },
    venue: {
      name: "Xcel Energy Center",
      link: "/api/v1/venues/null",
    },
    content: {
      link: "/api/v1/game/2017020659/content",
    },
  },
};

// simulates "loops" through the stepfunction state machine
const runLambdas = async (initialEvent: StartEvent) => {
  // This is a hack, just ensures database tables are always initialized correctly for local dev
  // Never do this in a prod environment, or anything that isnt a proof of concept
  await SequelizeGameModel.sync({ alter: true });
  await SequelizePlayerModel.sync({ alter: true });

  let gameState: GameFeed;
  do {
    const initialEventOutput = await startHandler(initialEvent);
    gameState = await fetchBoxScoreHandler(initialEventOutput);
    const playerStatPromises = Object.entries(gameState.gameData.players).map(
      (x) =>
        recordPlayerStatsHandler({
          game: gameState,
          player: x[1],
        })
    );
    await Promise.all(playerStatPromises);
    // WAIT SOME ACCEPTABLE PERIOD OF TIME IN THE STATE MACHINE, MAYBE 15 SECONDS?
  } while (!finalGameStates.includes(gameState.gameData.status.statusCode));

  await stopHandler({ game: gameState });
};
runLambdas(MOCK_EVENT).then(() => console.log("mock step-function complete"));
