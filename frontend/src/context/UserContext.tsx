"use client";

import { User } from "@/types/types";
import { useRouter, usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
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
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/token", { method: "DELETE" });
    setUser(null);
    location.reload();
  };

  const unsecurePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/",
  ];
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !user &&
      !unsecurePaths.includes(pathname)
    ) {
      router.push("/login");
    } else if (
      typeof window !== "undefined" &&
      user &&
      !user.onBoardingComplete &&
      !unsecurePaths.includes(pathname)
    ) {
      router.push("/signup/preferences");
    } else if (
      typeof window !== "undefined" &&
      user &&
      user.onBoardingComplete &&
      pathname === "/signup/preferences"
    ) {
      router.push("/home");
    }
  }, [user, router, pathname]);

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
