
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../interfaces/models';
import { roleApi } from '../api/roleApi';

interface RoleContextType {
  roles: Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const load = async () => setRoles(await roleApi.getAll());
    load();
  }, []);

  return (
    <RoleContext.Provider value={{ roles }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
};
