"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginForm } from "@/components/login/LoginForm";
import { SubmitButton } from "@/components/login/SubmitButton";
import { LoginBackground } from "@/components/login/LoginBackground";
import { LoginFormMultiple } from "@/components/login/LoginFormMultiple";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, [user]);

  const yearOptions = [
    { value: "", label: "Select year" },
    { value: "1", label: "Freshman" },
    { value: "2", label: "Sophomore" },
    { value: "3", label: "Junior" },
    { value: "4", label: "Senior" },
    { value: "5", label: "Super Senior" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-Binary", label: "Non-Binary" },
    { value: "Other", label: "Other" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          body: JSON.stringify({ email, password, year, name }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        setError("An unexpected error occurred.");
      }

      const data = await res.json();

      if (data.message) {
        setError(data.message);
        return;
      }

      await fetch("/api/auth/token", {
        method: "POST",
        body: JSON.stringify({ token: data.token }),
      });

      window.location.href = "/signup/preferences";
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <LoginBackground />
      <Title
        title="Roominate"
        className="text-6xl font-bold text-[#2774AE] drop-shadow-md relative"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg relative"
      >
        <LoginForm
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          required
        />
        <LoginForm
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <LoginForm
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <LoginFormMultiple
          id="year"
          label="Year of College"
          value={year}
          onChange={setYear}
          options={yearOptions}
          required
        />
        <LoginFormMultiple
          id="gender"
          label="Gender"
          value={gender}
          onChange={setGender}
          options={genderOptions}
          required
        />
        <SubmitButton>Make Account</SubmitButton>
        <div className="flex flex-col justify-center items-center">
          {error && <small className="text-red-500">{error}</small>}
          <small className="mt-2 font-semibold">
            Have an account?{" "}
            <Link href="/login" className="hover:text-blue-500">
              Log In
            </Link>
          </small>
        </div>
      </form>
    </div>
  );
}
