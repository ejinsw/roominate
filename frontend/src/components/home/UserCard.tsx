"use client";

import { User } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link href={`/user/${user.id}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2774AE]">
            <Image
              src="/Ankai.png" 
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2774AE]">{user.name}</h2>
            <p className="text-sm text-gray-600">Year {(user.year==5) ? user.year + "+": user.year}</p>
            <p className="text-sm text-gray-600">Computer Science</p> 
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-[#2774AE] mb-2">Preferences</h3>
          <div className="space-y-1">
            {user.preferences && Object.entries(user.preferences).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{key}</span>
                <span className="text-gray-900">{String(value)}</span>
              </div>
            ))}
            {!user.preferences && <p className="text-sm text-gray-500">No preferences available</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;