"use client";

import React, { useState } from "react";
import { User, UserPreferences } from "@/types/types";
import { useUser } from "@/context/UserContext";

// Constants for dropdown options
const GENDER_OPTIONS = ["Male", "Female", "Non-Binary", "Other"];
const ACADEMIC_YEAR_OPTIONS = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Above",
];
const HOUSING_OPTIONS = [
  "Sproul Cove",
  "Sproul Landing",
  "Tipuana",
  "Rieber Hall",
  "Centennial Hall",
];
const PREFERENCE_CATEGORIES = [
  "Preferred Noise Level",
  "Smoking Policy",
  "Guest Frequency",
  "Bathroom Type",
  "Cleaning Habits",
];

interface SettingsPageProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<void>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [year, setYear] = useState(user.year || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: Partial<User> = {
      name,
      email,
      year: year ? Number(year) : null,
    };
    await onSave(updatedUser);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="mb-8">
        <div className="flex items-center gap-4"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium">Group Status</label>
          <div className="text-gray-700">
            {user.group ? `Member of: ${user.group.name}` : "Not in a group"}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="year" className="block font-medium">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Modify the default export to use the mock data
export default function SettingsPageWrapper() {
  const { user } = useUser();
  const handleSave = async (updatedUser: Partial<User>) => {
    console.log("Saving user updates:", updatedUser);
    // In a real application, this would make an API call
  };
  if (user === null) {
    return <div>No user found</div>; // Handle the case where user is null
  }

  return <SettingsPage user={user} onSave={handleSave} />;
}
