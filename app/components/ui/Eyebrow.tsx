import { HTMLAttributes, ElementType } from "react";

type Size = "sm" | "md" | "lg";
type Tone = "muted" | "ink" | "gold" | "white";

interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: Size;
  tone?: Tone;
}

// The three eyebrow sizes and four color tones used across the homepage.
const SIZE: Record<Size, string> = {
  sm: "text-eyebrow-sm",     // 11px / 0.22em — captions under stats
  md: "text-eyebrow",        // 13px / 0.24em — inline links, chips
  lg: "text-eyebrow-lg",     // 15px / 0.32em — hero category labels
};

const TONE: Record<Tone, string> = {
  muted: "text-ink/35",
  ink:   "text-ink",
  gold:  "text-gold",
  white: "text-white",
};

export default function Eyebrow({
  as: Tag = "p",
  size = "sm",
  tone = "muted",
  className = "",
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Tag className={`font-sans uppercase ${SIZE[size]} ${TONE[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
