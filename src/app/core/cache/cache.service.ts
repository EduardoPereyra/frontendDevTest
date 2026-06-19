import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly prefix = 'itx-mobile-store:cache:';

  get<T>(key: string): T | null {
    try {
      const rawEntry = localStorage.getItem(this.prefix + key);
      if (!rawEntry) return null;

      const entry = JSON.parse(rawEntry) as CacheEntry<T>;
      if (Date.now() >= entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.value;
    } catch {
      this.remove(key);
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Cache failures must never make the catalogue unavailable.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Best-effort cache eviction.
    }
  }
}
