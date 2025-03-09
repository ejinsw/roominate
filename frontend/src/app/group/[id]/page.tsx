"use client";

import { use, useEffect, useState } from "react";
import NavBar from "@/components/global/NavBar";
import { Group, User } from "@/types/types";
import { Skeleton } from "@/components/global/Skeleton";
import { ProfileTab } from "@/components/group/ProfileTab";
import SafeArea from "@/components/global/SafeArea";
import UserCard from "@/components/home/UserCard";
import { useUser } from "@/context/UserContext";

// Add this mock data near the top of the file, after the imports
const sampleGroup: Group = {
  id: "1",
  name: "UCLA Housing Squad",
  description:
    "We're a group of students looking for apartment-style housing near campus. We enjoy a balance of studying and socializing, and we're all clean and respectful roommates.",
  users: [
    {
      id: "user1",
      name: "John Doe",
      email: "john@ucla.edu",
      profileImage: "https://i.pravatar.cc/150?img=1",
      bio: "Computer Science major, junior year",
      preferences: {
        preferences: [
          {
            id: "1",
            preference: { id: "1", value: "Sleeping Schedule" },
            option: "Night Owl",
            importance: " (Very Important)",
          },
          {
            id: "2",
            preference: { id: "2", value: "Cleanliness" },
            option: "Very Clean",
            importance: " (Important)",
          },
        ],
      },
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@ucla.edu",
      profileImage: "https://i.pravatar.cc/150?img=2",
      bio: "Biology major, sophomore year",
      preferences: {
        preferences: [
          {
            id: "3",
            preference: { id: "3", value: "Study Habits" },
            option: "Library Regular",
            importance: " (Important)",
          },
        ],
      },
    },
  ],
  preferences: {
    preferences: [
      {
        id: "grp1",
        preference: { id: "p1", value: "Apartment Type" },
        option: "2B2B",
        importance: " (Required)",
      },
      {
        id: "grp2",
        preference: { id: "p2", value: "Location" },
        option: "Westwood",
        importance: " (Very Important)",
      },
      {
        id: "grp3",
        preference: { id: "p3", value: "Budget per Person" },
        option: "$1200-1500",
        importance: " (Required)",
      },
      {
        id: "grp4",
        preference: { id: "p4", value: "Lease Duration" },
        option: "12 months",
        importance: " (Flexible)",
      },
    ],
  },
};

async function getUser(
  name: string,
  userId: string,
  filters: {
    gender: string[];
    preferences: string[];
    housing: string[];
    year: string[];
  } = { gender: [], preferences: [], housing: [], year: [] }
): Promise<User[]> {
  try {
    const queryParams = new URLSearchParams({
      name,
      filters: JSON.stringify(filters),
    }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users?userId=${userId}&${queryParams}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function getGroup(id: string): Promise<Group | null> {
  // For testing, return the sample data instead of making an API call
  return sampleGroup;
  /*
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${id}`);
    const data = await res.json();
    return data.group;
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
  */
}

export default function GroupProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const groupData = await getGroup(id);
      setGroup(groupData);
      setLoading(false);
    };

    fetchGroup();
  }, [id]);

  //checks
  console.log(loading);
  console.log(group);
  if (loading) {
    return (
      <>
        <NavBar />
        <SafeArea className="py-8 flex flex-col gap-8 min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
          <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
            <Skeleton className="rounded-full w-1/3 h-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-[#2774AE]">
                  Description
                </h2>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </section>

              <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-[#2774AE]">
                  Group Preferences
                </h2>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </section>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#2774AE]">Members</h2>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </SafeArea>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <NavBar />
        <SafeArea className="py-8 flex flex-col gap-8 min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
          <div className="text-center">
            <h1 className="text-2xl text-gray-700">Group not found</h1>
          </div>
        </SafeArea>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <SafeArea className="py-8 flex flex-col gap-8 min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
        <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-blue-500">{group.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">Description</h2>
              <p className="text-gray-800">{group?.description}</p>
            </section>

            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">
                Group Preferences
              </h2>
              <div className="space-y-3">
                {group.preferences?.preferences.map((preference) => (
                  <div
                    key={preference.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 font-medium">
                      {preference.preference.value}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {preference.option}
                      {preference.importance}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#2774AE]">Members</h2>
          <div className="flex flex-col gap-4">
            {group.users.map((user) => (
              <ProfileTab key={user.id} user={user} />
            ))}
          </div>
        </div>
      </SafeArea>
    </>
  );
}
