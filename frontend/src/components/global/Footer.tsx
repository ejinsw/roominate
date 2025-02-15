"use client";

import Link from "next/link";
import SafeArea from "./SafeArea";

export function Footer() {
  return (
    <SafeArea className="text-neutral-200 bg-gray-600">
      <div className="container mx-auto flex mt-20 flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tighter text-white transition-colors duration-150 hover:text-yellow-400"
          >
            {"Roominate"}
          </Link>
          <span
            className="hidden text-5xl font-extralight font-sans leading-[0] text-neutral-400 sm:inline"
            aria-hidden="true"
          >
            /
          </span>
          <p>
            © {new Date().getFullYear()} {"Roominate"}
          </p>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex items-center gap-1">
            <li>
              <a
                href="/privacy-policy"
                className="text-sm text-neutral-400 transition-colors duration-150 hover:text-yellow-400"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <span className="text-sm text-neutral-400">|</span>
            </li>
            <li>
              <a
                href="/terms-of-use"
                className="text-sm text-neutral-400 transition-colors duration-150 hover:text-yellow-400"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </SafeArea>
  );
}
