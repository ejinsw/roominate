"use client";

import Link from "next/link";
import { TypeWriter } from "./TypeWriter";

export function CTA() {
  return (
    <div className="flex flex-col items-center md:items-start border text-center p-12 md:p-36 m-12 rounded-lg">
      <h1 className="text-6xl font-bold md:text-left mb-8">
        Find roommates for{" "}
        <TypeWriter className="text-blue-500" words={["apartments", "dorms"]} />
      </h1>
      <p className="md:text-left text-xl text-neutral-500">
        A <span className="font-bold">UCLA-exclusive</span> roommate-matching
        platform designed to help Bruins find the best living companions. Smart
        matches. Great experiences.
      </p>
      <Link
        className={`mt-4 group bg-white text-slate-900 relative flex w-fit items-center justify-center overflow-hidden 
            rounded-md border-2 border-slate-900 px-4 py-1 
            transition-transform ease-out hover:scale-[101%]`}
        href={`/login`}
      >
        <span
          className={`absolute inset-0 -z-10 h-full rounded bg-yellow-300 transition-transform duration-300 
            ease-in-out group-hover:translate-y-0 translate-y-8`}
        ></span>
        <span className="font-bold">Get Started</span>
      </Link>
    </div>
  );
}
