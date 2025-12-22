
export interface CreateProductRequest {
  code?: string;
  name: string;
  categoryId: number | string;
  breedId?: number | string;
  originId?: number | string;
  age?: number;
  gender?: number;
  price: number;
  image: string;
  description: string;
  status: number;
  // stock removed
  breed?: string; // helper for UI input
  origin?: string; // helper for UI input
  category?: string; // helper for UI input
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number | string;
}
