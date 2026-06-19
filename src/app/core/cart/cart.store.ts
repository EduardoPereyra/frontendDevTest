import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storageKey = 'itx-mobile-store:cart-count';
  private readonly countState = signal(this.restoreCount());
  readonly count = this.countState.asReadonly();

  incrementBy(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) return;

    const nextCount = this.countState() + quantity;
    this.countState.set(nextCount);
    try {
      localStorage.setItem(this.storageKey, String(nextCount));
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
