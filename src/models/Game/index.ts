import { DataTypes } from "sequelize";
import { GameStatusCode, ScheduleGame } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";
import { Player } from "../Player";
import { sequelize } from "../sequelize";
import { ListenerStatus } from "./types";

export const SequelizeGameModel = sequelize.define("Game", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  externalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  gameStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  listenerStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export interface GameConsructorArgs {
  id?: number;
  externalId: number;
  gameStatus: GameStatusCode;
  listenerStatus: ListenerStatus;
}

interface GameSerialized {
  id: number;
  externalId: number;
  gameStatus: GameStatusCode;
  listenerStatus: ListenerStatus;
}

export class Game {
  id?: number;
  externalId: number;
  gameStatus: GameStatusCode;
  listenerStatus: ListenerStatus;

  constructor(args: GameConsructorArgs) {
    Object.assign(this, args);
  }

  toRecord() {
    return {
      id: this.id,
      externalId: this.externalId,
      gameStatus: this.gameStatus,
      listenerStatus: this.listenerStatus,
    };
  }

  serialize(): GameSerialized {
    if (!this.id) {
      throw new Error("Id Not Found");
    }
    return {
      id: this.id,
      externalId: this.externalId,
      gameStatus: this.gameStatus,
      listenerStatus: this.listenerStatus,
    };
  }

  async save(
    logger: Logger // this is lazy
  ) {
    try {
      const g = await SequelizeGameModel.upsert(this.toRecord());
      this.id = g[0].toJSON().id;
    } catch (e) {
      logger.error("Failed to upsert Game into sqlite", {
        error: e,
      });
      throw e;
    }
  }

  async playerStats(logger: Logger, options: { externalPlayerIds?: number[] }) {
    if (options.externalPlayerIds) {
      const playerStats = await Promise.all(
        options.externalPlayerIds.map((x) =>
          Player.getByExternalId(logger, x, this.externalId)
        )
      );
      return playerStats.filter((x) => x !== undefined) as Player[];
    } else {
      return await Player.getAllByExternalGameId(logger, this.externalId);
    }
  }

  // This is a mock.
  // https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#startExecution-property
  static async startGameListener(
    logger: Logger, // this is lazy
    game: ScheduleGame
  ) {
    const params = {
      stateMachineArn: "MOCK_ARN",
      input: JSON.stringify({ game }),
      name: "MOCK_NAME",
      traceHeader: "MOCK_HEADER",
    };
    logger.info("This is a mock step function invocation", params);
  }

  static async getByExternalId(
    logger: Logger, // this is lazy
    externalId: number
  ): Promise<Game | undefined> {
    try {
      const g = await SequelizeGameModel.findOne({
        where: {
          externalId,
        },
      });
      if (!g) {
        return undefined;
      }
      return new Game({
        ...g.toJSON(),
      });
    } catch (e) {
      logger.error("Failed to fetch Game from sqlite", {
        error: e,
        externalId,
      });
      throw e;
    }
  }
}
