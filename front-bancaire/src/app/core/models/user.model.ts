export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}