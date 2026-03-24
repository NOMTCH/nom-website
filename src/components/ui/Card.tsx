import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accent?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
  accent = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-light border border-white/5 rounded-sm relative overflow-hidden",
        hover &&
          "transition-all duration-500 hover:border-accent/30 hover:-translate-y-1",
        accent && "border-l-2 border-l-accent",
        className
      )}
    >
      {children}
    </div>
  );
}
