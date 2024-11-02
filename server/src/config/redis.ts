import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

// const data = await redis.set('foo', 'bar');