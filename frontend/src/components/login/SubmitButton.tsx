"use client";

interface SubmitButtonInterface {
    children: React.ReactNode;
  }
  
  export function SubmitButton({ children }: SubmitButtonInterface) {
    return (
      <button
        type="submit"
        className="w-full bg-[#2774AE] text-white py-3 px-4 rounded-lg font-semibold
        hover:bg-[#407ead] hover:shadow-md
        focus:ring-4 focus:ring-[#ffea8c] focus:outline-none"
      >
        {children}
      </button>
    );
  }