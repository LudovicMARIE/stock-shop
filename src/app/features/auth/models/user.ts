export type Role = 'admin' | 'user';
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
