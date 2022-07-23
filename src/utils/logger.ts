export class Logger {
  constructor() {
    // assume this logger would actually point to some remote log dump
    // for purposes of this POC, it just logs to console
  }

  info(msg: string, context?: Record<string, any>) {
    console.log(msg, context);
  }

  warn(msg: string, context?: Record<string, any>) {
    console.warn(msg, context);
  }

  error(msg: string, context?: Record<string, any>) {
    console.error(msg, context);
  }
}
