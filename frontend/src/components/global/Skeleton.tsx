"use client";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-500/50 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
