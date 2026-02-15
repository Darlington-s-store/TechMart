import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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
  password?: string;
  addresses: Address[];
  createdAt?: string;
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

  // Bootstrap async data on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          setUserToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error restoring token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        // Get all users from storage
        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];
        
        // Find user with matching email and password
        const foundUser = users.find(
          (u: User) => u.email === email && u.password === password
        );

        if (!foundUser) {
          throw new Error('Invalid email or password');
        }

        const token = `token-${foundUser.id}-${Date.now()}`;
        setUserToken(token);
        setUser(foundUser);
        setIsSignout(false);

        // Persist to storage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(foundUser));
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
        // Simple OTP validation (in real app, you'd verify against sent OTP)
        if (otp.length < 4) {
          throw new Error('Invalid OTP');
        }

        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];
        
        const foundUser = users.find((u: User) => u.phoneNumber === phone);

        if (!foundUser) {
          throw new Error('Phone number not registered');
        }

        const token = `token-${foundUser.id}-${Date.now()}`;
        setUserToken(token);
        setUser(foundUser);
        setIsSignout(false);

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(foundUser));
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
        // Get existing users
        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];

        // Check if email already exists
        const emailExists = users.some((u: User) => u.email === email);
        if (emailExists) {
          throw new Error('Email already registered');
        }

        // Check if phone already exists
        if (phoneNumber) {
          const phoneExists = users.some((u: User) => u.phoneNumber === phoneNumber);
          if (phoneExists) {
            throw new Error('Phone number already registered');
          }
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          firstName,
          lastName,
          email,
          password, // In production, this should be hashed
          phoneNumber,
          addresses: [],
          createdAt: new Date().toISOString(),
        };

        // Add to users list
        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));

        // Set as logged in
        const token = `token-${newUser.id}-${Date.now()}`;
        setUserToken(token);
        setUser(newUser);
        setIsSignout(false);

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
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
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
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
      // In real app, send OTP via email/SMS
      // For now, just simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Store OTP temporarily for verification
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      await AsyncStorage.setItem(`otp-${email}`, otp);
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
        const storedOtp = await AsyncStorage.getItem(`otp-${email}`);
        if (storedOtp !== otp) {
          throw new Error('Invalid OTP');
        }
        await AsyncStorage.removeItem(`otp-${email}`);
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
        // Verify OTP first
        const storedOtp = await AsyncStorage.getItem(`otp-${email}`);
        if (storedOtp !== otp) {
          throw new Error('Invalid OTP');
        }

        // Get users and update password
        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];
        
        const userIndex = users.findIndex((u: User) => u.email === email);
        if (userIndex === -1) {
          throw new Error('User not found');
        }

        users[userIndex].password = newPassword;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.removeItem(`otp-${email}`);
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
      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, ...data };
      
      // Update in users list
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }

      // Update current user
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

