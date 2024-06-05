const path = require("path");
const winston = require("winston");
const { createLogger, format, transports } = winston;

const logDir = path.join(__dirname, "../logs");

const logConfig = createLogger({
  transports: [
    new transports.File({
      filename: path.join(logDir, "logs.log"),
      format: format.combine(
        format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
  ],
});

const requestMiddleware = (req, res, next) => {
  logConfig.info(`Received request: ${req.method} ${req.url}`);
  next();
};

const errorMiddleware = (err, req, res, next) => {
  logConfig.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  res.status(err.status || 500).json({ message: err.message });
};

module.exports = {
  logConfig,
  requestMiddleware,
  errorMiddleware,
};
