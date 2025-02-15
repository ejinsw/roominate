interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export default function SafeArea({ children, className }: ContentAreaProps) {
  return <div className={`px-4 md:px-32 lg:px-48 ${className}`}>{children}</div>;
}
