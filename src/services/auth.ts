import { withDelay } from "../lib/react-query";
import { LoginInput, User } from "../types/auth";

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const authService = {

  login: async (credentials: LoginInput) => 
    withDelay(
      fetch(`${API_URL}/users?username=${credentials.username}&password=${credentials.password}`)
        .then(res => res.json())
        .then(users => {
          const user = users[0];
          if (!user) throw new Error('Invalid credentials');
          return { user, token: 'mock-jwt-token' };
        })
    ),

  createUser: async (user: Omit<User, 'id' | 'createdAt'>) =>
    withDelay(
      fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          createdAt: new Date().toISOString(),
        }),
      }).then(res => res.json())
    ),

  getCurrentUser: async () =>
    withDelay(
      fetch(`${API_URL}/users/1`).then(res => res.json()) // For demo, using user 1 as current user
    ),
};