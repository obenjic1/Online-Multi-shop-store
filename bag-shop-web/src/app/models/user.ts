export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_SUPER_ADMIN';

export interface User {
  id: number;
  username: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  enabled: boolean;
}

export interface CreateUserRequest {
  username: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  username: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role: UserRole;
}
