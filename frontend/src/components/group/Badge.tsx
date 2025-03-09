"use client";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ className, children }: Props) {
  return (
    <div className={`text-center text-sm rounded-xl px-2 py-1 border bg-orange-100 w-fit h-fit text-orange-700 ${className}`}>
        {children}
    </div>
  );
}
