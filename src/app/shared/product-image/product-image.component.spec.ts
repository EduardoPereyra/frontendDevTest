import { TestBed } from '@angular/core/testing';
import { ProductImageComponent } from './product-image.component';

describe('ProductImageComponent', () => {
  it('renders an accessible image', () => {
    const fixture = TestBed.createComponent(ProductImageComponent);
    fixture.componentRef.setInput('src', '/phone.jpg');
    fixture.componentRef.setInput('alt', 'Acer Phone');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/phone.jpg');
    expect(image.alt).toBe('Acer Phone');
  });

  it('renders a fallback when the image fails', () => {
    const fixture = TestBed.createComponent(ProductImageComponent);
    fixture.componentRef.setInput('src', '/missing.jpg');
    fixture.componentRef.setInput('alt', 'Missing phone');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.image-unavailable').textContent).toContain(
      'Image unavailable',
    );
  });
});
