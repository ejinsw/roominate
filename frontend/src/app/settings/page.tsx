"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginBackground } from "@/components/login/LoginBackground";
import { SubmitButton } from "@/components/login/SubmitButton";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Housing, Preference } from "@/types/types";
import { Trash2, ArrowLeft } from "lucide-react";

const MAX_BIO_LENGTH = 300;
const MAX_INTERESTS = 7;
const MAX_HOUSING_PREFERENCES = 5;

interface SelectedHousing {
  id: string;
  name: string;
}

async function getPreferences(): Promise<Preference[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`);
    const data = await res.json();
    return data.preferences;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getHousing(): Promise<Housing[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/housing`);
    const data = await res.json();
    return data.housing;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [interestError, setInterestError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [housingOptions, setHousingOptions] = useState<Housing[]>([]);
  const [selectedHousingOptions, setSelectedHousingOptions] = useState<
    SelectedHousing[]
  >([]);
  const [selectedHousing, setSelectedHousing] = useState("");
  const [housingError, setHousingError] = useState("");

  const [preferences, setPreferences] = useState<{
    [key: string]: { option: string; importance: string };
  }>({});
  const [preferenceOptions, setPreferenceOptions] = useState<Preference[]>([]);

  const importanceOptions = [
    { value: "High", label: "High importance" },
    { value: "Medium", label: "Medium importance" },
    { value: "Low", label: "Low importance" },
  ];

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

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      setIsLoading(true);

      try {
        const preferenceData = await getPreferences();
        setPreferenceOptions(preferenceData);

        const initialPreferences: {
          [key: string]: { option: string; importance: string };
        } = {};
        preferenceData.forEach((pref) => {
          initialPreferences[pref.id] = { option: "", importance: "Low" };
        });

        setPreferences(initialPreferences);
        setName(user?.name || "");
        setEmail(user?.email || "");

        setBio(user?.bio || "");
        setInterests(user?.interests || []);

        const housingData = await getHousing();

        setHousingOptions(housingData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_BIO_LENGTH) {
      setBio(text);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setName(text);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setEmail(text);
  };

  const handleAddInterest = () => {
    setInterestError("");

    if (!newInterest.trim()) {
      return;
    }

    if (interests.includes(newInterest.trim())) {
      setInterestError("This interest was already added");
      return;
    }

    if (interests.length >= MAX_INTERESTS) {
      setInterestError(`Maximum ${MAX_INTERESTS} interests allowed`);
      return;
    }

    setInterests([...interests, newInterest.trim()]);
    setNewInterest("");
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
    setInterestError("");
  };

  const handleAddHousing = () => {
    setHousingError("");

    if (!selectedHousing) {
      return;
    }

    if (
      selectedHousingOptions.some((option) => option.id === selectedHousing)
    ) {
      setHousingError("This housing option was already added");
      return;
    }

    if (selectedHousingOptions.length >= MAX_HOUSING_PREFERENCES) {
      setHousingError(
        `Maximum ${MAX_HOUSING_PREFERENCES} housing preferences allowed`
      );
      return;
    }

    const selectedOption = housingOptions.find(
      (option) => option.id === selectedHousing
    );

    if (selectedOption) {
      setSelectedHousingOptions([
        ...selectedHousingOptions,
        {
          id: selectedOption.id || "",
          name: selectedOption.name || "",
        },
      ]);
      setSelectedHousing("");
    }
  };

  const handleRemoveHousing = (housingId: string) => {
    setSelectedHousingOptions(
      selectedHousingOptions.filter((h) => h.id !== housingId)
    );
    setHousingError("");
  };

  const handlePreferenceOptionChange = (prefId: string, option: string) => {
    setPreferences((prev) => ({
      ...prev,
      [prefId]: { ...prev[prefId], option },
    }));
  };

  const handlePreferenceImportanceChange = (
    prefId: string,
    importance: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [prefId]: { ...prev[prefId], importance },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("User not logged in");
      return;
    }

    const missingPreferences = [];
    for (const [prefId, prefValue] of Object.entries(preferences)) {
      if (!prefValue.option) {
        const prefOption = preferenceOptions.find((p) => p.id === prefId);
        if (prefOption) {
          missingPreferences.push(prefOption.value);
        }
      }
    }

    if (missingPreferences.length > 0) {
      setError(
        `Please fill in all preferences: ${missingPreferences.join(", ")}`
      );
      return;
    }

    if (selectedHousingOptions.length < 1) {
      setError(`Please select at least 1 housing preference`);
      setHousingError(`At least 1 housing preference is required`);
      return;
    }

    setIsLoading(true);

    try {
      const formattedPreferences = Object.entries(preferences).map(
        ([prefId, value]) => ({
          id: prefId,
          option: value.option,
          importance: value.importance,
        })
      );

      const res = await fetch("/api/auth/token");
      const data = await res.json();
      const token = data.token.value;

      console.log("IN UPDATING");

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          bio,
          interests,
          preferences: formattedPreferences,
          housing: selectedHousingOptions.map((house) => ({ id: house.id })),
        }),
      });

      console.log("IN CHANGING ONBOARDING");

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update/on-boarding`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  if (isLoading && preferenceOptions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2774AE]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center min-h-screen py-10 bg-gradient-to-b from-white to-[#E6F3FF]">
      <LoginBackground />
      <Title
        title="Update Your Profile"
        className="text-4xl font-bold text-[#2774AE] drop-shadow-md relative"
      />

      <div className="w-full max-w-2xl flex justify-start mb-2">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2774AE] text-white rounded-lg hover:bg-[#1D5A8A] transition-colors duration-200"
        >
          <ArrowLeft size={18} />
          <span>Home</span>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 bg-white p-8 rounded-lg shadow-lg relative"
      >
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-[#2774AE] border-b pb-2">
            Personal Information
          </h3>
          <div className="w-full">
            <div className="flex justify-between">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name
              </label>
            </div>
            <textarea
              id="name"
              name="name"
              rows={4}
              value={name}
              onChange={handleNameChange}
              placeholder="Ex: First Last"
              className="h-10 mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
            </div>
            <textarea
              id="email"
              name="email"
              rows={4}
              value={email}
              onChange={handleEmailChange}
              placeholder="Tell others about yourself..."
              className="h-10 mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              <label htmlFor="bio" className="block text-gray-700 font-medium">
                Bio (Optional)
              </label>
              <span
                className={`text-xs ${bio.length >= MAX_BIO_LENGTH * 0.9
                  ? "text-red-500"
                  : "text-gray-500"
                  }`}
              >
                {bio.length}/{MAX_BIO_LENGTH}
              </span>
            </div>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={bio}
              onChange={handleBioChange}
              placeholder="Tell others about yourself..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-gray-700 font-medium">
                Interests
              </label>
              <span
                className={`text-xs ${interests.length >= MAX_INTERESTS * 0.8
                  ? "text-red-500"
                  : "text-gray-500"
                  }`}
              >
                {interests.length}/{MAX_INTERESTS}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              {interests.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No interests added yet
                </p>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                disabled={interests.length >= MAX_INTERESTS}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                disabled={interests.length >= MAX_INTERESTS}
                className={`${interests.length >= MAX_INTERESTS
                  ? "bg-gray-400"
                  : "bg-[#2774AE] hover:bg-[#407ead]"
                  } text-white px-4 py-2 rounded-r-lg transition-colors`}
              >
                Add
              </button>
            </div>
            {interestError && (
              <p className="text-red-500 text-sm mt-1">{interestError}</p>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <h3 className="text-lg font-medium text-[#2774AE] border-b pb-2">
            Housing Preferences
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-gray-700 font-medium">
                Reselect Preferred Housing Options
              </label>
              <span
                className={`text-xs ${selectedHousingOptions.length >= MAX_HOUSING_PREFERENCES * 0.8
                  ? "text-red-500"
                  : "text-gray-500"
                  }`}
              >
                {selectedHousingOptions.length}/{MAX_HOUSING_PREFERENCES}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
              {selectedHousingOptions.map((housing) => (
                <div
                  key={housing.id}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{housing.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHousing(housing.id)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>
            <div className="flex">
              <select
                value={selectedHousing}
                onChange={(e) => setSelectedHousing(e.target.value)}
                disabled={
                  selectedHousingOptions.length >= MAX_HOUSING_PREFERENCES
                }
                className={`flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE] ${selectedHousingOptions.length < 1 && housingError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
                  }`}
              >
                <option value="">Select housing option</option>
                {housingOptions.map((option) => (
                  <option key={option.id} value={option.id || ""}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddHousing}
                disabled={
                  !selectedHousing ||
                  selectedHousingOptions.length >= MAX_HOUSING_PREFERENCES
                }
                className={`${!selectedHousing ||
                  selectedHousingOptions.length >= MAX_HOUSING_PREFERENCES
                  ? "bg-gray-400"
                  : "bg-[#2774AE] hover:bg-[#407ead]"
                  } text-white px-4 py-2 rounded-r-lg transition-colors`}
              >
                Add
              </button>
            </div>
            {housingError && (
              <p className="text-red-500 text-sm mt-1">{housingError}</p>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <h3 className="text-lg font-medium text-[#2774AE] border-b pb-2">
            Roommate Preferences
          </h3>
          <label className="block text-gray-700 font-medium">
            Reselect Preferred Roommate Options
          </label>

          {preferenceOptions.map((pref) => (
            <div key={pref.id} className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800">{pref.value}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Option
                  </label>
                  <select
                    value={preferences[pref.id]?.option || ""}
                    onChange={(e) =>
                      handlePreferenceOptionChange(pref.id, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
                  >
                    <option value="">Select an option</option>
                    {pref.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Importance
                  </label>
                  <select
                    value={preferences[pref.id]?.importance || "Low"}
                    onChange={(e) =>
                      handlePreferenceImportanceChange(pref.id, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
                  >
                    {importanceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SubmitButton>
          {isLoading ? "Saving..." : "Update Profile"}
        </SubmitButton>

        <div className="flex flex-col justify-center items-center mt-4">
          {error && <small className="text-red-500">{error}</small>}
        </div>
        <div className="mt-12 border-t-2 border-red-200 pt-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-600">
                  Permanently remove your account and all associated data
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              ) : (
                <div className="bg-red-50 p-5 rounded-lg border border-red-300 shadow-sm w-full mt-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-full flex-shrink-0 mt-0.5">
                      <Trash2 size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Confirm Account Deletion</h4>
                      <p className="text-red-700 text-sm">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-colors border border-gray-300"
                    >
                      Cancel
                    </button>
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
                          <span>Delete Account</span>
                        </>
                      )}
                    </button>
                  </div>
                  {deleteError && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
                      {deleteError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
