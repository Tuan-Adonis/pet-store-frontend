
export interface CreateCategoryRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number | string;
}
