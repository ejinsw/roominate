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
import { Invite, Request, User } from "@/types/types";
import { CircleUser, InboxIcon, LogOut, Search, Settings } from "lucide-react";
import { useState } from "react";

function Inbox({ user }: { user: User }) {
  const [invites, setInvites] = useState<Invite[]>(user.invites || []);
  const [requests, setRequests] = useState<Request[]>(user.requests || []);

  const handleAction = async (
    inviteId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invites/${inviteId}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setInvites((prevInvites) =>
        prevInvites.map((invite) =>
          invite.id === inviteId
            ? {
                ...invite,
                status: action === "accept" ? "accepted" : "rejected",
              }
            : invite
        )
      );
    } catch (error) {
      console.error(`Error while trying to ${action} invite:`, error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 aspect-square rounded-full bg-white border font-bold text-gray-500"
        >
          <InboxIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50">
        <DropdownMenuLabel>Inbox</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Invites</DropdownMenuLabel>
        <DropdownMenuGroup className="overflow-y-auto max-h-24">
          {invites.length > 0 ? (
            invites
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((invite) => (
                <DropdownMenuItem key={invite.id}>
                  <div className="flex justify-between items-center w-full">
                    <div>{invite.group.name.substring(0, 12)}...</div>
                    <div className="flex gap-2">
                      {invite.status === "pending" ? (
                        <>
                          <button
                            className="text-blue-400 hover:text-blue-600"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAction(invite.id, "accept");
                            }}
                          >
                            Join
                          </button>
                          <button
                            className="text-red-400 hover:text-red-600"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAction(invite.id, "reject");
                            }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="italic">{invite.status}</div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
          ) : (
            <DropdownMenuItem className="text-gray-500">
              No invites
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Requests</DropdownMenuLabel>
        <DropdownMenuGroup className="overflow-y-auto max-h-32">
          {requests.length > 0 ? (
            requests
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((invite) => (
                <DropdownMenuItem key={invite.id}>
                  <div className="flex justify-between items-center w-full">
                    <div>{invite.group.name.substring(0, 12)}...</div>
                    <div className="flex gap-2">
                      <div className="italic">{invite.status}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
          ) : (
            <DropdownMenuItem className="text-gray-500">
              No requests
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
            <Inbox user={user} />
          </>
        )}
      </nav>
    </SafeArea>
  );
}
