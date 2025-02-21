"use client";

import SafeArea from "./SafeArea";
import Link from "next/link";
import { LoginButton } from "./LoginButton";

export function Header({ className }: { className?: string }) {
  const user = null;
  return (
    <SafeArea
      className={`flex justify-between py-6 items-center h-24 bg-white border-b ${className}`}
    >
      <Link
        href="/"
        className="tracking-tighter uppercase text-xl font-bold font-sans text-blue-500 hover:scale-[101%] transition-transform duration-100 ease-out"
      >
        <span className="text-yellow-400">Room</span>inate
      </Link>
      <nav
        className={`gap-4 h-full items-center flex`}
      >
        <Link href="/browse">Home</Link>
        <Link href="/browse">Browse</Link>
        {!user ? <LoginButton /> : <></>}
      </nav>
    </SafeArea>
  );
}
