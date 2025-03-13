"use client";

import { use, useEffect, useState } from "react";
import { Group } from "@/types/types";
import SafeArea from "@/components/global/SafeArea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/shadcn/Button";

export default function GroupProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useUser();
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const handleRequest = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: user?.id,
        groupID: id,
        message: "Hey, I'd love to join your group!",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Request sent:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    async function fetchGroup() {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/groups/search/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch group: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setGroup(data.group);
      } catch (error) {
        console.error("Error fetching group:", error);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [id]);

  const handleEditClick = () => {
    const isGroupMember =
      user && group?.users?.some((groupUser) => groupUser.id === user.id);
    if (isGroupMember) {
      console.log("in group");
    } else {
      console.log("not in group");
    }
  };

  if (loading) {
    return (
      <SafeArea>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-gray-600">Loading group...</div>
        </div>
      </SafeArea>
    );
  }

  if (!group) {
    return (
      <SafeArea>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-red-600">Group not found</div>
        </div>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#2774AE] mb-2">
              {group.name || "Unnamed Group"}
            </h1>
            {id !== user?.groupID ? (
              <Button variant="outline" onClick={handleRequest}>
                Request
              </Button>
            ) : (
              <></>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            {group.description || "No description available"}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Members: {group.users?.length || 0}</span>
            <span>•</span>
            <span>Status: {group.openToJoin ? "Open to Join" : "Closed"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#2774AE] mb-4">
              Group Members
            </h2>
            <div className="space-y-4">
              {group.users && group.users.length > 0 ? (
                group.users.map((user, index) => (
                  <Link
                    href={`/user/${user.id}`}
                    key={user.id || index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#2774AE] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.major || "Major not specified"} •{" "}
                        {user.year ? `Year ${user.year}` : "Year not specified"}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 italic">No members in this group</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#2774AE] mb-4">
              Group Preferences
            </h2>
            <div className="space-y-3">
              {group.preferences?.preferences &&
              group.preferences.preferences.length > 0 ? (
                group.preferences.preferences.map((pref, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${
                          pref.importance === "High"
                            ? "bg-red-100 text-red-700"
                            : pref.importance === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                      >
                        {pref.importance}
                      </span>
                      <span className="text-gray-900">
                        {pref.preference?.value}
                      </span>
                    </div>
                    <span className="text-gray-600">{pref.option}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No preferences set</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-[#2774AE] text-white rounded-lg hover:bg-[#1d5585] transition-colors"
          >
            Edit Group
          </button>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-2 border border-[#2774AE] text-[#2774AE] rounded-lg hover:bg-[#2774AE] hover:text-white transition-colors"
          >
            Browse Groups
          </button>
        </div>
      </div>
    </SafeArea>
  );
}
