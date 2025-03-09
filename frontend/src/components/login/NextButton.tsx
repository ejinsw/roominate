"use client";

import Link from "next/link";

interface NextButtonInterface {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function NextButton({ children, href, onClick }: NextButtonInterface) {
  return (
    <Link href={href} className="w-full block">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-[#2774AE] text-white py-3 px-4 rounded-lg font-semibold
        hover:bg-[#407ead] hover:shadow-md
        focus:ring-4 focus:ring-[#ffea8c] focus:outline-none"
      >
        {children}
      </button>
    </Link>
  );
}