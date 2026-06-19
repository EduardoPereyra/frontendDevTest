import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class EmptyRouteComponent {}

describe('HeaderComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([{ path: 'product/:id', component: EmptyRouteComponent }]),
      ],
    });
  });

  it('renders the persisted bag count', () => {
    localStorage.setItem('itx-mobile-store:cart-count', '3');
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cart strong').textContent).toBe('3');
  });

  it('adds the detail breadcrumb after navigation', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/product/phone-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.detail-crumb').textContent).toContain(
      'Product detail',
    );
  });
});
