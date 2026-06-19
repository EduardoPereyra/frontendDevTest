export interface ProductSummary {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly price: string;
  readonly imgUrl: string;
}

export interface ProductOption {
  readonly code: number;
  readonly name: string;
}

export interface ProductDetail extends ProductSummary {
  readonly cpu: string;
  readonly ram: string;
  readonly os: string;
  readonly displayResolution: string;
  readonly displaySize: string;
  readonly battery: string;
  readonly primaryCamera: readonly string[];
  readonly secondaryCmera: readonly string[];
  readonly dimentions: string;
  readonly weight: string;
  readonly options: {
    readonly colors: readonly ProductOption[];
    readonly storages: readonly ProductOption[];
  };
}

export interface AddToCartRequest {
  readonly id: string;
  readonly colorCode: number;
  readonly storageCode: number;
}

export interface CartResponse {
  readonly count: number;
}
