import { useQuery, useMutation } from '@tanstack/react-query';
import { authService, LoginInput } from '../services/auth';

export function useAuth() {
  return {
    login: useMutation({
      mutationFn: (data: LoginInput) => authService.login(data),
    }),

    currentUser: useQuery({
      queryKey: ['auth', 'currentUser'],
      queryFn: authService.getCurrentUser,
    }),
  };
}