
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../interfaces';
import { authApi } from '../contexts/authApi';
import { userApi } from '../api/userApi';
import { useAddress } from './AddressContext';
import { LoginRequest, RegisterRequest } from '../interfaces/request/auth';

interface AuthContextType {
  user: User | null;
  login: (req: LoginRequest) => Promise<boolean>;
  register: (req: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: User) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loadAddresses, userAddresses } = useAddress();

  // Whenever user changes, load their addresses
  useEffect(() => {
      if (user) {
          loadAddresses(user.id);
      }
  }, [user]);

  const login = async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedUser = await authApi.login(req);
      if (loggedUser) {
        setUser(loggedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest) => {
    setIsLoading(true);
    try {
      const newUser = await authApi.register(req);
      if (newUser) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updatedUser: User) => {
    setIsLoading(true);
    try {
      const res = await userApi.update(updatedUser);
      if (user?.id === res.id) {
        setUser(res);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateProfile, 
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
