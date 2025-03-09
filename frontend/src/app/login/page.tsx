"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginForm } from "@/components/login/LoginForm";
import { SubmitButton } from "@/components/login/SubmitButton";
import { LoginBackground } from "@/components/login/LoginBackground";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();
  
    useEffect(() => {
      if (user) {
        window.location.href = "/home";
      }
    }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        body: JSON.stringify({ email, password }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

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

      window.location.href = "/home";
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
        <SubmitButton>Sign In</SubmitButton>
        <div className="flex flex-col justify-center items-center">
          {error && <small className="text-red-500">{error}</small>}
          <small className="font-semibold">
            {"Don't have an account?"}{" "}
            <Link href="/signup" className="hover:text-blue-500">
              Sign up
            </Link>
          </small>
        </div>
      </form>
    </div>
  );
}
