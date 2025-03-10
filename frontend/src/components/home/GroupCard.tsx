"use client";

import { Group } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn/Button";

interface groupCardProps {
  group: Group;
}

const GroupCard = ({ group }: groupCardProps) => {
  const getDisplayPreferences = () => {
    if (
      !group.preferences ||
      !group.preferences.preferences ||
      group.preferences.preferences.length === 0
    ) {
      return null;
    }

    const prefsWithSortOrder = group.preferences.preferences.map((pref) => {
      let sortOrder = 3;

      switch (pref.importance) {
        case "High":
          sortOrder = 1;
          break;
        case "Medium":
          sortOrder = 2;
          break;
        case "Low":
          sortOrder = 3;
          break;
      }

      return {
        name: pref.preference.value,
        value: pref.option,
        importance: pref.importance,
        sortOrder: sortOrder,
      };
    });
    return prefsWithSortOrder.sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const displayPrefs = getDisplayPreferences();

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "High":
        return (
          <span
            className="w-2 h-2 rounded-full bg-red-500"
            title="High importance"
          ></span>
        );
      case "Medium":
        return (
          <span
            className="w-2 h-2 rounded-full bg-yellow-500"
            title="Medium importance"
          ></span>
        );
      case "Low":
        return (
          <span
            className="w-2 h-2 rounded-full bg-green-400"
            title="Low importance"
          ></span>
        );
      default:
        return (
          <span
            className="w-2 h-2 rounded-full bg-gray-400"
            title={importance}
          ></span>
        );
    }
  };

  return (
    <Link href={`/group/${group.id}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2774AE]">
              {group.name}
            </h2>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-[#2774AE] mb-2">
            Preferences
          </h3>

          {displayPrefs ? (
            <div className="grid grid-cols-1 gap-2">
              {displayPrefs.map((pref, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm py-1 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 w-1/2">
                    {getImportanceBadge(pref.importance || "")}
                    <span className="text-gray-800 truncate">{pref.name}</span>
                  </div>
                  <div className="w-1/2 text-gray-600 truncate pl-2">
                    {pref.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No preferences available
            </p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-md font-semibold text-[#2774AE] mb-2">Users</h3>
          {group.users && group.users.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {group.users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm py-1"
                >
                  <div
                    className="flex justify-center items-center h-10 aspect-square rounded-full bg-white border font-bold text-gray-500"
                  >
                    {user.name[0]}
                  </div>
                  <span className="text-gray-800 truncate">{user.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No users available</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
