import { ProductDetail, ProductOption } from '../models/product.model';

type TextList = string | readonly string[] | null | undefined;

export interface ProductDetailDto {
  readonly id?: unknown;
  readonly brand?: unknown;
  readonly model?: unknown;
  readonly price?: unknown;
  readonly imgUrl?: unknown;
  readonly cpu?: unknown;
  readonly ram?: unknown;
  readonly os?: unknown;
  readonly displayResolution?: unknown;
  readonly displaySize?: unknown;
  readonly battery?: unknown;
  readonly primaryCamera?: TextList;
  readonly secondaryCmera?: TextList;
  readonly dimentions?: unknown;
  readonly weight?: unknown;
  readonly options?: {
    readonly colors?: readonly Partial<ProductOption>[];
    readonly storages?: readonly Partial<ProductOption>[];
  } | null;
}

export function normalizeProductDetail(dto: ProductDetailDto): ProductDetail {
  return {
    id: toText(dto.id),
    brand: toText(dto.brand),
    model: toText(dto.model),
    price: toText(dto.price),
    imgUrl: toText(dto.imgUrl),
    cpu: toText(dto.cpu),
    ram: toText(dto.ram),
    os: toText(dto.os),
    displayResolution: toText(dto.displayResolution),
    displaySize: toText(dto.displaySize),
    battery: toText(dto.battery),
    primaryCamera: toTextArray(dto.primaryCamera),
    secondaryCamera: toTextArray(dto.secondaryCmera),
    dimensions: toText(dto.dimentions),
    weight: toText(dto.weight),
    options: {
      colors: toOptions(dto.options?.colors),
      storages: toOptions(dto.options?.storages),
    },
  };
}

function toText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

function toTextArray(value: TextList): readonly string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }

  return typeof value === 'string' && value.length > 0 ? [value] : [];
}

function toOptions(options: readonly Partial<ProductOption>[] | undefined): readonly ProductOption[] {
  if (!Array.isArray(options)) return [];

  return options.flatMap((option) =>
    typeof option.code === 'number' && typeof option.name === 'string'
      ? [{ code: option.code, name: option.name }]
      : [],
  );
}
