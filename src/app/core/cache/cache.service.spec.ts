import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(CacheService);
  });

  it('returns a value before it expires', () => {
    service.set('products', [{ id: '1' }], 60_000);
    expect(service.get<{ id: string }[]>('products')).toEqual([{ id: '1' }]);
  });

  it('evicts expired values', () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1_000).mockReturnValueOnce(2_001);
    service.set('products', [], 1_000);
    expect(service.get('products')).toBeNull();
  });
});
