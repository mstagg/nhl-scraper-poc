import "dotenv/config";
import { ScheduledEvent } from "aws-lambda";
import { NhlAPI } from "../services/nhl";
import { liveGameStates } from "../services/nhl/types";
import { Logger } from "../utils/logger";
import { Game } from "../models/Game";

const pollNhlApi = async (event: ScheduledEvent) => {
  const { time } = event;
  const logger = new Logger();
  const nhlService = new NhlAPI(logger);

  // Fetch all games for date provided from NHL API
  const schedule = await nhlService.fetchScheduleInfoForDate(new Date(time));
  const allgames = schedule.dates.map((x) => x.games).flat();
  const liveGames = allgames.filter((x) =>
    liveGameStates.includes(x.status.statusCode)
  );

  // Determine which active games do not have a game-listener on record
  const gameListeners = (
    await Promise.all(
      liveGames.map((x) => Game.getByExternalId(logger, x.gamePk))
    )
  ).filter((x) => x !== undefined) as Game[];
  const gameListenerExternalIds = gameListeners.map((x) => x.externalId);
  const gameListenersToStart = liveGames.filter(
    (x) => !gameListenerExternalIds.includes(x.gamePk)
  );

  // Start execution of the lambda step function for each new game-listener
  // https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#startExecution-property
  await Promise.all(
    gameListenersToStart.map((x) => {
      const params = {
        stateMachineArn: "MOCK_ARN",
        input: JSON.stringify(x),
        name: "MOCK_NAME",
        traceHeader: "MOCK_HEADER",
      };
      logger.info("This is a mock step function invocation", params);
    })
  );

  // Log what happened
  if (gameListenersToStart.length > 0) {
    logger.info(
      `Game Listeners Activated For ${gameListenersToStart.map(
        (x) => x.gamePk
      )}`
    );
  } else {
    logger.info("No new games have begun");
  }
};

export const handler = pollNhlApi;
