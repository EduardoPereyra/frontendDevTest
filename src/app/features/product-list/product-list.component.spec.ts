import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductApiService } from '../../core/api/product-api.service';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  const products = [
    { id: '1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: '/acer.jpg' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S', price: '500', imgUrl: '/galaxy.jpg' },
  ];

  function createComponent(getProducts = vi.fn(() => of(products))) {
    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductApiService, useValue: { getProducts } },
      ],
    });

    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders every product returned by the API', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.querySelectorAll('.product-card')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.results-summary').textContent).toContain(
      '2 devices',
    );
  });

  it('filters in real time by brand and model', () => {
    const fixture = createComponent();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'galaxy';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.product-card');
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Samsung');
  });

  it('renders the empty-search state', () => {
    const fixture = createComponent();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'does not exist';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.feedback-card').textContent).toContain(
      'No matches',
    );
  });

  it('renders a retry action when loading fails', () => {
    const fixture = createComponent(vi.fn(() => throwError(() => new Error('offline'))));

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      "couldn't load",
    );
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Try again');
  });
});
