import { handler } from "../../../src/lambdas/nhl-listener";
import { Game } from "../../../src/models/Game";
import { NhlAPI } from "../../../src/services/nhl";
import {
  GameStatusCode,
  GameTypeCode,
  Schedule,
} from "../../../src/services/nhl/types";

//@ts-ignore
const MOCK_CLOUDWATCH_SCHEDULED_EVENT: any = (date: Date) => ({
  version: "0",
  id: "53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa",
  "detail-type": "Scheduled Event",
  source: "aws.events",
  account: "123456789012",
  time: date.toISOString(),
  region: "us-east-1",
  resources: ["arn:aws:events:us-east-1:123456789012:rule/my-scheduled-rule"],
  detail: {},
});

const MOCK_SCEHDULE: Schedule = {
  copyright:
    "NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2018. All Rights Reserved.",
  totalItems: 1,
  totalEvents: 0,
  totalGames: 1,
  totalMatches: 0,
  wait: 10,
  dates: [
    {
      date: "2018-01-09",
      totalItems: 1,
      totalEvents: 0,
      totalGames: 1,
      totalMatches: 0,
      games: [
        {
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
      ],
      events: [],
      matches: [],
    },
  ],
};

describe("nhl-listener", () => {
  test("happy path", async () => {
    const date = new Date("2018-01-10");
    const serviceSpy = jest
      .spyOn(NhlAPI.prototype, "fetchScheduleInfoForDate")
      .mockResolvedValue(MOCK_SCEHDULE);
    const modelGetSpy = jest
      .spyOn(Game, "getByExternalId")
      .mockResolvedValue(undefined);
    const modelStartListenerSpy = jest.spyOn(Game, "startGameListener");

    await handler(MOCK_CLOUDWATCH_SCHEDULED_EVENT(date));
    expect(serviceSpy).toHaveBeenCalledWith(date);
    expect(modelGetSpy).toHaveBeenCalledWith(
      expect.anything(),
      MOCK_SCEHDULE.dates[0].games[0].gamePk
    );
    expect(modelStartListenerSpy).toHaveBeenCalledWith(
      expect.anything(),
      MOCK_SCEHDULE.dates[0].games[0]
    );
  });
});
