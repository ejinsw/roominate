"use client";

import React, { useState } from "react";
import { User, UserPreferences } from "@/types/types";

// Add mock user data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  year: 2024,
  group: {
    id: "g1",
    name: "Study Group A",
  },
  preferences: {
    id: "p1",
    preferences: [
      {
        id: "pref1",
        preference: {
          id: "cat1",
          category: "Study Time",
        },
        option: "Evening",
        importance: "High",
      },
      {
        id: "pref2",
        preference: {
          id: "cat2",
          category: "Study Location",
        },
        option: "Library",
        importance: "Medium",
      },
    ],
  },
};

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

// Add getUser function
const getUser = (): User => {
  // In a real application, this would fetch from an API
  return mockUser;
};

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
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {/* Profile picture preview or placeholder */}
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            className="block"
          />
        </div>
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
  const user = getUser();
  const handleSave = async (updatedUser: Partial<User>) => {
    console.log("Saving user updates:", updatedUser);
    // In a real application, this would make an API call
  };

  return <SettingsPage user={user} onSave={handleSave} />;
}
