import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-product-image',
  template: `
    <div class="product-image" [class.image-unavailable]="failed()">
      @if (!failed()) {
        <img
          [src]="src()"
          [alt]="alt()"
          loading="lazy"
          decoding="async"
          (error)="failed.set(true)"
        />
      } @else {
        <span>Image unavailable</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  protected readonly failed = signal(false);
}
