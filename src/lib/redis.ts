import { Redis } from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('error', (error) => {
  console.error('Redis连接错误:', error);
});

redisClient.on('connect', () => {
  console.log('Redis连接成功');
});

export const redis = redisClient; 