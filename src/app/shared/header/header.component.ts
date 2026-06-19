import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CartStore } from '../../core/cart/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" routerLink="/" aria-label="Mobile Store, go to products">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span>Mobile Store</span>
        </a>
        <nav aria-label="Breadcrumb">
          <ol class="breadcrumbs">
            <li><a routerLink="/">Products</a></li>
            @if (isDetail()) {
              <li class="detail-crumb">
                <span aria-hidden="true">/</span> Product detail
              </li>
            }
          </ol>
        </nav>
        <div class="cart" aria-live="polite" aria-label="Shopping bag item count">
          <span aria-hidden="true">Bag</span>
          <strong>{{ cart.count() }}</strong>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly cart = inject(CartStore);
  protected readonly isDetail = signal(this.router.url.startsWith('/product/'));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.isDetail.set(event.urlAfterRedirects.startsWith('/product/')));
  }
}
