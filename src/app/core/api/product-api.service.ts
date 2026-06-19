import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { CacheService } from '../cache/cache.service';
import { API_CONFIG } from '../config/api.config';
import { normalizeProductDetail, ProductDetailDto } from './product-detail.mapper';
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
  private readonly config = inject(API_CONFIG);
  private readonly cacheTtlMs = 60 * 60 * 1_000;

  getProducts(): Observable<readonly ProductSummary[]> {
    return this.withCache(
      'products',
      this.http.get<readonly ProductSummary[]>(`${this.config.baseUrl}/product`),
    );
  }

  getProduct(id: string): Observable<ProductDetail> {
    return this.withCache(
      `v2:product:${id}`,
      this.http
        .get<ProductDetailDto>(`${this.config.baseUrl}/product/${encodeURIComponent(id)}`)
        .pipe(map(normalizeProductDetail)),
    );
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.config.baseUrl}/cart`, request);
  }

  private withCache<T>(key: string, request: Observable<T>): Observable<T> {
    const cachedValue = this.cache.get<T>(key);
    return cachedValue === null
      ? request.pipe(tap((value) => this.cache.set(key, value, this.cacheTtlMs)))
      : of(cachedValue);
  }
}
