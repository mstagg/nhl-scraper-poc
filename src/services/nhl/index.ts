import axios from "axios";
import { Logger } from "../../utils/logger";
import { Schedule } from "./types";
import * as urls from "./urls";

export class NhlAPI {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async fetchScheduleInfoForDate(date: Date) {
    try {
      const res = await axios.get(urls.schedule({ date }));
      return res.data as Schedule;
    } catch (e) {
      this.logger.error("Failed to fetch NHL schedule data", {
        error: e,
        date,
      });
      throw e;
    }
  }
}
