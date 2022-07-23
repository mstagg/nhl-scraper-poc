export enum GameTypeCode {
  preseason = "PR",
  regularSeason = "R",
  playoffs = "P",
  allStar = "A",
  allStarWomen = "WA",
  olympicGame = "O",
  worldCupExhibition = "WCOH_EXH",
  worldCupPrelim = "WCOH_PRELIM",
  worldCupFinal = "WCOH_FINAL",
}

export enum GameStatusCode {
  scheduled = "1",
  scheduledTimeTBD = "8",
  postponed = "9",
  preGame = "2",
  inProgress = "3",
  inProgressCritical = "4",
  finalGameOver = "5",
  final = "6",
  finalAgainForSomeReason = "7",
}

export const previewGameStates = [
  GameStatusCode.scheduled,
  GameStatusCode.scheduledTimeTBD,
  GameStatusCode.postponed,
  GameStatusCode.preGame,
];

export const liveGameStates = [
  GameStatusCode.inProgress,
  GameStatusCode.inProgressCritical,
];

export const finalGameStates = [
  GameStatusCode.final,
  GameStatusCode.finalAgainForSomeReason,
  GameStatusCode.finalGameOver,
];

export interface ScheduleTeam {
  leagueRecord: {
    wins: number;
    losses: number;
    ot: number;
    type: string;
  };
  score: number;
  team: {
    id: number;
    name: string;
    link: string;
  };
}

export interface ScheduleGame {
  gamePk: number;
  link: string;
  gameType: GameTypeCode;
  season: string;
  gameDate: string;
  status: {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    statusCode: GameStatusCode;
    startTimeTBD: false; // this seems to be hardcoded to false in all API responses, including the game status definition response
  };
  teams: {
    away: ScheduleTeam;
    home: ScheduleTeam;
  };
  venue: {
    name: string;
    link: string;
  };
  content: {
    link: string;
  };
}

export interface ScheduleDate {
  date: string; // "2022-04-09"
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalMatches: number;
  games: ScheduleGame[];
  events: any[]; // Im not certain what eactly this type is, other than array
  matches: any[]; // Im not certain what eactly this type is, other than array
}

export interface Schedule {
  copyright: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalMatches: number;
  wait: number;
  dates: ScheduleDate[];
}
