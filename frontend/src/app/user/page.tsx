"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import CircleProfile from "@/components/user/CircleProfile";
import InterestBubble from "@/components/user/InterestBubble";

export default function UserProfile() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">

          <CircleProfile
            imageSrc="/Ankai.png"
            name={user.name}
            year={user.year?.toString() ?? "Year not selected"}
            major={user.major ?? "Major not selected"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">About Me</h2>
              <p className="text-gray-800">{(user.bio) ? user.bio : "No bio available"}</p>

              <h3 className="text-xl font-bold text-[#2774AE] mt-6">Interests</h3>
              <InterestBubble interests={user.interests} />
            </section>

            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">Roommate Preferences</h2>
              <div className="space-y-4 overflow-y-auto max-h-64">
                {user.preferences ? (
                  <>
                    <div className="grid grid-cols-8 gap-2 pb-2 border-b border-gray-200 text-sm">
                      <span className="col-span-4 font-semibold text-gray-600">Preference</span>
                      <span className="col-span-2 font-semibold text-gray-600">Option</span>
                      <span className="col-span-2 font-semibold text-gray-600">Importance</span>
                    </div>
                    {user.preferences.preferences.map((preference) => (
                      <div key={preference.id} className="grid grid-cols-8 gap-2 items-center py-2 border-b border-gray-100">
                        <span className="col-span-4 text-gray-700">{preference.preference.value}</span>
                        <span className="col-span-2 font-medium text-gray-900">{preference.option}</span>
                        <div className="col-span-2">
                          {preference.importance === "High" && (
                            <span className="px-5 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                              {preference.importance}
                            </span>
                          )} 
                          {preference.importance === "Medium" && (
                            <span className="px-5 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                              {preference.importance}
                            </span>
                          )} 
                          {preference.importance === "Low" && (
                            <span className="px-5 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                              {preference.importance}
                            </span>
                          )} 
                          {!["High", "Medium", "Low"].includes(preference.importance || "") && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {preference.importance}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-500 italic">No preferences available</p>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}