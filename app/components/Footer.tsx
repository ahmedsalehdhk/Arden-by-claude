import Link from "next/link";
import Image from "next/image";

// Inline social glyphs — matches the set used in the mobile nav overlay.
type IconProps = { size?: number; className?: string };

const FacebookIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.5-1.5H16.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.4H7.6v3.1h2.7V21h3.2z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3v-11zm7 0h3.8v1.5h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v5.46h-4v-4.84c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57v4.92h-4v-11z" />
  </svg>
);

const SOCIALS = [
  { label: "Facebook",  href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn",  href: "#", Icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] pt-16 sm:pt-20 pb-8 px-[7.5%]">
      {/* Top: logo only */}
      <div className="pb-6 sm:pb-8">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="Arden Holdings"
            width={220}
            height={56}
            className="h-[52px] sm:h-[60px] w-auto brightness-0 invert"
          />
        </Link>
      </div>

      {/* Contact + Address row */}
      <div className="pb-6 sm:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 items-start">
        {/* Left — Phone + Email */}
        <ul className="space-y-3 sm:space-y-4">
          <li className="font-sans text-white/70" style={{ fontSize: "15px" }}>
            Phone:&nbsp;
            <a href="tel:+8801615759822" className="text-white hover:text-[#c9a54a] transition-colors">
              +88 016 1575 9822
            </a>
          </li>
          <li className="font-sans text-white/70" style={{ fontSize: "15px" }}>
            Email:&nbsp;
            <a
              href="mailto:contact@ardenholdingsltd.com"
              className="text-white hover:text-[#c9a54a] transition-colors break-all"
            >
              contact@ardenholdingsltd.com
            </a>
          </li>
        </ul>

        {/* Right — Address, right-aligned on wider screens */}
        <div className="sm:text-right">
          <p
            className="font-sans text-white mb-3"
            style={{ fontSize: "13px", letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Address
          </p>
          <p className="font-sans text-white/70" style={{ fontSize: "15px", lineHeight: 1.6 }}>
            House 40 (2nd Floor), Road 20,<br />Mohakhali DOHS, Dhaka-1206
          </p>
        </div>
      </div>

      {/* Bottom bar — on mobile: socials first, copyright below.
          On desktop: copyright left, socials right. */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-sans text-white/50" style={{ fontSize: "12px" }}>
          <p>&copy; {new Date().getFullYear()} Arden Holdings Ltd. All rights reserved.</p>
          <span className="hidden sm:inline text-white/25">|</span>
          <p>
            Made By{" "}
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Proteron Digital
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:text-[#c9a54a] hover:border-[#c9a54a]/60 transition-colors"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
