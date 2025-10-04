import PinoLogger from "./pinoLogger";

// default singleton instance — can be imported as `logger`.
export const logger = PinoLogger.getInstance();

export function createLogger(opts?: Parameters<typeof PinoLogger.getInstance>[0]) {
  return PinoLogger.getInstance(opts);
}

export default logger;
