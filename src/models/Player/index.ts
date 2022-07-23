import { DataTypes } from "sequelize";
import { Logger } from "../../utils/logger";
import { sequelize } from "../sequelize";

export const SequelizePlayerModel = sequelize.define("Player", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  externalPlayerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  externalGameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assists: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  minutes: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export interface PlayerConsructorArgs {
  id?: number;
  externalPlayerId: number;
  externalGameId: number;
  teamId: number;
  teamName: string;
  age: number;
  number: string;
  position: string;
  assists: number;
  goals: number;
  hits: number;
  points: number;
  minutes: string;
}

interface PlayerSerialized {
  id: number;
  externalPlayerId: number;
  externalGameId: number;
  teamId: number;
  teamName: string;
  age: number;
  number: string;
  position: string;
  assists: number;
  goals: number;
  hits: number;
  points: number;
  minutes: string;
}

export class Player {
  id?: number;
  externalPlayerId: number;
  externalGameId: number;
  teamId: number;
  teamName: string;
  age: number;
  number: string;
  position: string;
  assists: number;
  goals: number;
  hits: number;
  points: number;
  minutes: string;

  constructor(args: PlayerConsructorArgs) {
    Object.assign(this, args);
  }

  toRecord() {
    return {
      id: this.id,
      externalPlayerId: this.externalPlayerId,
      externalGameId: this.externalGameId,
      teamId: this.teamId,
      teamName: this.teamName,
      age: this.age,
      number: this.number,
      position: this.position,
      assists: this.assists,
      goals: this.goals,
      hits: this.hits,
      points: this.points,
      minutes: this.minutes,
    };
  }

  serialize(): PlayerSerialized {
    if (!this.id) {
      throw new Error("Id Not Found");
    }
    return {
      id: this.id,
      externalPlayerId: this.externalPlayerId,
      externalGameId: this.externalGameId,
      teamId: this.teamId,
      teamName: this.teamName,
      age: this.age,
      number: this.number,
      position: this.position,
      assists: this.assists,
      goals: this.goals,
      hits: this.hits,
      points: this.points,
      minutes: this.minutes,
    };
  }

  async save(
    logger: Logger // this is lazy
  ) {
    try {
      const p = await SequelizePlayerModel.upsert(this.toRecord());
      this.id = p[0].toJSON().id;
    } catch (e) {
      logger.error("Failed to upsert Player into sqlite", {
        error: e,
      });
      throw e;
    }
  }

  static async getByExternalId(
    logger: Logger, // this is lazy
    externalPlayerId: number,
    externalGameId: number
  ): Promise<Player | undefined> {
    try {
      const p = await SequelizePlayerModel.findOne({
        where: {
          externalPlayerId,
          externalGameId,
        },
      });
      if (!p) {
        return undefined;
      }
      return new Player({
        ...p.toJSON(),
      });
    } catch (e) {
      logger.error("Failed to fetch Player from sqlite", {
        error: e,
        externalPlayerId,
        externalGameId,
      });
      throw e;
    }
  }
}
