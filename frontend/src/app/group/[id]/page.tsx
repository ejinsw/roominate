"use client";

import { use, useEffect, useState } from "react";
import NavBar from "@/components/global/NavBar";
import { Group } from "@/types/types";
import { Skeleton } from "@/components/global/Skeleton";
import { ProfileTab } from "@/components/group/ProfileTab";
import SafeArea from "@/components/global/SafeArea";

export default function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const getGroup = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/groups/${id}`
        );
        const data = await res.json();

        setGroup(data.group);
      } catch (error) {
        console.log(error);
      }
    };

    getGroup();
  }, [id]);

  return (
    <>
      <NavBar />
      <SafeArea className="py-8 flex flex-col gap-8 min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
        <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
          {group ? (
            <h1 className="text-3xl font-bold text-blue-500">{group.name}</h1>
          ) : (
            <Skeleton className="rounded-full w-1/3 h-12" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">Description</h2>
              {group ? (
                <p className="text-gray-800">{group?.description}</p>
              ) : (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </>
              )}
            </section>

            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">
                Group Preferences
              </h2>
              {group && group.preferences ? (
                <div className="space-y-3">
                  {group.preferences.preferences.map((preference) => (
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
              ) : (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </>
              )}
            </section>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#2774AE]">Members</h2>
          <div className="flex flex-col gap-4">
            {group && group.users ? (
              group.users.map((user) => (
                <ProfileTab key={user.id} user={user} />
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </SafeArea>
    </>
  );
}
