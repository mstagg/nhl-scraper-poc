import { ScheduledEvent } from "aws-lambda";
import { NhlAPI } from "../services/nhl";
import { liveGameStates } from "../services/nhl/types";
import { Logger } from "../utils/logger";

const pollNhlApi = async (event: ScheduledEvent) => {
  const logger = new Logger();
  const nhlService = new NhlAPI(logger);

  const { time } = event;

  const schedule = await nhlService.fetchScheduleInfoForDate(new Date(time));

  const allgames = schedule.dates
    .flat()
    .map((x) => x.games)
    .flat();
  const livegames = allgames.filter((x) =>
    liveGameStates.includes(x.status.statusCode)
  );

  logger.info("live games", livegames);
};

export const handler = pollNhlApi;
