import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApiService } from '../../core/api/product-api.service';
import { CartStore } from '../../core/cart/cart.store';
import { ProductDetail } from '../../core/models/product.model';
import { ProductImageComponent } from '../../shared/product-image/product-image.component';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, RouterLink, ProductImageComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private readonly api = inject(ProductApiService);
  private readonly cart = inject(CartStore);

  readonly id = input.required<string>();
  protected readonly product = signal<ProductDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal(false);
  protected readonly added = signal(false);
  protected readonly selectionForm = new FormGroup({
    storageCode: new FormControl<number | null>(null, Validators.required),
    colorCode: new FormControl<number | null>(null, Validators.required),
  });

  constructor() {
    effect(() => this.loadProduct(this.id()));
  }

  protected retry(): void {
    this.loadProduct(this.id());
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product || this.selectionForm.invalid) {
      this.selectionForm.markAllAsTouched();
      return;
    }

    const { colorCode, storageCode } = this.selectionForm.getRawValue();
    if (colorCode === null || storageCode === null) return;

    this.submitting.set(true);
    this.submitError.set(false);
    this.added.set(false);
    this.api
      .addToCart({ id: product.id, colorCode, storageCode })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: ({ count }) => {
          this.cart.setCount(count);
          this.added.set(true);
        },
        error: () => this.submitError.set(true),
      });
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.api
      .getProduct(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.selectionForm.setValue({
            colorCode: product.options.colors[0]?.code ?? null,
            storageCode: product.options.storages[0]?.code ?? null,
          });
        },
        error: () => this.loadError.set(true),
      });
  }
}
