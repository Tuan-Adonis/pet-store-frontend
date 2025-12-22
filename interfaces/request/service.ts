
export interface CreateServiceRequest {
  name: string;
  price: number;
  duration: number;
  description: string;
  status: number;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: number | string;
}
