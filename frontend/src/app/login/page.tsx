"use client";

import { useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginForm } from "@/components/login/LoginForm";
import { SubmitButton } from "@/components/login/SubmitButton";
import { LoginBackground } from "@/components/login/LoginBackground";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <LoginBackground />
      <Title title="Roominate" className="text-6xl font-bold text-[#2774AE] drop-shadow-md relative" />
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg relative">
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
        <small className="mt-2 font-semibold">
          Don't have an account? <Link href="/signup" className="hover:text-blue-500">Sign up</Link>
        </small>
      </form>
    </div>
  );
}
