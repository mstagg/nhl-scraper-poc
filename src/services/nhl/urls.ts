interface ScheduleQueryArgs {
  date?: Date;
}

const formatQueryDate = (d: Date) => {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};

export const schedule = (queryArgs: ScheduleQueryArgs) => {
  const params = new URLSearchParams();
  if (queryArgs.date) {
    params.set("date", formatQueryDate(queryArgs.date));
  }
  return `https://statsapi.web.nhl.com/api/v1/schedule?${params.toString()}`;
};
