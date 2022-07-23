import {
  Game,
  GameConsructorArgs,
  SequelizeGameModel,
} from "../../../../src/models/Game";
import { ListenerStatus } from "../../../../src/models/Game/types";
import { GameStatusCode } from "../../../../src/services/nhl/types";
import { Logger } from "../../../../src/utils/logger";

let logger: Logger;
let model: Game;

const DEFAULT_PARAMS: GameConsructorArgs = {
  id: 100,
  externalId: 2017020659,
  gameStatus: GameStatusCode.final,
  listenerStatus: ListenerStatus.inactive,
};

beforeEach(() => {
  logger = new Logger();
  model = new Game(DEFAULT_PARAMS);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Game", () => {
  describe("constructor", () => {
    test("defines correct props", () => {
      expect(model.id).toEqual(DEFAULT_PARAMS.id);
      expect(model.externalId).toEqual(DEFAULT_PARAMS.externalId);
      expect(model.gameStatus).toEqual(DEFAULT_PARAMS.gameStatus);
      expect(model.listenerStatus).toEqual(DEFAULT_PARAMS.listenerStatus);
    });
  });
  describe("toRecord", () => {
    test("should return a serialized record", async () => {
      const expected = {
        id: DEFAULT_PARAMS.id,
        externalId: DEFAULT_PARAMS.externalId,
        listenerStatus: DEFAULT_PARAMS.listenerStatus,
        gameStatus: DEFAULT_PARAMS.gameStatus,
      };

      const results = model.toRecord();
      expect(results).toEqual(expected);
    });
  });
  describe("serialize", () => {
    test("should return a serialized object", async () => {
      const expected = {
        id: DEFAULT_PARAMS.id,
        externalId: DEFAULT_PARAMS.externalId,
        listenerStatus: DEFAULT_PARAMS.listenerStatus,
        gameStatus: DEFAULT_PARAMS.gameStatus,
      };

      const results = model.serialize();
      expect(results).toEqual(expected);
    });
    test("should throw if id is undefined", async () => {
      model = new Game({ ...DEFAULT_PARAMS, id: undefined });
      const test = () => model.serialize();
      expect(test).toThrow("Id Not Found");
    });
  });
  describe("save", () => {
    test("should call sequelize upsert with correct params", async () => {
      const sequelizeSpy = jest
        .spyOn(SequelizeGameModel, "upsert")
        .mockResolvedValue([{ toJSON: () => ({ ...DEFAULT_PARAMS }) }] as any);

      await model.save(logger);
      expect(sequelizeSpy).toHaveBeenCalledWith(model.toRecord());
    });
    test("should log and rethrow on failure", async () => {
      const error = new Error("BIG BAD ERROR");
      const loggerSpy = jest.spyOn(logger, "error");
      jest.spyOn(SequelizeGameModel, "upsert").mockRejectedValue(error);

      const test = model.save(logger);
      await expect(test).rejects.toThrow("BIG BAD ERROR");
      expect(loggerSpy).toHaveBeenCalledWith(
        "Failed to upsert Game into sqlite",
        {
          error,
        }
      );
    });
  });
  describe("getByExternalId", () => {
    test("should return undefined when no results are found", async () => {
      const sequelizeSpy = jest
        .spyOn(SequelizeGameModel, "findOne")
        .mockResolvedValue(undefined as any);

      const result = await Game.getByExternalId(logger, 123);
      expect(sequelizeSpy).toHaveBeenCalledWith({
        where: { externalId: 123 },
      });
      expect(result).toEqual(undefined);
    });
    test("should return Game model result is found", async () => {
      const sequelizeSpy = jest
        .spyOn(SequelizeGameModel, "findOne")
        .mockResolvedValue({ toJSON: () => ({ ...DEFAULT_PARAMS }) } as any);

      const result = await Game.getByExternalId(logger, 123);
      expect(sequelizeSpy).toHaveBeenCalledWith({
        where: { externalId: 123 },
      });
      expect(result).toEqual(new Game(DEFAULT_PARAMS));
    });
    test("should log and rethrow on failure", async () => {
      const error = new Error("BIG BAD ERROR");
      const loggerSpy = jest.spyOn(logger, "error");
      jest.spyOn(SequelizeGameModel, "findOne").mockRejectedValue(error);

      const test = Game.getByExternalId(logger, 123);
      await expect(test).rejects.toThrow("BIG BAD ERROR");
      expect(loggerSpy).toHaveBeenCalledWith(
        "Failed to fetch Game from sqlite",
        {
          error,
          externalId: 123,
        }
      );
    });
  });
});
