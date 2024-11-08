export interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    createdAt: string;
  }
  
  export interface LoginInput {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }

  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }