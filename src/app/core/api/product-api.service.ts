import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../cache/cache.service';
import {
  AddToCartRequest,
  CartResponse,
  ProductDetail,
  ProductSummary,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheService);
  private readonly baseUrl = 'https://itx-frontend-test.onrender.com/api';
  private readonly cacheTtlMs = 60 * 60 * 1_000;

  getProducts(): Observable<readonly ProductSummary[]> {
    return this.withCache(
      'products',
      this.http.get<readonly ProductSummary[]>(`${this.baseUrl}/product`),
    );
  }

  getProduct(id: string): Observable<ProductDetail> {
    return this.withCache(
      `product:${id}`,
      this.http.get<ProductDetail>(`${this.baseUrl}/product/${encodeURIComponent(id)}`),
    );
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/cart`, request);
  }

  private withCache<T>(key: string, request: Observable<T>): Observable<T> {
    const cachedValue = this.cache.get<T>(key);
    return cachedValue === null
      ? request.pipe(tap((value) => this.cache.set(key, value, this.cacheTtlMs)))
      : of(cachedValue);
  }
}
