"use client";

import { User } from "@/types/types";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";

interface UserContextType {
  user: User | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export function UserProvider({
  initialUser = null,
  children,
}: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const logout = async () => {
    await fetch("/api/auth/token", { method: "DELETE" });
    setUser(null);
    location.reload();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
