import { normalizeProductDetail } from './product-detail.mapper';

describe('normalizeProductDetail', () => {
  const baseProduct = {
    id: 'phone-1',
    brand: 'Acer',
    model: 'Liquid Z6 Plus',
    options: {
      colors: [{ code: 1000, name: 'Black' }],
      storages: [{ code: 2000, name: '32 GB' }],
    },
  };

  it('normalizes camera strings to arrays', () => {
    const product = normalizeProductDetail({
      ...baseProduct,
      primaryCamera: ['13 MP', 'autofocus'],
      secondaryCmera: '5 MP',
    });

    expect(product.primaryCamera).toEqual(['13 MP', 'autofocus']);
    expect(product.secondaryCamera).toEqual(['5 MP']);
  });

  it('uses safe defaults for missing optional data', () => {
    const product = normalizeProductDetail(baseProduct);

    expect(product.secondaryCamera).toEqual([]);
    expect(product.battery).toBe('');
  });
});
