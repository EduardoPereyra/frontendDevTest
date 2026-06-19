import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storageKey = 'itx-mobile-store:cart-count';
  private readonly countState = signal(this.restoreCount());
  readonly count = this.countState.asReadonly();

  setCount(count: number): void {
    const safeCount = Number.isFinite(count) && count >= 0 ? count : 0;
    this.countState.set(safeCount);
    try {
      localStorage.setItem(this.storageKey, String(safeCount));
    } catch {
      // The in-memory state remains valid if persistence is unavailable.
    }
  }

  private restoreCount(): number {
    try {
      const count = Number(localStorage.getItem(this.storageKey) ?? 0);
      return Number.isFinite(count) && count >= 0 ? count : 0;
    } catch {
      return 0;
    }
  }
}
