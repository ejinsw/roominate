"use client";
import Banner from "@/components/home/Banner";
import Filter from "@/components/home/Filter";
import UserCard from "@/components/home/UserCard";
import { useUser } from "@/context/UserContext";
import { getGroup, getUser } from "@/lib/utils";
import { Group, User } from "@/types/types";
import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";
import { Plus } from "lucide-react";
import Link from "next/link";

export function HomePage({
  query,
  housing,
  preferences,
}: {
  query: string;
  housing: string[];
  preferences: string[];
}) {
  const { user } = useUser();
  const [searchType, setSearchType] = useState<"user" | "group">("user");
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query ?? "");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filterOptions, setFilterOptions] = useState<
    {
      label: string;
      options: string[];
      callback: (input: string[]) => void;
    }[]
  >([]);
  const [filters, setFilters] = useState<{
    gender: string[];
    preferences: string[];
    housing: string[];
    year: string[];
  }>({ gender: [], preferences: [], housing: [], year: [] });

  const handleUserFilterSubmit = () => {
    setLoading(true);
    getUser(searchInput, user?.id ?? "", filters)
      .then((data) => {
        // Filter out the current user
        const filteredUsers = data.filter((u) => u.id !== user?.id);
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleGroupFilterSubmit = () => {
    setLoading(true);
    getGroup(searchInput, filters)
      .then((data: Group[]) => {
        // Filter out the current user
        setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getUser(searchInput, user.id ?? "", filters).then((data) => {
      // Filter out the current user
      const filteredUsers = data.filter((u) => u.id !== user.id);
      setUsers(filteredUsers);
      setLoading(false);
    });

    getGroup(searchInput, filters)
      .then((data: Group[]) => {
        // Filter out the current user
        setGroups(data);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const currFilters = [];

    currFilters.push({
      label: "Preferences",
      options: preferences,
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.preferences = val;
        setFilters(newFilters);
      },
    });

    currFilters.push({
      label: "Housing",
      options: housing,
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.housing = val;
        setFilters(newFilters);
      },
    });

    if (searchType === "user") {
      currFilters.push({
        label: "Gender",
        options: ["Male", "Female", "Non-Binary", "Other"],
        callback: (val: string[]) => {
          const newFilters = { ...filters };
          newFilters.gender = val;
          setFilters(newFilters);
        },
      });

      // Get Year
      currFilters.push({
        label: "Year",
        options: ["1", "2", "3", "4", "5"],
        callback: (val: string[]) => {
          const newFilters = { ...filters };
          newFilters.year = val;
          setFilters(newFilters);
        },
      });
    }

    setFilterOptions(currFilters);
  }, [searchType]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <Banner />
      <div className="flex flex-row flex-1">
        <div className="flex flex-col items-center bg-gray-50 p-5 border-r border-gray-200">
          <div className="flex gap-4 justify-center items-center w-full mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${searchType === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                }`}
              onClick={() => setSearchType("user")}
            >
              User
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${searchType === "group"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                }`}
              onClick={() => setSearchType("group")}
            >
              Group
            </button>
          </div>
          {searchType === "group" && (
            <Filter
              type={searchType}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              filters={filterOptions}
              handleSubmit={handleGroupFilterSubmit}
            />
          )}
          {searchType === "user" && (
            <Filter
              type={searchType}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              filters={filterOptions}
              handleSubmit={handleUserFilterSubmit}
            />
          )}
        </div>
        <div className="flex-1 p-6">
          {searchType === "user" && (
            <>
              <h1 className="text-2xl font-bold text-[#2774AE] mb-6">
                Find Roommates
              </h1>
              {users.length === 0 || loading ? (
                <div className="bg-white/80 rounded-lg p-8 text-center shadow-sm border border-gray-200">
                  <p className="text-gray-600">
                    {loading ? "Loading..." : "No matching users found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => {
                    if (!user.onBoardingComplete) return;
                    return <UserCard key={user.id} user={user} />;
                  })}
                </div>
              )}
            </>
          )}
          {searchType === "group" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#2774AE]">
                  Find Groups
                </h1>
                <Link href="/group">
                  <button className="flex items-center gap-2 bg-[#2774AE] hover:bg-[#1D5A8A] text-white px-4 py-2 rounded-lg transition-colors">
                    <Plus size={18} />
                    <span>Create Group</span>
                  </button>
                </Link>
              </div>

              {groups.length === 0 || loading ? (
                <div className="bg-white/80 rounded-lg p-8 text-center shadow-sm border border-gray-200">
                  <p className="text-gray-600">
                    {loading ? "Loading..." : "No matching groups found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group) => {
                    return <GroupCard key={group.id} group={group} />;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
