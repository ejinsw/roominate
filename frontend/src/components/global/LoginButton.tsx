"use client";

import { Button } from "../shadcn/Button";

interface Props {
  className?: string;
}

export function LoginButton({ className }: Props) {
  return (
    <Button
      variant="outline"
      className={`border-black ${className}`}
      onClick={() => {
        window.location.href = "/login";
      }}
    >
      Sign In
    </Button>
  );
}
