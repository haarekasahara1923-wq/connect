import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache helper functions
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Fail silently — cache is not critical
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {}
}

// Cache key constants
export const CACHE_KEYS = {
  FEATURED_INFLUENCERS: 'influencers:featured',
  PLATFORM_STATS: 'platform:stats',
  INFLUENCER_PROFILE: (slug: string) => `influencer:profile:${slug}`,
  INFLUENCER_LIST: (hash: string) => `influencers:list:${hash}`,
};
