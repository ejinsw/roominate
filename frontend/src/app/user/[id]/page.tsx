"use client";

import { useState } from "react";
import NavBar from "@/components/global/NavBar";
import Image from "next/image";
import CircleProfile from "@/components/user/CircleProfile";
import InterestBubble from "@/components/user/InterestBubble";

export default function UserProfile() {
  const [user] = useState({
    name: "Ankai",
    year: "Sophomore",
    major: "Computer Science",
    interests: ["Cooking Dumplings", "Gym", "Merging pull requests"],
    bio: "wsg I'm Ankai I like to cook dumplings and go to the gym. I also like to merge pull requests.",
    preferences: {
      Cleanliness: "Very Clean",
      Noise: "Quiet",
      "Sleep Schedule": "I don't sleep",
      Visitors: "Occasionally"
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          
          <CircleProfile
            imageSrc="/Ankai.png"
            name={user.name}
            year={user.year}
            major={user.major}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#2774AE]">About Me</h2>
              <p className="text-gray-700">{user.bio}</p>
              
              <h3 className="text-xl font-bold text-[#2774AE] mt-6">Interests</h3>
              <InterestBubble interests={user.interests} />
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#2774AE]">Roommate Preferences</h2>
              <div className="space-y-2">
                {Object.entries(user.preferences).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-550">{key}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
