"use client";

import { useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginForm } from "@/components/login/LoginForm";
import { SubmitButton } from "@/components/login/SubmitButton";
import { LoginBackground } from "@/components/login/LoginBackground";
import { LoginFormMultiple } from "@/components/login/LoginFormMultiple";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const yearOptions = [
    { value: "", label: "Select year" },
    { value: "1", label: "Freshman" },
    { value: "2", label: "Sophomore" },
    { value: "3", label: "Junior" },
    { value: "4", label: "Senior" },
    { value: "5+", label: "Super Senior" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen bg-gradient-to-b from-white to-[#E6F3FF]">
      <LoginBackground />
      <Title title="Roominate" className="text-6xl font-bold text-[#2774AE] drop-shadow-md relative" />
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg relative">
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
        <SubmitButton>Next</SubmitButton>
      </form>
    </div>
  );
}
