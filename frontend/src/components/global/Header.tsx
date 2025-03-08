"use client";

import SafeArea from "./SafeArea";
import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/Dropdown";
import { Button } from "../shadcn/Button";
import { User } from "@/types/types";
import { CircleUser, LogOut, Settings } from "lucide-react";

function ProfileDropdown({ user, logout }: { user: User; logout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 aspect-square rounded-full bg-gray-100 border font-bold text-gray-500">{user.name[0]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user" className="flex justify-between items-center w-full">
              Profile
              <CircleUser size={20}/>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex justify-between items-center w-full"
            >
              Settings
              <Settings size={20} />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between items-center w-full text-red-500" onClick={logout}>
          Log out
          <LogOut size={20}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ className }: { className?: string }) {
  const { user, logout } = useUser();
  return (
    <SafeArea
      className={`flex justify-between py-4 items-center min-h-12 bg-white border-b ${className}`}
    >
      <Link
        href="/"
        className="tracking-tighter uppercase text-xl font-bold font-sans text-blue-500 hover:scale-[101%] transition-transform duration-100 ease-out"
      >
        <span className="text-yellow-400">Room</span>inate
      </Link>
      <nav className={`gap-4 h-full items-center flex`}>
        <Link href="/home">Home</Link>
        <Link href="/home">Browse</Link>
        {!user ? (
          <LoginButton />
        ) : (
          <ProfileDropdown user={user} logout={logout} />
        )}
      </nav>
    </SafeArea>
  );
}
