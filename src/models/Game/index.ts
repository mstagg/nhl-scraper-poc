import { DataTypes } from "sequelize";
import { GameStatusCode } from "../../services/nhl/types";
import { Logger } from "../../utils/logger";
import { sequelize } from "../sequelize";
import { ListenerStatus } from "./types";

const SequelizeGameModel = sequelize.define("Game", {
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ListenerStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

SequelizeGameModel.sync({ alter: true });

interface GameConsructorArgs {
  id?: number;
  externalId: number;
  status: GameStatusCode;
  listenerStatus: ListenerStatus;
}

interface GameSerialized {
  id: number;
  externalId: number;
  status: GameStatusCode;
  listenerStatus: ListenerStatus;
}

export class Game {
  id?: number;
  externalId: number;
  status: GameStatusCode;
  listenerStatus: ListenerStatus;

  constructor(args: GameConsructorArgs) {
    Object.assign(this, args);
  }

  toRecord() {
    return {
      id: this.id,
      externalId: this.externalId,
      status: this.status,
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
      status: this.status,
      listenerStatus: this.listenerStatus,
    };
  }

  async save() {
    SequelizeGameModel.upsert(this.toRecord());
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
