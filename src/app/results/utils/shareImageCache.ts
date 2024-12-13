interface ShareImageCacheItem {
  dataUrl: string;
  timestamp: number;
}

class ShareImageCache {
  private cache: Map<string, ShareImageCacheItem>;
  private readonly maxAge: number; // 缓存有效期(毫秒)

  constructor(maxAge = 1000 * 60 * 5) { // 默认5分钟
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  // 获取缓存的图片
  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.dataUrl;
  }

  // 设置缓存
  set(key: string, dataUrl: string): void {
    this.cache.set(key, {
      dataUrl,
      timestamp: Date.now(),
    });
  }

  // 清除缓存
  clear(): void {
    this.cache.clear();
  }

  // 清除过期缓存
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const shareImageCache = new ShareImageCache(); 