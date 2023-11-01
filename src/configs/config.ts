export const Config = {
  PORT: parseInt(process.env.PORT),
  TYPE: process.env.TYPE,
  ENV: process.env.ENV,
  SERVICE_NAME: process.env.SERVICE_NAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT),
  RATE_LIMIT_TTL: parseInt(process.env.RATE_LIMIT_TTL),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX),
};
