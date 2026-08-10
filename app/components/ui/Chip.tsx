import { ButtonHTMLAttributes, HTMLAttributes } from "react";

type Variant = "status-active" | "status-upcoming" | "status-completed" | "category" | "filter";

interface BaseProps {
  variant?: Variant;
  active?: boolean;   // only meaningful for variant="filter"
}

// Uniform pill/tag styling — every badge on the site should route through this.
const VARIANT: Record<Variant, string> = {
  "status-active":    "bg-gold text-white px-2.5 py-1.5 text-[10px] tracking-[0.22em]",
  "status-upcoming":  "bg-ink text-white px-2.5 py-1.5 text-[10px] tracking-[0.22em]",
  "status-completed": "bg-ink/45 text-white px-2.5 py-1.5 text-[10px] tracking-[0.22em]",
  "category":         "bg-white/90 text-ink px-3 py-1.5 text-[10px] tracking-[0.22em]",
  "filter":           "px-5 sm:px-6 py-2 rounded-full text-[13px]",
};

// Non-interactive tag (span). Use for status/category badges.
export function Tag({
  variant = "status-active",
  className = "",
  children,
  ...rest
}: BaseProps & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`font-sans uppercase inline-flex items-center ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </span>
  );
}

// Interactive filter pill.
export function FilterChip({
  active = false,
  className = "",
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`font-sans ${VARIANT.filter} transition-all duration-300 ${
        active ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
