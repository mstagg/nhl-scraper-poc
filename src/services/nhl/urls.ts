interface ScheduleArgs {
  date?: Date;
}
interface GameArgs {
  externalId: number;
}
interface StatsArgs {
  externalPlayerId: number;
  season: string;
}

const formatQueryDate = (d: Date) => {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};

export const schedule = (options: ScheduleArgs) => {
  const params = new URLSearchParams();
  if (options.date) {
    params.set("date", formatQueryDate(options.date));
  }
  return `https://statsapi.web.nhl.com/api/v1/schedule?${params.toString()}`;
};

export const game = (options: GameArgs) => {
  return `https://statsapi.web.nhl.com/api/v1/game/${options.externalId}/feed/live`;
};

export const playerStats = (options: StatsArgs) => {
  const params = new URLSearchParams();
  params.set("season", options.season);
  params.set("stats", "gameLog");

  return `https://statsapi.web.nhl.com/api/v1/people/${
    options.externalPlayerId
  }/stats?${params.toString()}`;
};
