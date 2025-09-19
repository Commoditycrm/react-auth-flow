import { createLogger, format, transports } from 'winston';

const productionLogger = () => {
  const { timestamp, combine, printf, errors, splat } = format;

  const line = printf(({ level, message, timestamp, stack, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${level}] ${timestamp} ${stack ?? message}${extra}`;
  });

  return createLogger({
    level: 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      splat(),
      line,
    ),
    transports: [
      new transports.Console({ level: 'info' }),
      new transports.File({ filename: 'myErrors.log' }),
    ],
  });
};

export default productionLogger;
