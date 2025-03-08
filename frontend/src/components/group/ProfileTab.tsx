"use client";

import { User } from "@/types/types";
import Link from "next/link";
import { Badge } from "./Badge";

interface Props {
  user: User | null;
  className?: string;
}

const numToYear = {
  1: "Freshman",
  2: "Sophomore",
  3: "Junior",
  4: "Senior",
  5: "Super Senior",
};

export function ProfileTab({ user, className }: Props) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-6 border shadow-sm hover: bg-white ${className}`}
    >
      <Link href={`/user/${user?.id}`} className="w-fit">
        <h1 className="text-2xl font-semibold text-blue-500 hover:text-blue-600">{user?.name}</h1>
      </Link>
      <div className="flex flex-col justify-center">
        <Badge >
          {numToYear[user?.year ?? 1]}
        </Badge>
      </div>
    </div>
  );
}
