import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductApiService } from '../../core/api/product-api.service';
import { CartStore } from '../../core/cart/cart.store';
import { ProductDetail } from '../../core/models/product.model';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  const product: ProductDetail = {
    id: 'phone-1',
    brand: 'Acer',
    model: 'Liquid Z6 Plus',
    price: '250',
    imgUrl: '/phone.jpg',
    cpu: 'Octa-core',
    ram: '3 GB',
    os: 'Android',
    displayResolution: '5.5 inches',
    displaySize: '1080 x 1920',
    battery: '4080 mAh',
    primaryCamera: ['13 MP', 'autofocus'],
    secondaryCamera: ['5 MP'],
    dimensions: '153 x 75 mm',
    weight: '169',
    options: {
      colors: [
        { code: 1000, name: 'Black' },
        { code: 1001, name: 'White' },
      ],
      storages: [{ code: 2000, name: '32 GB' }],
    },
  };

  function createComponent(options?: {
    getProduct?: ReturnType<typeof vi.fn>;
    addToCart?: ReturnType<typeof vi.fn>;
    incrementBy?: ReturnType<typeof vi.fn>;
  }): ComponentFixture<ProductDetailComponent> {
    const getProduct = options?.getProduct ?? vi.fn(() => of(product));
    const addToCart = options?.addToCart ?? vi.fn(() => of({ count: 1 }));
    const incrementBy = options?.incrementBy ?? vi.fn();

    TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ProductApiService, useValue: { getProduct, addToCart } },
        { provide: CartStore, useValue: { incrementBy } },
      ],
    });

    const fixture = TestBed.createComponent(ProductDetailComponent);
    fixture.componentRef.setInput('id', product.id);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders all required details and selects the first options', () => {
    const fixture = createComponent();
    const selects = fixture.nativeElement.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(product.model);
    expect(fixture.nativeElement.querySelector('.spec-grid').textContent).toContain('13 MP');
    expect(selects[0].value).toContain('2000');
    expect(selects[1].value).toContain('1000');
  });

  it('sends the selected configuration and increments the persisted cart', () => {
    const addToCart = vi.fn(() => of({ count: 1 }));
    const incrementBy = vi.fn();
    const fixture = createComponent({ addToCart, incrementBy });

    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(addToCart).toHaveBeenCalledWith({
      id: product.id,
      colorCode: 1000,
      storageCode: 2000,
    });
    expect(incrementBy).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelector('.success-message').textContent).toContain('Added');
  });

  it('renders an add-to-cart error without mutating the cart', () => {
    const incrementBy = vi.fn();
    const fixture = createComponent({
      addToCart: vi.fn(() => throwError(() => new Error('failed'))),
      incrementBy,
    });

    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(incrementBy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.error-message').textContent).toContain(
      "couldn't add",
    );
  });

  it('renders the load-error state', () => {
    const fixture = createComponent({
      getProduct: vi.fn(() => throwError(() => new Error('missing'))),
    });

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      "couldn't load",
    );
  });
});
