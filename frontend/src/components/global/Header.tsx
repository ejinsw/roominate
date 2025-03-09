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
import { CircleUser, LogOut, Search, Settings } from "lucide-react";
import { useState } from "react";

function ProfileDropdown({ user, logout }: { user: User; logout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 aspect-square rounded-full bg-white border font-bold text-gray-500"
        >
          {user.name[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/user"
              className="flex justify-between items-center w-full"
            >
              Profile
              <CircleUser size={20} />
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
        <DropdownMenuItem
          className="flex justify-between items-center w-full text-red-500"
          onClick={logout}
        >
          Log out
          <LogOut size={20} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchBar() {
  const [search, setSearch] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) {
      window.location.href = "/home";
    } else {
      window.location.href = `/home?query=${search}`;
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex items-center">
      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
        <Search className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Search roommates..."
          className="bg-transparent border-none focus:outline-none px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
}

export function Header({ className }: { className?: string }) {
  const { user, logout } = useUser();
  return (
    <SafeArea
      className={`flex justify-between py-4 items-center min-h-12 shadow-lg bg-gray-100 border-b ${className}`}
    >
      <Link
        href="/"
        className="tracking-tighter uppercase text-xl font-bold font-sans text-blue-500 hover:scale-[101%] transition-transform duration-100 ease-out"
      >
        <span className="text-yellow-400">Room</span>inate
      </Link>
      <nav className={`gap-4 h-full items-center flex`}>
        {!user ? (
          <LoginButton />
        ) : (
          <>
            <SearchBar />
            <ProfileDropdown user={user} logout={logout} />
          </>
        )}
      </nav>
    </SafeArea>
  );
}
