import bunyan from "bunyan";
import { LOG } from "../../constants/loggerMessages";
import formatOut from "bunyan-format";

const formatter = formatOut({ outputMode: "short" });

/*
// Imports the Google Cloud client library for Bunyan
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

// Creates a Bunyan Cloud Logging client
const loggingBunyan = new LoggingBunyan({
    projectId: 'your-project-id',
    keyFilename: '/path/to/key.json',
    redirectToStdout: true,
});
*/

// Create a Bunyan logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
export const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Cloud Logging
  // will contain "name": "my-service"
  name: "hdfc_ergo_backend",
  streams: [
    // Log to the console at 'info' and above
    // { stream: process.stdout, level: 'info' },
    { level: "debug", stream: formatter },
    // And log to Cloud Logging, logging at 'info' and above
    // loggingBunyan.stream('info'),
    // loggingBunyan.stream('debug'),
    // loggingBunyan.stream('error'),
  ],
});

export const printLogger = ({
  LOGGER_TYPE,
  AUTH_ID,
  LOG_ID,
  FILE_NAME,
  FUNCTION_NAME,
  STATUS,
  MESSAGE,
  ETC = "",
}: any) => {
  const dynamicLogs = `${LOG.AUTH_ID} - ${AUTH_ID} | ${
    LOG.LOG_ID
  } - ${LOG_ID} | ${LOG.FILE_NAME} - ${FILE_NAME} | ${
    LOG.FUNCTION_NAME
  } - ${FUNCTION_NAME} | ${LOG.STATUS} - ${STATUS} | ${
    LOG.MESSAGE
  } - ${MESSAGE} ${ETC && "|"} ${ETC}.`;

  switch (LOGGER_TYPE) {
    case "info":
      logger.info(dynamicLogs);
      break;
    case "debug":
      logger.debug(dynamicLogs);
      break;
    case "error":
      logger.error(dynamicLogs);
      break;
    default:
      logger.info(dynamicLogs);
      break;
  }
};
