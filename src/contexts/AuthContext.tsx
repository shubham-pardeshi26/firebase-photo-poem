
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/schemas/user'; // We'll create this schema for frontend
import { loginUser, registerUser, getCurrentUser, type LoginCredentials, type RegisterCredentials } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check for existing token
  const router = useRouter();
  const { toast } = useToast();

  const storeToken = (accessToken: string) => {
    setToken(accessToken);
    // Store token in cookie for middleware and SSR
    document.cookie = `photoPoetToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days
  };

  const removeToken = () => {
    setToken(null);
    document.cookie = 'photoPoetToken=; path=/; max-age=0; SameSite=Lax';
  };
  
  const fetchUser = useCallback(async (currentToken: string) => {
    if (!currentToken) {
        setIsLoading(false);
        return;
    }
    try {
      const userData = await getCurrentUser(currentToken);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      removeToken(); // Token might be invalid or expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    const storedToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('photoPoetToken='))
        ?.split('=')[1];
    
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);


  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { access_token } = await loginUser(credentials);
      storeToken(access_token);
      await fetchUser(access_token); // Fetch user info after login
      router.push('/');
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      console.error("Login failed:", error);
      removeToken();
      setUser(null);
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "Invalid credentials or server error." });
      throw error; // Re-throw to allow form to handle error state
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      await registerUser(credentials);
      toast({ title: "Registration Successful", description: "Please log in with your new account." });
      router.push('/login');
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({ variant: "destructive", title: "Registration Failed", description: error.message || "Could not create account." });
      throw error; // Re-throw
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    router.push('/login');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    