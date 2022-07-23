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

export interface Team {
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
    away: Team;
    home: Team;
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

export interface Player {
  id: number;
  fullName: string;
  link: string;
  firstName: string;
  lastName: string;
  primaryNumber: string;
  birthDate: string;
  currentAge: number;
  birthCity: string;
  birthCountry: string;
  nationality: string;
  height: string;
  weight: number;
  active: boolean;
  alternateCaptain: boolean;
  captain: boolean;
  rookie: boolean;
  shootsCatches: string;
  rosterStatus: string;
  currentTeam: {
    id: number;
    name: string;
    link: string;
    triCode: string;
  };
  primaryPosition: {
    code: string;
    name: string;
    type: string;
    abbreviation: string;
  };
}

export interface GameFeed {
  copyright: string;
  gamePk: number;
  link: string;
  metaData: { wait: number; timeStamp: string };
  gameData: {
    game: { pk: number; season: string; type: GameTypeCode };
    datetime: {
      dateTime: string;
      endDateTime: string;
    };
    status: {
      abstractGameState: string;
      codedGameState: GameStatusCode;
      detailedState: string;
      statusCode: GameStatusCode;
      startTimeTBD: false;
    };
    teams: { away: Team; home: Team };
    players: Record<string, Player>;
    venue: {
      id: number;
      name: string;
      link: string;
    };
  };
  liveData: any;
}

export interface Split {
  season: string;
  stat: {
    timeOnIce: string;
    assists: number;
    goals: number;
    pim: number;
    shots: number;
    games: number;
    hits: number;
    powerPlayGoals: number;
    powerPlayPoints: number;
    powerPlayTimeOnIce: string;
    evenTimeOnIce: string;
    penaltyMinutes: string;
    shotPct: number;
    gameWinningGoals: number;
    overTimeGoals: number;
    shortHandedGoals: number;
    shortHandedPoints: number;
    shortHandedTimeOnIce: string;
    blocked: number;
    plusMinus: number;
    points: number;
    shifts: number;
  };
  team: {
    id: number;
    name: string;
    link: string;
  };
  opponent: {
    id: number;
    name: string;
    link: string;
  };
  date: string;
  isHome: boolean;
  isWin: boolean;
  isOT: boolean;
  game: {
    gamePk: number;
    link: string;
    content: {
      link: string;
    };
  };
}

export interface Stat {
  type: {
    displayName: string;
    gameType: any;
  };
  splits: Split[];
}

export interface Stats {
  copyright: string;
  stats: Stat[];
}
