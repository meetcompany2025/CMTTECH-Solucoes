import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/domain/entities/user.entity";
import { AuthRepository } from "@/data/repositories/auth.repository.impl";
import { UserRepository } from "@/data/repositories/user.repository.impl";
import { TokenStorage } from "@/infrastructure/storage/token-storage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create repository instances
const authRepository = new AuthRepository();
const userRepository = new UserRepository();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = async () => {
      try {
        if (TokenStorage.hasAccessToken()) {
          // Fetch current user from API
          const currentUser = await authRepository.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        // Clear invalid token
        TokenStorage.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for unauthorized events from HTTP client
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const newUser = await authRepository.register({
        email,
        password,
        username,
      });

      // After successful registration, log the user in
      const tokenResponse = await authRepository.login({
        username: email,
        password,
      });

      setUser(tokenResponse.user);
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to sign up') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const tokenResponse = await authRepository.login({
        username: email,
        password,
      });

      setUser(tokenResponse.user);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to sign in') };
    }
  };

  const signOut = async () => {
    await authRepository.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
