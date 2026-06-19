import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CacheService } from '../cache/cache.service';
import { API_CONFIG } from '../config/api.config';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let http: HttpTestingController;
  let cache: CacheService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ProductApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG, useValue: { baseUrl: 'https://example.test/api' } },
      ],
    });

    service = TestBed.inject(ProductApiService);
    http = TestBed.inject(HttpTestingController);
    cache = TestBed.inject(CacheService);
  });

  afterEach(() => http.verify());

  it('fetches and caches the product list', () => {
    const products = [
      { id: '1', brand: 'Acer', model: 'Phone', price: '100', imgUrl: '/phone.jpg' },
    ];
    let firstResult: unknown;
    let cachedResult: unknown;

    service.getProducts().subscribe((value) => (firstResult = value));
    http.expectOne('https://example.test/api/product').flush(products);
    service.getProducts().subscribe((value) => (cachedResult = value));

    expect(firstResult).toEqual(products);
    expect(cachedResult).toEqual(products);
    http.expectNone('https://example.test/api/product');
  });

  it('normalizes inconsistent detail fields before caching them', () => {
    let result: ReturnType<typeof service.getProduct> extends import('rxjs').Observable<infer T>
      ? T
      : never;

    service.getProduct('phone/1').subscribe((value) => (result = value));
    http.expectOne('https://example.test/api/product/phone%2F1').flush({
      id: 'phone/1',
      brand: 'Acer',
      model: 'Phone',
      primaryCamera: '13 MP',
      secondaryCmera: '5 MP',
      dimentions: '100 x 50 mm',
      options: { colors: [], storages: [] },
    });

    expect(result!.primaryCamera).toEqual(['13 MP']);
    expect(result!.secondaryCamera).toEqual(['5 MP']);
    expect(result!.dimensions).toBe('100 x 50 mm');
    expect(cache.get('v2:product:phone/1')).toEqual(result!);
  });

  it('posts the exact cart contract without caching it', () => {
    const request = { id: 'phone-1', colorCode: 1000, storageCode: 2000 };
    let count = 0;

    service.addToCart(request).subscribe((response) => (count = response.count));
    const httpRequest = http.expectOne('https://example.test/api/cart');

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ count: 1 });
    expect(count).toBe(1);
  });
});
