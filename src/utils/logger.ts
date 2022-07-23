export class Logger {
  constructor() {
    // assume this logger would actually point to some remote log dump
    // for purposes of this PoC, it just logs to console
  }

  info(msg: string, context?: Record<string, any>) {
    if (!context) {
      console.log(msg);
    } else {
      console.log(msg, context);
    }
  }

  warn(msg: string, context?: Record<string, any>) {
    if (!context) {
      console.warn(msg);
    } else {
      console.warn(msg, context);
    }
  }

  error(msg: string, context?: Record<string, any>) {
    if (!context) {
      console.error(msg);
    } else {
      console.error(msg, context);
    }
  }
}
