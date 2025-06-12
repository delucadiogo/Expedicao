export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role_id: string; // UUID da tabela roles
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: string;
  name: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleName: 'expedição' | 'qualidade' | 'suprimentos' | 'admin'; // Role name as sent from frontend
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string; // Role name, not ID
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
} 