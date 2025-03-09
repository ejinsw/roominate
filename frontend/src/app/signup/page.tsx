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
  const [major, setMajor] = useState("");

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

  const listedMajors = [
    "African American Studies",
    "African and Middle Eastern Studies",
    "American Indian Studies",
    "American Literature and Culture",
    "Ancient Near East and Egyptology",
    "Anthropology",
    "Arabic",
    "Art History",
    "Asian American Studies",
    "Asian Humanities",
    "Asian Languages and Linguistics",
    "Asian Religions",
    "Asian Studies",
    "Astrophysics",
    "Atmospheric and Oceanic Sciences",
    "Atmospheric and Oceanic Sciences/Mathematics",
    "Biochemistry",
    "Biology",
    "Biophysics",
    "Business Economics",
    "Central and East European Languages and Cultures",
    "Chemistry",
    "Chemistry/Materials Science",
    "Chicana and Chicano Studies",
    "Chinese",
    "Classical Civilization",
    "Climate Science",
    "Cognitive Science",
    "Communication",
    "Comparative Literature",
    "Computational and Systems Biology",
    "Data Theory",
    "Disability Studies",
    "Earth and Environmental Science",
    "Ecology, Behavior, and Evolution",
    "Economics",
    "English",
    "Environmental Science",
    "European Language and Transcultural Studies",
    "European Languages and Transcultural Studies with French and Francophone",
    "European Languages and Transcultural Studies with German",
    "European Languages and Transcultural Studies with Italian",
    "European Languages and Transcultural Studies with Scandinavian",
    "European Studies",
    "Gender Studies",
    "Geography",
    "Geography/Environmental Studies",
    "Geology",
    "Geology/Engineering Geology",
    "Geophysics",
    "Global Studies",
    "Greek",
    "Greek and Latin",
    "History",
    "Human Biology and Society",
    "International Development Studies",
    "Iranian Studies",
    "Japanese",
    "Jewish Studies",
    "Korean",
    "Labor Studies",
    "Latin",
    "Latin American Studies",
    "Linguistics",
    "Linguistics and Anthropology",
    "Linguistics and Asian Languages and Cultures",
    "Linguistics and Computer Science",
    "Linguistics and English",
    "Linguistics and Philosophy",
    "Linguistics and Psychology",
    "Linguistics and Spanish",
    "Linguistics, Applied",
    "Marine Biology",
    "Mathematics",
    "Mathematics, Applied",
    "Mathematics/Applied Science",
    "Mathematics/Economics",
    "Mathematics, Financial Actuarial",
    "Mathematics for Teaching",
    "Mathematics of Computation",
    "Microbiology, Immunology, and Molecular Genetics",
    "Middle Eastern Studies",
    "Molecular, Cell, and Developmental Biology",
    "Neuroscience",
    "Nordic Studies",
    "Philosophy",
    "Physics",
    "Physiological Science",
    "Political Science",
    "Portuguese and Brazilian Studies",
    "Psychobiology",
    "Psychology",
    "Religion, Study of",
    "Russian Language and Literature",
    "Russian Studies",
    "Sociology",
    "Southeast Asian Studies",
    "Spanish",
    "Spanish and Community and Culture",
    "Spanish and Linguistics",
    "Spanish and Portuguese",
    "Statistics and Data Science",
    "Individual Field of Concentration",
    "Architectural Studies",
    "Art",
    "Dance",
    "Design | Media Arts",
    "World Arts and Cultures",
    "Aerospace Engineering",
    "Bioengineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Computer Science",
    "Computer Science and Engineering",
    "Electrical Engineering",
    "Materials Engineering",
    "Mechanical Engineering",
    "Engineering - Undeclared",
    "Ethnomusicology",
    "Global Jazz Studies",
    "Musicology",
    "Music Composition",
    "Music Education",
    "Music Industry",
    "Music Performance",
    "Nursing - Prelicensure",
    "Public Affairs",
    "Film and Television",
    "Theater",
    "Education and Social Transformation",
    "Public Health"
  ];

  const uclaMajors = ["Undeclared", ...listedMajors.sort()].map(val => {
    return { value: val, label: val }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          body: JSON.stringify({ email, password, year, name, gender, major }),
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
          id="major"
          label="Major"
          value={major}
          onChange={setMajor}
          options={uclaMajors}
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
