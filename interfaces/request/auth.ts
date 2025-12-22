export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password?: string;
  roleId: number;
}
