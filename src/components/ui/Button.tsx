import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-heading font-medium tracking-wider uppercase transition-all duration-300 relative overflow-hidden group";

  const variants = {
    primary:
      "bg-accent text-darker hover:bg-white",
    outline:
      "border border-accent text-accent hover:bg-accent hover:text-darker",
    ghost:
      "text-neutral hover:text-accent border-b border-transparent hover:border-accent",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
