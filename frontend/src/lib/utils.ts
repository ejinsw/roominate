import { Group, Housing, Preference, User } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPreferences(): Promise<Preference[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`);
    const data = await res.json();
    return data.preferences;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getHousing(): Promise<Housing[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/housing`);
    const data = await res.json();
    return data.housing;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users?id=${id}`
    );
    const data = await res.json();
    if (!data.length) {
      return null;
    }
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUser(
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

export async function getGroup(
  name: string,
  userId: string,
  filters: {
    preferences: string[];
    housing: string[];
  } = { preferences: [], housing: [] }
): Promise<Group[]> {
  try {
    const queryParams = new URLSearchParams({
      name,
      filters: JSON.stringify(filters),
    }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/groups/search?userId?=${userId}&${queryParams}`
    );
    const data = await res.json();
    return data.groups;
  } catch (error) {
    console.error("Error fetching group:", error);
    return [];
  }
}
