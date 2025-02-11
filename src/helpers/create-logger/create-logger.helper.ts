import log, { LogLevelDesc } from 'loglevel';

import { shouldDebug as defaultShouldDebug } from '../should-debug/should-debug.helper';
import type { ShouldDebug } from '../should-debug/should-debug.helper';

type OnMessageOptions = {
  level: LogLevelDesc;
  timestamp: string;
  payload: object;
  message: string;
};

type OnAfterMessageOptions = {
  level: LogLevelDesc;
  timestamp: string;
  payload: object;
  message: string;
};

type CreateLoggerOptions = {
  /**
   * @description
   * Use this to set the default log level.
   *
   * Note: Debug level logs are controlled via URL search parameters. Please check `allTag` and `debugSearchParameterName` if you wish to customize the behavior.
   */
  level: LogLevelDesc;
  /**
   * @description
   * Use this to set the "catch-all" tag for debugging purposes.
   *
   * Defaults to "all".
   *
   * @example
   * const logger = createLogger({
   *  allTag: "all" // or any other joker string you'd like to use.
   * });
   *
   * // You are able to see all the debug level logs by setting your search params to `?debug=all`.
   */
  allTag?: string;
  /**
   * @description
   * Use this to set the name of the search parameter which signals the debug logs should be printed.
   *
   * Defaults to "debug".
   *
   * @example
   * const logger = createLogger({
   *  ...,
   *  debugSearchParameterName: "debug" // or any other string you'd like to use.
   * });
   *
   * logger.debug("auth-module", { ok: true }, "Systems online.")
   *
   * // In order to print the log you'd need to update your URL with this search parameter `?debug=auth-module`.
   */
  debugSearchParameterName?: string;
  /**
   * @description
   * Use this to set a custom function that determines if a debug level log should be printed or not.
   */
  shouldDebug?: ShouldDebug;
  /**
   * @description
   * Use this to set an emoji for the debug level logs.
   *
   * Defaults to 🕵️.
   */
  debugEmoji?: string;
  /**
   * @description
   * Use this to set an emoji for the error logs.
   *
   * Defaults to 📕.
   */
  errorEmoji?: string;
  /**
   * @description
   * Use this to set an emoji for the info level logs.
   *
   * Defaults to 📘.
   */
  infoEmoji?: string;
  /**
   * @description
   * Use this to set an emoji for the trace level logs.
   *
   * Defaults to 📓.
   */
  traceEmoji?: string;
  /**
   * @description
   * Use this to set an emoji for the warn level logs.
   *
   * Defaults to 📒.
   */
  warnEmoji?: string;
  /**
   * @description
   * Use this to have fine-graned control over the message being rendered.
   */
  onMessage?: (options: OnMessageOptions) => string;
  /**
   * @description
   * Use this to perform a side-effect once the message has been printed.
   */
  onAfterMessage?: (options: OnAfterMessageOptions) => void;
};

export const createLogger = (options: CreateLoggerOptions) => {
  const {
    level,
    allTag = 'all',
    debugSearchParameterName = 'debug',
    shouldDebug = defaultShouldDebug,
    debugEmoji = '🕵',
    errorEmoji = '📕',
    infoEmoji = '📘',
    traceEmoji = '📓',
    warnEmoji = '📒',
    onMessage,
    onAfterMessage,
  } = options;

  log.setDefaultLevel(level);

  const logger = {
    debug(tag: string, object: object, message: string) {
      if (!shouldDebug({ tag, allTag, debugSearchParameterName })) {
        return;
      }

      const timestamp = new Date().toISOString();

      const debugMessage = onMessage
        ? onMessage({
            level: 'DEBUG',
            timestamp,
            payload: object,
            message,
          })
        : `${debugEmoji || '🕵'} [${timestamp}] [DEBUG] [${tag}] ${message}`;

      log.debug(debugMessage, object);

      onAfterMessage?.({
        level: 'DEBUG',
        timestamp,
        payload: object,
        message,
      });
    },
    error(object: object, message: string) {
      const timestamp = new Date().toISOString();

      const errorMessage = onMessage
        ? onMessage({
            level: 'ERROR',
            timestamp,
            payload: object,
            message,
          })
        : `${errorEmoji || '📕'} [${timestamp}] [ERROR] ${message}`;

      log.error(errorMessage, object);

      onAfterMessage?.({
        level: 'ERROR',
        timestamp,
        payload: object,
        message,
      });
    },
    info(object: object, message: string) {
      const timestamp = new Date().toISOString();

      const infoMessage = onMessage
        ? onMessage({
            level: 'INFO',
            timestamp,
            payload: object,
            message,
          })
        : `${infoEmoji || '📘'} [${timestamp}] [INFO] ${message}`;

      log.info(infoMessage, object);

      onAfterMessage?.({
        level: 'INFO',
        timestamp,
        payload: object,
        message,
      });
    },
    trace(object: object, message: string) {
      const timestamp = new Date().toISOString();

      const traceMessage = onMessage
        ? onMessage({
            level: 'TRACE',
            timestamp,
            payload: object,
            message,
          })
        : `${traceEmoji || '📓'} [${timestamp}] [TRACE] ${message}`;

      log.trace(traceMessage, object);

      onAfterMessage?.({
        level: 'TRACE',
        timestamp,
        payload: object,
        message: message,
      });
    },
    warn(object: object, message: string) {
      const timestamp = new Date().toISOString();

      const warningMessage = onMessage
        ? onMessage({
            level: 'WARN',
            timestamp,
            payload: object,
            message,
          })
        : `${warnEmoji || '📒'} [${timestamp}] [WARN] ${message}`;

      log.warn(warningMessage, object);

      onAfterMessage?.({
        level: 'WARN',
        timestamp,
        payload: object,
        message: warningMessage,
      });
    },
  } as const;

  return logger;
};
