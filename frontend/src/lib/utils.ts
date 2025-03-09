import { Housing, Preference, User } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?id=${id}`);
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