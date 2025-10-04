import pino from "pino";

export interface PinoLoggerOptions {
  level?: pino.Level;
  enabled?: boolean;
  pretty?: boolean; // when true, use pino-pretty transport (recommended for dev)
  prettyOptions?: Record<string, unknown>;
}

/**
 * PinoLogger: small wrapper around pino to provide a singleton logger
 * and convenient methods: info, warn, error, debug, fatal, child.
 */
export class PinoLogger {
  private static instance: PinoLogger | null = null;
  private logger: pino.Logger;

  private constructor(opts?: PinoLoggerOptions) {
    const level = opts?.level ?? (process.env.NODE_ENV === "production" ? "info" : "debug");
    const enabled = opts?.enabled ?? true;

    const usePretty = opts?.pretty ?? (process.env.NODE_ENV !== "production");

    if (usePretty) {
      // Use pino transport to run pino-pretty. pino.transport types can be strict,
      // so cast to any to avoid local type issues. The project already has pino-pretty installed.
      const transport = pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          ...(opts?.prettyOptions ?? {}),
        },
      } as any);

      // second argument to pino is the transport stream
      // cast to any to satisfy TS if needed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.logger = pino({ level, enabled } as any, transport as any);
    } else {
      this.logger = pino({ level, enabled });
    }
  }

  /**
   * Returns the singleton instance. If it doesn't exist, creates it with the provided options.
   */
  static getInstance(opts?: PinoLoggerOptions) {
    PinoLogger.instance ??= new PinoLogger(opts);
    return PinoLogger.instance;
  }

  info(message: string, meta?: Record<string, unknown>) {
    if (meta) this.logger.info(meta, message);
    else this.logger.info(message);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    if (meta) this.logger.warn(meta, message);
    else this.logger.warn(message);
  }

  error(message: string | Error, meta?: Record<string, unknown>) {
    if (message instanceof Error) {
      // Avoid calling logger.error(meta, Error) because of overloads.
      // Attach the Error under `err` when meta is provided so pino can serialize it.
      if (meta) this.logger.error({ ...meta, err: message }, message.message);
      else this.logger.error(message);
      return;
    }
    if (meta) this.logger.error(meta, message);
    else this.logger.error(message);
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (meta) this.logger.debug(meta, message);
    else this.logger.debug(message);
  }

  fatal(message: string | Error, meta?: Record<string, unknown>) {
    if (message instanceof Error) {
      if (meta) this.logger.fatal({ ...meta, err: message }, message.message);
      else this.logger.fatal(message);
      return;
    }
    if (meta) this.logger.fatal(meta, message);
    else this.logger.fatal(message);
  }

  /**
   * Create a child logger with bound properties. Returns a new PinoLogger wrapping the child.
   */
  child(bindings: Record<string, unknown>) {
    const child = this.logger.child(bindings);
    const wrapper = Object.create(PinoLogger.prototype) as PinoLogger;
    wrapper.logger = child;
    return wrapper;
  }

  raw() {
    return this.logger;
  }
}

export default PinoLogger;
