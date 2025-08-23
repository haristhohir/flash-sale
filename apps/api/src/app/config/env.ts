import * as dotenv from 'dotenv';

dotenv.config();

export default {
  JWT_SECRET: process.env.JWT_SECRET || '',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379
}
