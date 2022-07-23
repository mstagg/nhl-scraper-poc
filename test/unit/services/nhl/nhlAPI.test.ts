import axios from "axios";
import { NhlAPI } from "../../../../src/services/nhl";
import { Logger } from "../../../../src/utils/logger";

let logger: Logger;
let service: NhlAPI;

beforeEach(() => {
  logger = new Logger();
  service = new NhlAPI(logger);
});

describe("nhlAPI", () => {
  describe("constructor", () => {
    test("defines logger", () => {
      expect(service.logger).toEqual(logger);
    });
  });
  describe("fetchScheduleInfoForDate", () => {
    test("should fetch and return data", async () => {
      const date = new Date("2022-05-09");
      const mockRes = { data: { foo: "bar" } };
      const axiosSpy = jest.spyOn(axios, "get").mockResolvedValue(mockRes);

      const results = await service.fetchScheduleInfoForDate(date);
      expect(results).toEqual(mockRes.data);
      expect(axiosSpy).toHaveBeenCalledWith(
        "https://statsapi.web.nhl.com/api/v1/schedule?date=2022-5-9"
      );
    });
    test("should log and rethrow error", async () => {
      const date = new Date("2022-05-09");
      const error = new Error("BIG BAD ERROR");
      const loggerSpy = jest.spyOn(logger, "error");
      jest.spyOn(axios, "get").mockRejectedValue(error);

      const test = service.fetchScheduleInfoForDate(date);
      await expect(test).rejects.toThrow("BIG BAD ERROR");
      expect(loggerSpy).toHaveBeenCalledWith(
        "Failed to fetch NHL schedule data",
        {
          error,
          date,
        }
      );
    });
  });
});
