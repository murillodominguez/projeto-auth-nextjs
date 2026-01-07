import Redis from "ioredis"

export const redisClient = new Redis("redis://127.0.0.1:6379")