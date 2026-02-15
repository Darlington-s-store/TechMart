import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Address {
  id: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  addresses: Address[];
}

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  isSignout: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, otp: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSignout, setIsSignout] = useState(false);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserToken('mock-token');
        setUser({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email,
          addresses: [],
        });
        setIsSignout(false);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signInWithPhone = useCallback(
    async (phone: string, otp: string) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserToken('mock-token-phone');
        setUser({
          id: '2',
          firstName: 'Guest',
          lastName: 'User',
          phoneNumber: phone,
          addresses: [],
        });
        setIsSignout(false);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      phoneNumber?: string
    ) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserToken('mock-token');
        setUser({
          id: 'new-user',
          firstName,
          lastName,
          email,
          phoneNumber,
          addresses: [],
        });
        setIsSignout(false);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserToken(null);
      setUser(null);
      setIsSignout(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOTP = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    isLoading,
    userToken,
    user,
    isSignout,
    signIn,
    signInWithPhone,
    signUp,
    signOut,
    sendOTP,
    verifyOTP,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

