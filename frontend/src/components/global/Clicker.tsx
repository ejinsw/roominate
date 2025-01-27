"use client";

import { useState } from "react";

interface Props {
  className?: string;
}

export function Clicker({ className }: Props) {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return <button className={`px-4 py-2 border rounded-lg hover:border-blue-500 focus:border-blue-500 focus:border-2 ${className}`} onClick={incrementCount}>
    Count {count}
  </button>;
}
