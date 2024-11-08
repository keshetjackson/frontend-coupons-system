import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../src/services/auth';
import { LoginInput, User } from '../src/types/auth';


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginInput) => {
        set({ loading: true, error: null });
        
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Invalid credentials',
            loading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          set({ user: null, token: null, loading: false });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// Selector hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    loading: store.loading,
    error: store.error,
    isAuthenticated: !!store.user,
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
  };
};