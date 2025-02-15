"use client";

import { useState } from "react";
import SafeArea from "./SafeArea";
import Link from "next/link";
import { LoginButton } from "./LoginButton";

export function Header({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = null;
  return (
    <header
      className={`flex justify-between py-6 items-center px-4 sticky top-4 m-auto w-[80%] h-12 bg-white border-2 rounded-xl border-black ${className}`}
    >
      <Link
        href="/"
        className="tracking-tighter uppercase text-xl font-bold font-sans text-blue-500 hover:scale-[101%] transition-transform duration-100 ease-out"
      >
        <span className="text-yellow-400">Room</span>inate
      </Link>
      <nav
        className={`gap-4 h-full items-center ${isOpen ? "hidden" : "flex"}`}
      >
        <Link href="/browse">Home</Link>
        <Link href="/browse">Browse</Link>
        {!user ? <LoginButton /> : <></>}
      </nav>
    </header>
  );
}
