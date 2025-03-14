"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import CircleProfile from "@/components/user/CircleProfile";
import InterestBubble from "@/components/user/InterestBubble";
import { Settings, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");
      
      const res = await fetch("/api/auth/token");
      const data = await res.json();
      const token = data.token.value;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      
      window.location.href = "/";
      
    } catch (error) {
      console.error("Delete account error:", error);
      setDeleteError("Failed to delete account. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link 
          href="/home" 
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#2774AE] text-white rounded-lg hover:bg-[#1D5A8A] transition-colors duration-200"
        >
          <ArrowLeft size={18} />
          <span>Browse Roommates</span>
        </Link>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 relative">
          <Link
            href="/settings"
            className="absolute top-4 right-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2"
            title="Edit Profile"
          >
            <Settings size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">Edit Profile</span>
          </Link>

          <CircleProfile
            imageSrc="/Ankai.png"
            name={user.name}
            year={user.year?.toString() ?? "Year not selected"}
            major={user.major ?? "Major not selected"}
            gender={user.gender ?? "Gender not specified"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">About Me</h2>
              <p className="text-gray-800">{(user.bio) ? user.bio : "No bio available"}</p>

              <h3 className="text-xl font-bold text-[#2774AE] mt-6">Interests</h3>
              <InterestBubble interests={user.interests} />

              <h3 className="text-xl font-bold text-[#2774AE] mt-6">Housing Preferences</h3>
              <div className="mt-3">
                {user.preferences?.preferredHousing && user.preferences?.preferredHousing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.preferences?.preferredHousing.map((housePref, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {housePref.housing.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No housing preferences available</p>
                )}
              </div>
            </section>

            <section className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#2774AE]">Roommate Preferences</h2>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Scroll to see all preferences</div>
              </div>
              <div
                className="space-y-4 overflow-y-auto max-h-64 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                style={{ overflowY: 'scroll' }}
              >
                {user.preferences ? (
                  <>
                    <div className="grid grid-cols-8 gap-2 pb-2 border-b border-gray-200 text-sm sticky top-0 bg-white/95 backdrop-blur-sm z-10">
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

          <div className="mt-8 border-t-2 border-red-200 pt-6">
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 transition-colors"
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                <p className="text-red-700 mb-4 font-medium">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Yes, Delete My Account</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {deleteError && <p className="text-red-500 mt-2 text-sm">{deleteError}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}