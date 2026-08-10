import { HTMLAttributes, ElementType } from "react";

type Tone = "bone" | "cream" | "ink";
type Rhythm = "default" | "compact" | "loose" | "flush";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: Tone;         // background color
  rhythm?: Rhythm;     // vertical padding rhythm
  edge?: boolean;      // apply px-edge horizontal padding (default true)
  innerClassName?: string;
}

const TONE: Record<Tone, string> = {
  bone: "bg-bone",
  cream: "bg-cream",
  ink: "bg-ink",
};

// All rhythms taken from the homepage sections.
const RHYTHM: Record<Rhythm, string> = {
  default: "py-16 sm:py-24 lg:py-36",   // StatisticsSection, ContactSection
  compact: "py-14 sm:py-20 lg:py-28",   // AboutSection
  loose:   "py-20 sm:py-28 lg:py-32",   // FeaturesSection (project detail)
  flush:   "",                          // caller controls padding
};

export default function Section({
  as: Tag = "section",
  tone = "bone",
  rhythm = "default",
  edge = true,
  className = "",
  innerClassName = "",
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag className={`${TONE[tone]} ${RHYTHM[rhythm]} ${className}`} {...rest}>
      <div className={`${edge ? "px-edge" : ""} ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
