import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('accumulates quantities returned by the cart API', () => {
    const store = TestBed.inject(CartStore);

    store.incrementBy(1);
    store.incrementBy(1);
    store.incrementBy(2);

    expect(store.count()).toBe(4);
    expect(localStorage.getItem('itx-mobile-store:cart-count')).toBe('4');
  });

  it('restores the persisted count', () => {
    localStorage.setItem('itx-mobile-store:cart-count', '3');

    const store = TestBed.inject(CartStore);

    expect(store.count()).toBe(3);
  });

  it('ignores invalid quantities', () => {
    const store = TestBed.inject(CartStore);

    store.incrementBy(0);
    store.incrementBy(-1);
    store.incrementBy(Number.NaN);

    expect(store.count()).toBe(0);
  });
});
