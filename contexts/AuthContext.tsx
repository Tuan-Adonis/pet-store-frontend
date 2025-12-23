import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../interfaces";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { useAddress } from "./AddressContext";
import { LoginRequest, RegisterRequest } from "../interfaces/request/auth";
import { useNotification } from "./NotificationContext";

interface AuthContextType {
  user: User | null;
  login: (req: LoginRequest) => Promise<boolean>;
  register: (req: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: User) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
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
    const loggedUser = await authApi.login(req);
    if (loggedUser !== null) {
      notify("success", "Đăng nhập thành công");
      setUser(loggedUser);
      return loggedUser;
    }
  };

  const register = async (req: RegisterRequest) => {
    const newUser = await authApi.register(req);
    if (newUser === 0) {
      notify("error", "Đăng ký thất bại");
    } else if (newUser === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (newUser === 1) {
      notify("success", "Đăng ký thành công");
      return true;
    }
    return false;
  };

  const logout = async (id: number) => {
    const res = await authApi.logout(id);
    if (res === 0) {
      notify("error", "Đăng xuất thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy tài khoản");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đăng xuất thành công");
      setUser(null);
    }
  };

  const updateProfile = async (updatedUser: User) => {
    const res = await authApi.updateProfile(updatedUser);
    if (res === 0) {
      notify("error", "Cập nhật thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy tài khoản");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Cập nhật thành công");
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
