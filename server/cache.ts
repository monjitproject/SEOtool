import dotenv from "dotenv";

dotenv.config();

// Standard Cache Item
interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

class CacheService {
  private memoryStore = new Map<string, CacheItem<any>>();
  private isRedisMocked = true;
  private redisClient: any = null;

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      console.log("[Cache] Found REDIS_URL. Attempting lazy loading of redis package...");
      try {
        // Attempt dynamic import to avoid blocking compile if dependencies are being resolved
        // @ts-ignore
        const { createClient } = await import("redis");
        this.redisClient = createClient({ url: redisUrl });
        await this.redisClient.connect();
        this.isRedisMocked = false;
        console.log("[Cache] Redis database client connected successfully.");
      } catch (err: any) {
        console.warn(
          "[Cache] Redis client connection failed (falling back to memory cache):",
          err.message
        );
        this.isRedisMocked = true;
      }
    } else {
      console.log("[Cache] REDIS_URL not set. Running on local Memory Cache engine.");
    }
  }

  /**
   * Set cache entry
   * @param key cache name key
   * @param value data value to store
   * @param ttlSeconds TTL in seconds (defaults to 86400 / 24 hours)
   */
  public async set<T>(key: string, value: T, ttlSeconds: number = 86400): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryStore.set(key, { value, expiresAt });

    if (!this.isRedisMocked && this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), {
          EX: ttlSeconds
        });
      } catch (err) {
        console.error("[Cache] Failed to write to Redis cache:", err);
      }
    }
  }

  /**
   * Get cache entry
   * @param key cache key
   */
  public async get<T>(key: string): Promise<T | null> {
    // 1. Try Memory Store first
    const memoryItem = this.memoryStore.get(key);
    if (memoryItem) {
      if (memoryItem.expiresAt > Date.now()) {
        return memoryItem.value as T;
      } else {
        // Expired
        this.memoryStore.delete(key);
      }
    }

    // 2. Try Redis if connected
    if (!this.isRedisMocked && this.redisClient) {
      try {
        const value = await this.redisClient.get(key);
        if (value) {
          const parsed = JSON.parse(value);
          // Revive memory cache to avoid unnecessary Redis I/O
          const ttlSeconds = 3600; // default 1 hour buffer on revive
          this.memoryStore.set(key, { value: parsed, expiresAt: Date.now() + ttlSeconds * 1000 });
          return parsed as T;
        }
      } catch (err) {
        console.error("[Cache] Failed to read from Redis cache:", err);
      }
    }

    return null;
  }

  /**
   * Clear cache entry
   * @param key cache key
   */
  public async delete(key: string): Promise<void> {
    this.memoryStore.delete(key);
    if (!this.isRedisMocked && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {
        console.error("[Cache] Redis delete failed:", err);
      }
    }
  }

  /**
   * Clear all cache states
   */
  public async flush(): Promise<void> {
    this.memoryStore.clear();
    if (!this.isRedisMocked && this.redisClient) {
      try {
        await this.redisClient.flushAll();
      } catch (err) {
        console.error("[Cache] Redis flush all failed:", err);
      }
    }
  }
}

export const cacheService = new CacheService();
