import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../interfaces";
import { userApi } from "../api/userApi";

interface UserContextType {
  users: User[];
  isLoading: boolean;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: number | string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const addUser = async (newUser: User) => {
    await userApi.create(newUser as any);
    refreshUsers();
  };

  const updateUser = async (updatedUser: User) => {
    await userApi.update(updatedUser);
    refreshUsers();
  };

  const deleteUser = async (id: number | string) => {
    await userApi.delete(id);
    refreshUsers();
  };

  return (
    <UserContext.Provider
      value={{
        users,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
