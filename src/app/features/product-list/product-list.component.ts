import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApiService } from '../../core/api/product-api.service';
import { ProductSummary } from '../../core/models/product.model';
import { ProductImageComponent } from '../../shared/product-image/product-image.component';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, ProductImageComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private readonly api = inject(ProductApiService);
  protected readonly products = signal<readonly ProductSummary[]>([]);
  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly filteredProducts = computed(() => {
    const normalizedQuery = this.query().trim().toLocaleLowerCase();
    if (!normalizedQuery) return this.products();
    return this.products().filter(({ brand, model }) =>
      `${brand} ${model}`.toLocaleLowerCase().includes(normalizedQuery),
    );
  });

  constructor() {
    this.loadProducts();
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected retry(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api
      .getProducts()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (products) => this.products.set(products),
        error: () => this.error.set(true),
      });
  }
}
