"use client";

interface Props {
  title: string;
  className?: string;
}

export function Title({ title, className }: Props) {
  return <h1 className={`${className}`}>{title}</h1>;
}
