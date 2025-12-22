
export interface CreateBreedRequest {
  name: string;
  categoryId: number | string;
  categoryCode?: string;
  status?: number;
}
