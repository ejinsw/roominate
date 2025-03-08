"use client";
import Banner from "@/components/home/Banner";
import Filter from "@/components/home/Filter";
import { useUser } from "@/context/UserContext";
import { Housing, Preference, User } from "@/types/types";
import { useEffect, useState } from "react";

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

export default function Home() {
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);
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

  useEffect(() => {
    const debounce = setTimeout(() => {
      getUser(searchInput, user?.id ?? "", filters).then((data) => setUsers(data));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput, filters, user]);

  useEffect(() => {
    // Get Preferences
    const preferences: string[] = [];
    getPreferences().then((data) => {
      data.forEach((pref) => {
        preferences.push(pref.value);
      });
    });
    const preferenceFilter = {
      label: "Preferences",
      options: preferences,
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.preferences = val;
        setFilters(newFilters);
      },
    };

    // Get Housing
    const housing: string[] = [];
    getHousing().then((data) => {
      data.forEach((house) => {
        if (house.name) {
          housing.push(house.name);
        }
      });
    });
    const housingFilter = {
      label: "Housing",
      options: housing,
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.housing = val;
        setFilters(newFilters);
      },
    };

    // Get Gender
    const genderFilter = {
      label: "Gender",
      options: ["Male", "Female"],
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.gender = val;
        setFilters(newFilters);
      },
    };

    // Get Year
    const yearFilter = {
      label: "Year",
      options: ["1", "2", "3", "4", "5"],
      callback: (val: string[]) => {
        const newFilters = { ...filters };
        newFilters.year = val;
        setFilters(newFilters);
      },
    };

    setFilterOptions([
      genderFilter,
      preferenceFilter,
      housingFilter,
      yearFilter,
    ]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <NavBar /> */}
      <Banner />
      <div className="flex flex-row flex-1">
        <Filter
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filters={filterOptions}
        />
        <div>
          <h1 className="text-2xl font-bold text-[#2774AE]">Users</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(users.length ? users : []).map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-[#2774AE]">
                  {user.name}
                </h2>
                <p className="text-gray-800">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
