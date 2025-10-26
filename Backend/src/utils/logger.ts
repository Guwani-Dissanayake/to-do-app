class Logger {
  private static format(level: string, args: any[]) {
    const ts = new Date().toISOString();
    const prefix = `[${level}] ${ts} -`;
    return [prefix, ...args];
  }

  static info(...args: any[]) {
    console.info(...Logger.format("INFO", args));
  }

  static warn(...args: any[]) {
    console.warn(...Logger.format("WARN", args));
  }

  static error(...args: any[]) {
    console.error(...Logger.format("ERROR", args));
  }

  static debug(...args: any[]) {
    if (process.env.DEBUG) {
      console.debug(...Logger.format("DEBUG", args));
    }
  }
}

export default Logger;
